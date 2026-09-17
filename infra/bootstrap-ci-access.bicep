targetScope = 'resourceGroup'

@description('Existing Foundry account containing the recipe project.')
param accountName string
param projectName string = 'recipes'
@description('Object ID, not application ID, of the GitHub deployment service principal.')
param ciPrincipalId string

resource account 'Microsoft.CognitiveServices/accounts@2025-06-01' existing = {
  name: accountName
}

resource project 'Microsoft.CognitiveServices/accounts/projects@2025-06-01' existing = {
  parent: account
  name: projectName
}

var aiUserRoleId = '53ca6127-db72-4b80-b1b0-d745d6d5456d'
var rbacAdministratorRoleId = subscriptionResourceId('Microsoft.Authorization/roleDefinitions', 'f58310d9-a9f6-439a-9e8d-f62e7b41a168')

// CI may maintain the application's AI role, but cannot grant administrator roles.
resource ciDelegation 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(project.id, ciPrincipalId, rbacAdministratorRoleId)
  scope: project
  properties: {
    principalId: ciPrincipalId
    principalType: 'ServicePrincipal'
    roleDefinitionId: rbacAdministratorRoleId
    conditionVersion: '2.0'
    condition: '((!(ActionMatches{\'Microsoft.Authorization/roleAssignments/write\'})) OR (@Request[Microsoft.Authorization/roleAssignments:RoleDefinitionId] ForAnyOfAnyValues:GuidEquals {${aiUserRoleId}})) AND ((!(ActionMatches{\'Microsoft.Authorization/roleAssignments/delete\'})) OR (@Resource[Microsoft.Authorization/roleAssignments:RoleDefinitionId] ForAnyOfAnyValues:GuidEquals {${aiUserRoleId}}))'
  }
}
