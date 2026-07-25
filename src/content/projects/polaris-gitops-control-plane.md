---
title: "GitOps Polaris"
icon: "◇"
company: "Wpromote"
role: "Vice President of Engineering"
featured: true
priority: 99
summary: "A GitOps application delivery control plane that reconciles Kubernetes workloads and supporting cloud infrastructure from reviewed, environment-specific declarations."
highlights:
  - "Standardized Kubernetes delivery with Argo CD ApplicationSets"
  - "Separated reusable bases from environment-specific Kustomize overlays"
  - "Integrated Terraform-managed cloud dependencies with workload delivery"
  - "Added reliability and observability resources alongside each application"
domains: ["Platform", "GitOps", "Reliability"]
tech: ["Argo CD", "Kubernetes", "Kustomize", "Helm", "Terraform", "Prometheus"]
---

### Problem

Application teams were operating workloads with different deployment conventions and environment assumptions. Infrastructure changes, Kubernetes manifests, and operational controls could drift apart, increasing release risk and making recovery dependent on manual knowledge.

### Goal

Build a declarative delivery control plane where reviewed repository state described each application, its environment differences, its cloud dependencies, and the reliability controls required to run it.

### Architecture

- Used Argo CD ApplicationSets to discover application overlays and generate environment-scoped deployments from a consistent contract.
- Organized Kubernetes resources into reusable Kustomize bases and explicit overlays, with Helm integration for complex third-party workloads.
- Connected Terraform modules to the delivery model for cloud services, workload identity, registries, and other dependencies that sit outside Kubernetes reconciliation.
- Versioned routes, services, autoscaling, disruption budgets, scheduled jobs, database operators, and secret synchronization with the workloads they support.
- Added Prometheus rules and service monitors so deployment state, capacity signals, and application health were visible through the same operating model.

### My Role

I designed the GitOps repository structure and led the migration toward declarative delivery. I established ApplicationSet conventions, Kustomize composition patterns, Terraform boundaries, and reliability requirements, then worked through application-specific migrations with the engineering teams.

### Outcome

- Deployment frequency increased 3x as teams moved from bespoke release steps to a shared reconciliation path.
- Environment differences became small, reviewable overlays rather than separate deployment systems.
- The repository served as the source of truth for intended workload state, reducing configuration drift and simplifying rollback analysis.
- Operational resources shipped with applications, improving readiness during scaling events and planned disruption.

### Engineering Challenges

The platform had to support web services, APIs, data systems, and stateful operators without turning every workload into a special case. The solution kept a narrow application contract at the top level, allowed composition beneath it, and preserved clear ownership between Argo CD, Kubernetes operators, Helm releases, and Terraform-managed cloud resources.
