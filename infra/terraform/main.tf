# Kubernetes provider configuration
provider "helm" {
  kubernetes {
    config_path = "~/.kube/config"
    config_context = "kind-finance-app"
  }
}

#Ingress Nginx
resource "helm_release" "ingress_nginx" {
  name       = "ingress-nginx"
  namespace = "ingress-nginx"
  create_namespace = true
  repository = "https://kubernetes.github.io/ingress-nginx"
  chart      = "ingress-nginx"
  version    = "4.0.6"

  set {
    name  = "controller.service.type"
    value = "ClusterIP"
  }
}

#ArgoCD
resource "helm_release" "argocd" {
  name             = "argocd"
  namespace        = "argocd"
  create_namespace = true

  repository = "https://argoproj.github.io/argo-helm"
  chart      = "argo-cd"
  version    = "6.7.0"
  
  set{
    name  = "server.extraArgs[0]"
    value = "--insecure"
  }

  depends_on = [helm_release.ingress_nginx]

}
