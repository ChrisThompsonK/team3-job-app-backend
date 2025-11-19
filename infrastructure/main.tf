resource "azurerm_resource_group" "main" {
  name     = "${var.app_name}-${var.environment}-rg"
  location = var.region
}

data "azurerm_container_registry" "acr" {
  name                = var.acr_name
  resource_group_name = var.acr_resource_group_name
}

resource "azurerm_key_vault" "main" {
  name                      = "kv-team3-jobapp-${var.environment}"
  location                  = azurerm_resource_group.main.location
  resource_group_name       = azurerm_resource_group.main.name
  tenant_id                 = data.azurerm_client_config.current.tenant_id
  sku_name                  = "standard"
  enable_rbac_authorization = true
}

resource "azurerm_container_app_environment" "main" {
  name                = "cae-${var.app_name}-${var.environment}"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
}

resource "azurerm_user_assigned_identity" "frontend" {
  name                = "mi-${var.app_name}-frontend-${var.environment}"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
}

resource "azurerm_user_assigned_identity" "backend" {
  name                = "mi-${var.app_name}-backend-${var.environment}"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
}

resource "azurerm_role_assignment" "frontend_kv" {
  scope              = azurerm_key_vault.main.id
  role_definition_name = "Key Vault Secrets User"
  principal_id       = azurerm_user_assigned_identity.frontend.principal_id
}

resource "azurerm_role_assignment" "frontend_acr" {
  scope              = data.azurerm_container_registry.acr.id
  role_definition_name = "AcrPull"
  principal_id       = azurerm_user_assigned_identity.frontend.principal_id
}

resource "azurerm_role_assignment" "backend_kv" {
  scope              = azurerm_key_vault.main.id
  role_definition_name = "Key Vault Secrets User"
  principal_id       = azurerm_user_assigned_identity.backend.principal_id
}

resource "azurerm_role_assignment" "backend_acr" {
  scope              = data.azurerm_container_registry.acr.id
  role_definition_name = "AcrPull"
  principal_id       = azurerm_user_assigned_identity.backend.principal_id
}

resource "azurerm_container_app" "frontend" {
  name                         = "ca-${var.app_name}-frontend-${var.environment}"
  container_app_environment_id = azurerm_container_app_environment.main.id
  resource_group_name          = azurerm_resource_group.main.name
  revision_mode                = "Single"

  identity {
    type         = "UserAssigned"
    identity_ids = [azurerm_user_assigned_identity.frontend.id]
  }

  template {
    container {
      name   = "frontend"
      image  = var.frontend_image
      cpu    = var.frontend_cpu
      memory = var.frontend_memory
    }

    min_replicas = 1
    max_replicas = 3
  }

  ingress {
    allow_insecure_connections = false
    external_enabled           = true
    target_port                = 3000
    transport                  = "http"

    traffic_weight {
      percentage      = 100
      latest_revision = true
    }
  }

  registry {
    server   = "${var.acr_name}.azurecr.io"
    identity = azurerm_user_assigned_identity.frontend.id
  }
}

resource "azurerm_container_app" "backend" {
  name                         = "ca-${var.app_name}-backend-${var.environment}"
  container_app_environment_id = azurerm_container_app_environment.main.id
  resource_group_name          = azurerm_resource_group.main.name
  revision_mode                = "Single"

  identity {
    type         = "UserAssigned"
    identity_ids = [azurerm_user_assigned_identity.backend.id]
  }

  template {
    container {
      name   = "backend"
      image  = var.backend_image
      cpu    = var.backend_cpu
      memory = var.backend_memory
    }

    min_replicas = 1
    max_replicas = 3
  }

  ingress {
    allow_insecure_connections = false
    external_enabled           = false
    target_port                = 3001
    transport                  = "http"

    traffic_weight {
      percentage      = 100
      latest_revision = true
    }
  }

  registry {
    server   = "${var.acr_name}.azurecr.io"
    identity = azurerm_user_assigned_identity.backend.id
  }
}

