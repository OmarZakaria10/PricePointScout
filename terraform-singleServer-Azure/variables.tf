variable "resource_group_location" {
  type        = string
  default     = "switzerlandnorth"
  description = "Location of the resource group."
}

variable "resource_group_name_prefix" {
  type        = string
  default     = "rg"
  description = "Prefix of the resource group name that's combined with a random ID so name is unique in your Azure subscription."
}

variable "username" {
  type        = string
  description = "The username for the local account that will be created on the new VM."
  default     = "omar"
}

variable "hostname" {
  type        = string
  description = "The hostname for the VM."
  default     = "ubuntu24.04"
}
