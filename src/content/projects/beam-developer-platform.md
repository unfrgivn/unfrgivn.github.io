---
title: "Beam Developer Platform"
icon: "◇"
company: "Wpromote"
role: "Vice President of Engineering"
featured: true
priority: 95
summary: "An internal Google Cloud application platform that gives developers a fast path from static files to private apps with shared browser APIs and controlled public sharing."
highlights:
  - "Built a CLI deployment path with private friendly URLs and a browser management hub"
  - "Created shared browser APIs for identity, data, files, and realtime features"
  - "Separated private applications from deliberate public static-only sharing"
  - "Provisioned the containerized platform and managed services with Terraform"
domains: ["Developer Platform", "Application Engineering", "Cloud Security"]
tech: ["TypeScript", "Node.js", "Cloud Run", "Cloud Storage", "PostgreSQL", "Cloud SQL", "Pub/Sub", "Docker", "Terraform"]
---

### Problem

Developers needed a faster way to publish small internal applications without creating bespoke hosting, authentication, storage, and deployment stacks. Conventional static hosting was simple but did not provide private-by-default access or safe browser APIs, while full service scaffolding imposed too much operational work for focused apps.

### Goal

Create an internal application platform where a developer could deploy static files from a CLI, receive a friendly private URL, add platform capabilities through a browser SDK, manage apps from a web hub, and deliberately share static output without exposing internal APIs.

### Architecture

- Built a TypeScript and Node.js API for deployment lifecycle, site management, identity, data, file, and realtime operations.
- Split delivery between private and public static gateways, keeping apps private by default while allowing explicit, static-only public shares that block internal API access.
- Delivered a web management hub, CLI, browser SDK, and shared platform package so deployment and application capabilities followed consistent contracts.
- Stored deployed assets in GCS-compatible object storage, application state in PostgreSQL on Cloud SQL, and realtime events through Pub/Sub-backed messaging.
- Ran the API, gateways, and hub as separate Dockerized Cloud Run services, with Terraform defining the application infrastructure and managed dependencies.

### My Role

I led the platform architecture and implementation across the developer experience, API, gateways, shared packages, data model, security boundaries, container delivery, and Terraform. I designed the private and public serving lanes, established the CLI and SDK contracts, and built the example suite used to validate the platform's supported capabilities.

### Outcome

- A July 2026 usage snapshot recorded 29 active apps from 33 sites created, 158 deploy lifecycle events from 8 developers, 18 sites with repeat deployments, and 13 tested example applications.
- Developers gained one workflow for deploying, opening, managing, publishing, and removing focused applications without assembling a hosting stack each time.
- Private-by-default delivery preserved access controls, while the isolated public lane made static sharing an explicit decision rather than an accidental API exposure.

### Engineering Challenges

The central challenge was making browser-accessible platform features convenient without weakening the boundary between private applications and public shares. Deployment also had to keep asset manifests, object storage, metadata, and serving behavior consistent across independent services. Separate gateways, explicit visibility transitions, shared platform contracts, and end-to-end tests made those boundaries enforceable while preserving a small developer workflow.
