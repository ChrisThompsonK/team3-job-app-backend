terraform {
  required_version = ">= 1.5.0"

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
  }

  # Remote state backend for production pipelines
  # Uncomment after running: terraform init -reconfigure -backend-config="resource_group_name=terraform-state-mgmt" -backend-config="storage_account_name=aistatemgmt" -backend-config="container_name=terraform-tfstate-ai" -backend-config="key=team3-job-app-dev.tfstate"
  # backend "azurerm" {
  #   resource_group_name  = "terraform-state-mgmt"
  #   storage_account_name = "aistatemgmt"
  #   container_name       = "terraform-tfstate-ai"
  #   key                  = "team3-job-app-dev.tfstate"
  # }
}

provider "azurerm" {
  features {}

  # Support for Service Principal authentication via environment variables
  # Set via GitHub Actions secrets:
  # ARM_CLIENT_ID, ARM_CLIENT_SECRET, ARM_SUBSCRIPTION_ID, ARM_TENANT_ID
}

# Create a resource group with environment-based naming
resource "azurerm_resource_group" "main" {
  name     = "${var.project_name}-${var.environment}-rg"
  location = var.location

  tags = {
    environment = var.environment
    managed_by  = "terraform"
    project     = var.project_name
  }
}
