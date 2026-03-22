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

@description('Name of the Container Apps Environment')
param containerAppsEnvironmentName string = ''

@description('Name of the Azure Container Registry')
param containerRegistryName string = ''

@description('Name of the Log Analytics workspace')
param logAnalyticsName string = ''

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
    env: [
      {
        name: 'ASPNETCORE_ENVIRONMENT'
        value: 'Production'
      }
      {
        name: 'ASPNETCORE_URLS'
        value: 'http://+:8080'
      }
    ]
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
