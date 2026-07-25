---
title: "GCP Foundation"
icon: "◇"
company: "Wpromote"
role: "Vice President of Engineering"
featured: true
priority: 100
summary: "A reusable Google Cloud landing zone that turns organization policy, networking, identity, audit, and cost controls into versioned infrastructure."
highlights:
  - "Structured the cloud foundation as seven ordered Terraform stages"
  - "Encoded organization policy, IAM boundaries, and project baselines as reusable modules"
  - "Centralized networking, DNS, certificate, logging, and audit controls"
  - "Built budget alerts and cost attribution into project provisioning"
domains: ["Cloud Infrastructure", "Security", "FinOps"]
tech: ["Google Cloud", "Terraform", "Cloud IAM", "Cloud DNS", "Certificate Manager"]
---

### Problem

Cloud projects were becoming long-lived snowflakes. Identity, networking, audit, and billing decisions varied by workload, making new environments slow to create and difficult to review as the organization grew.

### Goal

Create a secure landing zone that could bootstrap Google Cloud from a small set of inputs, then provision consistent organization, environment, network, service, and application layers through version-controlled infrastructure.

### Architecture

- Split the foundation into seven ordered Terraform stages so bootstrap privileges, organization controls, shared networks, platform services, and application resources had explicit dependencies.
- Created reusable modules for project baselines, IAM membership, hierarchical firewall policy, centralized logging, private access, DNS, certificates, and workload foundations.
- Applied policy-as-code checks for risky IAM, networking, database, analytics, and cluster configurations before they could become defaults.
- Attached budgets, threshold alerts, cost-center labels, and billing exports to project creation so spend controls started with the resource rather than after an incident.
- Kept plans, applies, state, and service-account responsibilities separated to preserve reviewability and least privilege.

### My Role

I led the architecture and implementation of the landing zone, adapting the enterprise foundation pattern to the company's operating model. I designed the stage boundaries, authored reusable Terraform modules, and established the security, networking, DNS, certificate, audit, and cost-management conventions used by downstream teams.

### Outcome

- New cloud environments could inherit a known baseline instead of repeating organization-level design work.
- Policy, IAM, and network changes became reviewable code with a traceable deployment sequence.
- Central logging and audit exports made investigations possible across the foundation without relying on workload-specific setup.
- Project budgets and common labels provided an early warning system and a consistent basis for cost ownership.

### Engineering Challenges

The bootstrap path had to create the identities and state used by later stages without leaving broad standing access. Module interfaces also had to be strict enough to preserve guardrails while supporting materially different workloads. The design solved this with narrow stage identities, explicit remote-state contracts, policy validation, and composable defaults rather than one monolithic Terraform root.
