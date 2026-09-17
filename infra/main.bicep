targetScope = 'subscription'

@minLength(1)
@maxLength(64)
@description('Name of the environment (e.g., dev, staging, prod)')
param environmentName string

@minLength(1)
@description('Primary location for all resources')
param location string

@description('Name of the API container app')
param apiContainerAppName string = ''

@description('Name of the Web container app')
param webContainerAppName string = ''

@description('Existing API image to preserve during provisioning, before deploying a new application image.')
param apiContainerImage string = 'mcr.microsoft.com/azuredocs/containerapps-helloworld:latest'

@description('Existing Web image to preserve during provisioning, before deploying a new application image.')
param webContainerImage string = 'mcr.microsoft.com/azuredocs/containerapps-helloworld:latest'

@description('Name of the Container Apps Environment')
param containerAppsEnvironmentName string = ''

@description('Name of the Azure Container Registry')
param containerRegistryName string = ''

@description('Name of the Log Analytics workspace')
param logAnalyticsName string = ''

@description('Foundry/model region. Defaults to the application region; override only if the model, version and SKU are unavailable there. Verify model availability and quota before provisioning.')
param aiLocation string = location

@description('OpenAI model name. Model, version, SKU and region must be a supported combination.')
param aiModelName string = 'gpt-5-mini'

param aiModelVersion string = '2025-08-07'
param aiModelSku string = 'GlobalStandard'

@minValue(1)
@description('Model deployment capacity in the model/SKU capacity units; subject to subscription quota.')
param aiModelCapacity int = 10

param aiModelDeploymentName string = 'recipe-model'

@description('Opt in to Foundry server-side tracing, which can store recipe prompts and model outputs in Application Insights. Application request/metric monitoring remains enabled independently.')
param enableFoundryTracing bool = false

@description('Object ID of the azd deployment identity, which creates the prompt agents after provisioning.')
@minLength(1)
param principalId string

@allowed([
  'User'
  'ServicePrincipal'
])
param principalType string = 'User'

var abbrs = loadJsonContent('./abbreviations.json')
var resourceToken = toLower(uniqueString(subscription().id, environmentName, location))
var tags = { 'azd-env-name': environmentName }

// Resource Group
resource rg 'Microsoft.Resources/resourceGroups@2024-03-01' = {
  name: 'rg-${environmentName}'
  location: location
  tags: tags
}

// Log Analytics workspace
module logAnalytics './modules/log-analytics.bicep' = {
  name: 'log-analytics'
  scope: rg
  params: {
    name: !empty(logAnalyticsName) ? logAnalyticsName : '${abbrs.operationalInsightsWorkspaces}${resourceToken}'
    location: location
    tags: tags
  }
}

module applicationInsights './modules/application-insights.bicep' = {
  name: 'application-insights'
  scope: rg
  params: {
    name: 'appi-${resourceToken}'
    location: location
    tags: tags
    workspaceResourceId: logAnalytics.outputs.id
  }
}

module foundry './modules/foundry.bicep' = {
  name: 'foundry'
  scope: rg
  params: {
    name: 'ai-${resourceToken}'
    projectName: 'recipes'
    location: aiLocation
    tags: tags
    modelDeploymentName: aiModelDeploymentName
    modelName: aiModelName
    modelVersion: aiModelVersion
    modelSku: aiModelSku
    modelCapacity: aiModelCapacity
    deploymentPrincipalId: principalId
    deploymentPrincipalType: principalType
    applicationInsightsResourceId: applicationInsights.outputs.id
    applicationInsightsConnectionString: applicationInsights.outputs.connectionString
    enableTracing: enableFoundryTracing
  }
}

// Container Registry
module containerRegistry './modules/container-registry.bicep' = {
  name: 'container-registry'
  scope: rg
  params: {
    name: !empty(containerRegistryName) ? containerRegistryName : '${abbrs.containerRegistryRegistries}${resourceToken}'
    location: location
    tags: tags
  }
}

// Container Apps Environment
module containerAppsEnvironment './modules/container-apps-environment.bicep' = {
  name: 'container-apps-environment'
  scope: rg
  params: {
    name: !empty(containerAppsEnvironmentName) ? containerAppsEnvironmentName : '${abbrs.appManagedEnvironments}${resourceToken}'
    location: location
    tags: tags
    logAnalyticsWorkspaceName: logAnalytics.outputs.name
  }
}

// API Container App
module api './modules/container-app.bicep' = {
  name: 'api'
  scope: rg
  params: {
    name: !empty(apiContainerAppName) ? apiContainerAppName : '${abbrs.appContainerApps}api-${resourceToken}'
    location: location
    tags: union(tags, { 'azd-service-name': 'api' })
    containerAppsEnvironmentName: containerAppsEnvironment.outputs.name
    containerRegistryName: containerRegistry.outputs.name
    targetPort: 8080
    containerImage: apiContainerImage
    // The demo stores baskets and recipe plans in process memory.
    minReplicas: 1
    maxReplicas: 1
    enableManagedIdentity: true
    applicationInsightsConnectionString: applicationInsights.outputs.connectionString
    env: [
      {
        name: 'ASPNETCORE_ENVIRONMENT'
        value: 'Production'
      }
      {
        name: 'ASPNETCORE_URLS'
        value: 'http://+:8080'
      }
      {
        name: 'Foundry__ProjectEndpoint'
        value: foundry.outputs.projectEndpoint
      }
      {
        name: 'Foundry__PlannerAgentName'
        value: 'recipe-planner'
      }
      {
        name: 'Foundry__ShopperAgentName'
        value: 'recipe-shopper'
      }
    ]
  }
}

module foundryRuntimeAccess './modules/foundry-runtime-access.bicep' = {
  name: 'foundry-runtime-access'
  scope: rg
  params: {
    accountName: foundry.outputs.accountName
    projectName: foundry.outputs.projectName
    principalId: api.outputs.principalId
  }
}

// Web Container App
module web './modules/container-app.bicep' = {
  name: 'web'
  scope: rg
  params: {
    name: !empty(webContainerAppName) ? webContainerAppName : '${abbrs.appContainerApps}web-${resourceToken}'
    location: location
    tags: union(tags, { 'azd-service-name': 'web' })
    containerAppsEnvironmentName: containerAppsEnvironment.outputs.name
    containerRegistryName: containerRegistry.outputs.name
    targetPort: 80
    containerImage: webContainerImage
    env: [
      {
        name: 'API_BASE_URL'
        value: 'https://${api.outputs.fqdn}'
      }
    ]
  }
}

output AZURE_CONTAINER_REGISTRY_ENDPOINT string = containerRegistry.outputs.loginServer
output AZURE_CONTAINER_REGISTRY_NAME string = containerRegistry.outputs.name
output API_URI string = api.outputs.uri
output WEB_URI string = web.outputs.uri
output FOUNDRY_PROJECT_ENDPOINT string = foundry.outputs.projectEndpoint
output FOUNDRY_PROJECT_ID string = foundry.outputs.projectId
output FOUNDRY_MODEL_DEPLOYMENT_NAME string = foundry.outputs.modelDeploymentName
output FOUNDRY_PLANNER_AGENT_NAME string = 'recipe-planner'
output FOUNDRY_SHOPPER_AGENT_NAME string = 'recipe-shopper'
