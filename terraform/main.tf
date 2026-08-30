terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0"
    }
  }
}

provider "docker" {
  host = "npipe:////./pipe/docker_engine"
}

# Use the existing Docker Hub image
resource "docker_image" "employee_app" {
  name         = "venkat0707/employee-app:latest"
  keep_locally = true
}

# Create and run the container
resource "docker_container" "employee_app" {
  name  = "employee-management-container"
  image = docker_image.employee_app.image_id

  ports {
    internal = 8081
    external = 8081
  }
}