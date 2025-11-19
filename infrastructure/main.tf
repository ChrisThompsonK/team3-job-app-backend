resource "azurerm_resource_group" "main" {
  name     = "${var.app_name}-${var.environment}-rg"
  location = var.region
}

data "azurerm_container_registry" "acr" {
  name                = var.acr_name
  resource_group_name = var.acr_resource_group_name
}

data "azurerm_key_vault" "main" {
  name                = "kv-team3-jobapp-${var.environment}"
  resource_group_name = azurerm_resource_group.main.name
}

resource "azurerm_container_app_environment" "main" {
  name                         = "ca-${var.app_name}-backend-${var.environment}"
  container_app_environment_id = azurerm_container_app_environment.main.id
  resource_group_name          = azurerm_resource_group.main.name
  revision_mode                = "Single"

  identity {
    type         = "UserAssigned"
    identity_ids = [var.backend_managed_identity_id]
  }

  template {
    container {
      name   = "backend"
      image  = var.backend_image
      cpu    = var.backend_cpu
      memory = var.backend_memory

      # Key Vault reference syntax for env vars
      env {
        name        = "DATABASE_PASSWORD"
        secret_name = "database-password-ref"
      }

      env {
        name        = "API_KEY"
        secret_name = "api-key-ref"
      }
    }

    min_replicas = 1
    max_replicas = 3
  }

  # Define the Key Vault references as secrets
  secret {
    name                = "database-password-ref"
    key_vault_secret_id = "${data.azurerm_key_vault.main.vault_uri}secrets/DatabasePassword"
    identity            = var.backend_managed_identity_id
  }

  secret {
    name                = "api-key-ref"
    key_vault_secret_id = "${data.azurerm_key_vault.main.vault_uri}secrets/ApiKey"
    identity            = var.backend_managed_identity_id
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
    identity = var.backend_managed_identity_id
  }
}

