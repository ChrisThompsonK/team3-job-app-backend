variable "project_name" {
  description = "Project name for resource naming convention"
  type        = string
  default     = "team3-job-app"

  validation {
    condition     = length(var.project_name) > 0 && length(var.project_name) <= 20
    error_message = "Project name must be between 1 and 20 characters."
  }
}

variable "environment" {
  description = "Environment name (dev, test, prod) - used in resource naming and tags"
  type        = string
  default     = "dev"

  validation {
    condition     = contains(["dev", "test", "prod"], var.environment)
    error_message = "Environment must be one of: dev, test, prod."
  }
}

variable "location" {
  description = "Azure region where resources will be deployed"
  type        = string
  default     = "UK South"

  validation {
    condition     = contains(["East US", "West US", "UK South", "Europe West", "Southeast Asia"], var.location)
    error_message = "Location must be a valid Azure region."
  }
}

variable "tags" {
  description = "Additional tags to apply to all resources"
  type        = map(string)
  default     = {}
}
