---
title: "Polaris Apps"
icon: "◇"
company: "Wpromote"
role: "Vice President of Engineering"
featured: true
priority: 98
summary: "An independently deployable serverless application monorepo for event-driven data products, APIs, optimization workflows, and analytics services."
highlights:
  - "Organized ten applications in a shared Python uv workspace"
  - "Standardized FastAPI services and container delivery to Cloud Run"
  - "Built event-driven workflows with Pub/Sub and Eventarc"
  - "Automated independent image builds, versions, and releases per application"
domains: ["Application Engineering", "Serverless", "Data Products"]
tech: ["Python", "uv", "FastAPI", "Cloud Run", "Pub/Sub", "Eventarc", "BigQuery", "BQML", "Docker"]
---

### Problem

Small product and data capabilities were accumulating inside larger systems or one-off jobs. They needed independent release cycles and event-driven scaling, but duplicating packaging, dependency management, and delivery pipelines for every service would create a different maintenance problem.

### Goal

Create a monorepo where focused serverless applications could share engineering standards while remaining independently testable, versioned, containerized, and deployable.

### Architecture

- Used a Python uv workspace to manage ten application packages with a shared lockfile and consistent development tooling.
- Built focused FastAPI services for HTTP APIs, webhook ingestion, background processing, and machine-to-machine workflows.
- Deployed containers to Cloud Run and connected asynchronous paths through Pub/Sub and Eventarc so bursty workloads could scale independently.
- Used BigQuery for analytical processing and state, including BQML forecasting and anomaly-detection workloads where the warehouse was the right execution engine.
- Created reusable Docker build automation and per-package release configuration so a change published only the affected application image and version.

### My Role

I set the application architecture and monorepo conventions, implemented shared build and release patterns, and contributed directly to the service and data-processing designs. I also established the boundary between these product-facing applications and the infrastructure repositories that provisioned their runtime dependencies.

### Outcome

- Ten services could evolve and deploy independently without maintaining ten separate repositories and toolchains.
- Shared dependency locking and CI conventions reduced packaging drift while preserving application ownership.
- Event-driven services absorbed variable workloads without reserving always-on application capacity.
- Product teams gained a repeatable path from a focused data capability to a tested, containerized service.

### Engineering Challenges

The monorepo needed enough consistency to be operable without coupling every release. Dependency changes, image builds, and versioning therefore had to understand package boundaries. Event handlers also had to remain idempotent and observable across HTTP delivery, message retries, and long-running analytical work, especially when BigQuery was both a compute engine and a system of record.
