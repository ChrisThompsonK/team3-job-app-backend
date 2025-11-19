data "azurerm_resource_group" "main" {
  name = "team3-job-app-dev-be"
}

data "azurerm_container_registry" "acr" {
  name                = var.acr_name
  resource_group_name = var.acr_resource_group_name
}

data "azurerm_key_vault" "main" {
  name                = "kv-team3-jobapp-${var.environment}"
  resource_group_name = data.azurerm_resource_group.main.name
}

data "azurerm_user_assigned_identity" "backend" {
  name                = "mi-${var.app_name}-backend-${var.environment}"
  resource_group_name = data.azurerm_resource_group.main.name
}

data "azurerm_container_app_environment" "main" {
  name                = "cae-${var.app_name}-${var.environment}"
  resource_group_name = data.azurerm_resource_group.main.name
}

resource "azurerm_container_app" "backend" {
  name                         = "ca-${var.app_name}-backend-${var.environment}"
  container_app_environment_id = data.azurerm_container_app_environment.main.id
  resource_group_name          = data.azurerm_resource_group.main.name
  revision_mode                = "Single"

  identity {
    type         = "UserAssigned"
    identity_ids = [data.azurerm_user_assigned_identity.backend.id]
  }

  template {
    container {
      name   = "backend"
      image  = var.backend_image
      cpu    = var.backend_cpu
      memory = var.backend_memory

      # Key Vault reference syntax for env vars
      env {
        name        = "NODE_ENV"
        value       = "production"
      }

      env {
        name        = "PORT"
        value       = "3001"
      }

      env {
        name        = "LOG_LEVEL"
        value       = "info"
      }

      env {
        name        = "DATABASE_URL"
        secret_name = "database-url"
      }

      env {
        name        = "APP_NAME"
        value       = "Team 3 Job Application Backend"
      }

      env {
        name        = "APP_VERSION"
        value       = "1.0.0"
      }

      env {
        name        = "FRONTEND_URL"
        secret_name = "frontend-url"
      }

      env {
        name        = "JWT_ACCESS_SECRET"
        secret_name = "jwt-access-secret"
      }

      env {
        name        = "AUTO_CLOSE_CRON_SCHEDULE"
        value       = "0 1 * * *"
      }
    }

    min_replicas = 1
    max_replicas = 3
  }

  # Define the Key Vault references as secrets
  secret {
    name                = "database-url"
    key_vault_secret_id = "${data.azurerm_key_vault.main.vault_uri}secrets/database-url"
    identity            = data.azurerm_user_assigned_identity.backend.id
  }

  secret {
    name                = "frontend-url"
    key_vault_secret_id = "${data.azurerm_key_vault.main.vault_uri}secrets/frontend-url"
    identity            = data.azurerm_user_assigned_identity.backend.id
  }

  secret {
    name                = "jwt-access-secret"
    key_vault_secret_id = "${data.azurerm_key_vault.main.vault_uri}secrets/jwt-access-secret"
    identity            = data.azurerm_user_assigned_identity.backend.id
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
    identity = data.azurerm_user_assigned_identity.backend.id
  }
}

