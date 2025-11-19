output "resource_group_name" {
  value       = azurerm_resource_group.main.name
  description = "Resource group name"
}

output "resource_group_id" {
  value       = azurerm_resource_group.main.id
  description = "Resource group ID"
}

output "key_vault_id" {
  value       = azurerm_key_vault.main.id
  description = "Key Vault ID"
}

output "key_vault_uri" {
  value       = azurerm_key_vault.main.vault_uri
  description = "Key Vault URI for secret references"
}

output "key_vault_name" {
  value       = azurerm_key_vault.main.name
  description = "Key Vault name"
}

output "frontend_managed_identity_id" {
  value       = azurerm_user_assigned_identity.frontend.id
  description = "Frontend Managed Identity ID"
}

output "frontend_managed_identity_principal_id" {
  value       = azurerm_user_assigned_identity.frontend.principal_id
  description = "Frontend Managed Identity Principal ID"
}

output "backend_managed_identity_id" {
  value       = azurerm_user_assigned_identity.backend.id
  description = "Backend Managed Identity ID"
}

output "backend_managed_identity_principal_id" {
  value       = azurerm_user_assigned_identity.backend.principal_id
  description = "Backend Managed Identity Principal ID"
}

output "container_app_environment_id" {
  value       = azurerm_container_app_environment.main.id
  description = "Container App Environment ID"
}

output "container_app_environment_name" {
  value       = azurerm_container_app_environment.main.name
  description = "Container App Environment name"
}

output "frontend_container_app_id" {
  value       = azurerm_container_app.frontend.id
  description = "Frontend Container App ID"
}

output "frontend_container_app_name" {
  value       = azurerm_container_app.frontend.name
  description = "Frontend Container App name"
}

output "frontend_container_app_fqdn" {
  value       = azurerm_container_app.frontend.ingress[0].fqdn
  description = "Frontend Container App public FQDN"
}

output "backend_container_app_id" {
  value       = azurerm_container_app.backend.id
  description = "Backend Container App ID"
}

output "backend_container_app_name" {
  value       = azurerm_container_app.backend.name
  description = "Backend Container App name"
}

output "backend_container_app_fqdn" {
  value       = azurerm_container_app.backend.ingress[0].fqdn
  description = "Backend Container App internal FQDN"
}

