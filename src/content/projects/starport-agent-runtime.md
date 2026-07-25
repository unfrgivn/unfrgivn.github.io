---
title: "Starport"
icon: "◇"
company: "Wpromote"
role: "Vice President of Engineering"
featured: true
priority: 96
summary: "A Kubernetes-native execution runtime for governed AI agents, combining model routing, isolated sandboxes, durable lifecycle state, and operational controls."
highlights:
  - "Built a FastAPI control plane and React operator interface for agent sessions"
  - "Routed model access through a policy-driven LiteLLM gateway and registry"
  - "Executed agents in isolated Kubernetes runners with warm capacity and job fallback"
  - "Recorded session state, events, logs, and artifacts for operational recovery"
domains: ["AI Platform", "Distributed Systems", "Runtime Security"]
tech: ["Python", "FastAPI", "React", "TypeScript", "Kubernetes", "PostgreSQL", "Redis", "LiteLLM", "Docker"]
---

### Problem

Running agents on developer machines did not provide durable lifecycle state, isolation, centralized model policy, or reliable recovery. Moving the same behavior to shared infrastructure raised additional concerns around credentials, tenant boundaries, auditability, and capacity management.

### Goal

Build an execution and orchestration runtime that turns a request into a governed agent session, resolves its runtime and model policy before launch, and preserves enough evidence to operate or investigate every run.

### Architecture

- Built a FastAPI control plane backed by PostgreSQL for requests, sessions, runs, policy decisions, and append-only operational events.
- Added a React and TypeScript operator interface with server-sent events for launch, inspection, live progress, approvals, follow-up, and termination.
- Used Redis and Kubernetes to coordinate isolated runner pods, leasing compatible warm capacity first and falling back to per-session Jobs.
- Defined layered Docker sandbox profiles and a minimal runner that hydrates workspaces, executes the agent harness, and reports heartbeats, log chunks, completion, and artifacts.
- Placed model aliases, provider routing, retry policy, and usage governance behind a LiteLLM gateway and native model registry.
- Kept third-party actions and sensitive credentials behind control-plane integrations, exposing only resolved capabilities to the sandbox.

### My Role

I led the runtime architecture and implemented across the API, persistence model, Kubernetes orchestration, runner protocol, model gateway, operator UI, deployment automation, and local development tooling. I defined the lifecycle contracts that connect policy resolution, dispatch, execution, observability, and recovery.

### Outcome

- Agent runs moved into isolated, reproducible execution environments with centrally resolved policy.
- Durable state and event streams made session progress, failures, and outputs inspectable outside the runner process.
- Warm capacity reduced startup work for common sessions, while Kubernetes Jobs provided independent fallback capacity.
- Model routing and provider changes could be managed centrally without rewriting each agent implementation.

### Engineering Challenges

The runtime had to accept requests quickly without losing the relationship between asynchronous Kubernetes work and durable control-plane state. Warm-pool upgrades also had to preserve active sessions while new capacity became ready. The design uses explicit run claims, runner heartbeats, terminal-state reconciliation, color-managed pool rollouts, and job fallback so infrastructure failures become recoverable lifecycle events rather than orphaned work.
