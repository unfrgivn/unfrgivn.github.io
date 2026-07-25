---
title: "OpenCode Config"
icon: "◇"
company: "Wpromote"
role: "Vice President of Engineering"
featured: true
priority: 97
summary: "A TypeScript and Bun control layer that distributes governed agent capabilities, policy, and orchestration conventions while preserving local developer choice."
highlights:
  - "Packaged shared skills, agents, commands, instructions, plugins, and MCP configuration"
  - "Validated layered configuration and local overrides with Zod and JSON Schema"
  - "Added per-agent tool, MCP, skill, and permission policy controls"
  - "Built presets, diagnostics, recovery, tmux orchestration, and companion state support"
domains: ["Developer Experience", "AI Engineering", "Governance"]
tech: ["TypeScript", "Bun", "Zod", "JSON Schema", "OpenCode", "tmux"]
---

### Problem

Agent-assisted development was becoming a collection of personal prompt files, tool settings, and model choices. Teams could not reliably share improvements or enforce safe defaults, while a rigid central configuration would erase useful local workflows.

### Goal

Create a versioned configuration and policy layer that could distribute proven agent assets, validate team defaults, respect local overrides, and expose operational controls without becoming the runtime that executes sandboxed work.

### Architecture

- Built a custom TypeScript plugin on Bun that discovers, installs, and injects shared skills, agents, commands, instructions, plugins, and MCP definitions.
- Defined layered user and project configuration with deterministic precedence, explicit disables, copy or link installation, and local assets taking priority.
- Used Zod and JSON Schema to validate configuration and provide editor-visible contracts for models, presets, orchestration, and companion settings.
- Added per-agent policy for tools, permissions, MCP servers, and skills, allowing narrow overrides without replacing the full team agent definition.
- Implemented runtime presets, task controls, diagnostics, bounded retries, provider fallback, startup recovery, optional tmux views, and companion state reporting.
- Automated package builds and releases so the shared control layer and bundled assets moved together as a tested version.

### My Role

I designed and implemented the plugin architecture, configuration merge model, policy system, and agent harness. I also authored shared engineering workflows and built the orchestration diagnostics needed to make failures explainable rather than hiding them behind a chat interface.

### Outcome

- Team improvements became reusable, versioned assets instead of workstation-specific setup.
- Developers could keep local preferences while inheriting centrally maintained safety and workflow defaults.
- Per-agent policy made tool and context access explicit at configuration time.
- Diagnostics, recovery, and task visibility gave operators concrete state when delegated work failed or stalled.

### Engineering Challenges

Configuration precedence had to remain predictable across packaged assets, user files, project files, aliases, and partial agent overrides. The plugin also needed to extend OpenCode without owning model execution itself. Keeping that boundary clear made OpenCode Config the control and configuration layer, while execution isolation, durable run state, and model gateway policy remained responsibilities of the Starport runtime.
