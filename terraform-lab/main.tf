terraform{
  required_providers {
    random = {
        source = "hashicorp/random"
    }
    local = {
        source = "hashicorp/local"
    }
  }
}
provider "random" {}
provider "local" {}

resource "random_pet" "name" {
  length = 2
}
resource "local_file" "example" {
  content = "Hello, ${random_pet.name.id}!"
  filename = "output.txt"
}