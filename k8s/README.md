# Kubernetes Deployment Guide

This document explains how to deploy the HiveBox application to a local Kubernetes cluster using KIND (Kubernetes IN Docker).

## Prerequisites

- Docker installed and running
- kubectl installed
- KIND installed

## 1. Creating the KIND Cluster

The HiveBox application is deployed to a local Kubernetes cluster using KIND with Ingress support. Follow these steps to create the cluster:

```bash
kind create cluster --name hivebox --config k8s/kind-config.yml
```

The `kind-config.yml` file contains the necessary configuration to enable Ingress support.

After creating the cluster, install the Ingress-Nginx controller:

```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/kind/deploy.yaml
```

## 2. Deploying the Application

### Applying Kubernetes Manifests

Apply the Kubernetes manifests to deploy the application:

```bash
kubectl apply -k k8s/base/
```

## 3. Testing the Application

Once the application is deployed, you can test it using the following endpoints:

```bash
# Test the version endpoint
curl http://localhost/version

# Test the temperature endpoint
curl http://localhost/temperature

# Test the metrics endpoint
curl http://localhost/metrics
```

## 4. Known Issues and Considerations

### Troubleshooting

1. **Port Configuration**
   - Ensure the container port in the deployment matches the application's listening port (3000)
   - Ensure the service targetPort matches the container port

### Performance Considerations

- The default resource limits in the deployment (200m CPU, 256Mi memory) should be sufficient for local testing
- For production deployments, adjust the resource limits and requests based on actual usage

### Security Considerations

- The current setup is for local development and testing only
- For production deployments, consider:
  - Using proper authentication and TLS for the ingress
  - Implementing network policies
  - Running containers as non-root users
  - Setting up proper resource quotas and limits

## 5. Cleanup

To clean up the KIND cluster and all resources:

```bash
kind delete cluster --name hivebox
```
