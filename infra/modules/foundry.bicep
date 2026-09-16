param name string
param projectName string
param location string
param tags object = {}
param modelDeploymentName string
param modelName string
param modelVersion string
param modelSku string
param modelCapacity int
param deploymentPrincipalId string
param deploymentPrincipalType string

resource account 'Microsoft.CognitiveServices/accounts@2025-06-01' = {
  name: name
  location: location
  tags: tags
  kind: 'AIServices'
  sku: {
    name: 'S0'
  }
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    allowProjectManagement: true
    customSubDomainName: name
    disableLocalAuth: true
    publicNetworkAccess: 'Enabled'
  }
}

resource project 'Microsoft.CognitiveServices/accounts/projects@2025-06-01' = {
  parent: account
  name: projectName
  location: location
  tags: tags
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    displayName: 'Zava recipe agents'
    description: 'Recipe planning and catalogue-grounded shopping agents.'
  }
}

resource model 'Microsoft.CognitiveServices/accounts/deployments@2025-06-01' = {
  parent: account
  name: modelDeploymentName
  sku: {
    name: modelSku
    capacity: modelCapacity
  }
  properties: {
    model: {
      format: 'OpenAI'
      name: modelName
      version: modelVersion
    }
    versionUpgradeOption: 'NoAutoUpgrade'
  }
}

var azureAiUserRoleId = subscriptionResourceId('Microsoft.Authorization/roleDefinitions', '53ca6127-db72-4b80-b1b0-d745d6d5456d')

resource deploymentAgentAccess 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(project.id, deploymentPrincipalId, azureAiUserRoleId)
  scope: project
  properties: {
    principalId: deploymentPrincipalId
    principalType: deploymentPrincipalType
    roleDefinitionId: azureAiUserRoleId
  }
}

output accountName string = account.name
output projectName string = project.name
output projectId string = project.id
output projectEndpoint string = 'https://${account.name}.services.ai.azure.com/api/projects/${project.name}'
output modelDeploymentName string = model.name
