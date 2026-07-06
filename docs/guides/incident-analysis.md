---
sidebar_position: 1
---

# Incident Analysis Walkthrough

This walkthrough demonstrates the core advantage of NeatContext: **giving an LLM a
team's domain knowledge changes how it investigates an incident.** You will analyze
the *same* incident as two different teams and watch it correctly reach two
*different* outcomes — one team hands the incident off, the other finds and fixes
the root cause.

It uses the open
**[NeatContext incident-analysis demo](https://github.com/XTSoftwareLabs/neatcontext-demo)**,
which ships three tiny local mock systems (incident management, logs,
deployments), a connector extension, two team profiles, and each team's runbooks.

:::info Why this matters
Between the two investigations, the **only** things that change are the active
profile and the knowledge folder. The incident, the tools, and the raw evidence are
identical — yet each team arrives at its own correct action. That is the whole
point.
:::

## The scenario

A single SEV2 fires: **`INC-1001` — elevated 5xx error rate on `checkout-api`.**

There is one true root cause: at **08:58** the Infra Team cut the pgbouncer
`default_pool_size` from **100 → 40**, which starved the `billing-postgres`
connection pool. `checkout-api` (owned by Payments) is a **victim**, not the cause —
its 5xx began at **09:02**, *before* the Payments deploy at **09:05**, and the
payment provider is healthy the whole time.

The right *action*, though, depends on which team is looking:

| | **Payments Engineering** | **Infra Team** |
|---|---|---|
| Owns | checkout-api, invoice-worker, webhooks | billing-postgres, **pgbouncer**, kafka, mesh |
| What it finds | 5xx predates our deploy; provider healthy; dominant error is DB-pool exhaustion we don't own | the 08:58 pgbouncer `default_pool_size` 100→40 change starved the pool |
| Correct outcome | **Not our root cause → hand off to Infra** with evidence | **Root cause found → revert pool size + RELOAD**, verify, monitor |
| Guardrail it enforces | don't touch pgbouncer/Postgres — escalate | **don't fail over the Postgres primary** during business hours |

## Prerequisites

- **Node.js 18+** — to run the mock systems (`node --version`).
- **openssl** — to generate the demo's self-signed TLS cert (ships with Git; standard
  on macOS/Linux). Check with `openssl version`.
- **NeatContext** installed, with a **tool-calling-capable** model configured and
  active (see [Getting Started](../getting-started.md)).

## Step 1 — Get the demo

```bash
git clone https://github.com/XTSoftwareLabs/neatcontext-demo.git
cd neatcontext-demo
```

There are **no dependencies to install** — the mock systems use only the Node
standard library.

## Step 2 — Start the mock systems

```bash
node servers/index.js
```

On first run it generates a self-signed certificate, then serves all three systems
over HTTPS:

```text
[tls] generated self-signed certificate -> servers/certs/localhost.crt
[Incident Management System] listening on https://localhost:7801
[Log System] listening on https://localhost:7802
[Deployment System] listening on https://localhost:7803

Demo incident URL to paste into NeatContext:
  https://localhost:7801/incidents/INC-1001
```

**Leave this terminal running** for the rest of the walkthrough.

:::tip Port already in use?
Override with env vars, e.g.
`INCIDENT_PORT=8801 LOG_PORT=8802 DEPLOY_PORT=8803 node servers/index.js`, then point
the extension at them with the matching `NEATCONTEXT_DEMO_*_BASE` variables.
:::

## Step 3 — Add and enable the extension

1. In NeatContext, open the **Extensions** page.
2. Click **Add extension** and select the demo's **`extension/`** folder (the one
   containing `neatcontext-extension.json`). NeatContext loads **Ops Demo Systems**.
3. **Enable** it. It declares `connection: none`, so there is nothing to
   authenticate — it talks straight to the local mock systems.

The extension exposes three read-only tools to the model:

- `demo_get_incident` — incident details + timeline
- `demo_search_logs` — log lines for a service/time window
- `demo_list_deployments` — recent deploys (change, owning team, risk, rollback)

## Step 4 — Investigate as Team A: Payments Engineering

1. **Import the profile.** In the Domain Profiles panel, choose *Import local
   Markdown profile* → **`profiles/payments-team.md`**, and make it **active**.
2. **Add the knowledge base.** Add the folder **`knowledge/payments-team`** as a
   local knowledge folder.

Team A's workspace now has **only** the Payments profile and **only** its knowledge
base. In a new chat, ask:

```text
Please analyze incident https://localhost:7801/incidents/INC-1001.
What should we check first, and what's the safe action?
```

**What you should see.** The model calls `demo_get_incident`, then
`demo_search_logs` / `demo_list_deployments`, searches the Payments runbooks, and
runs an "is this ours?" triage:

- the 5xx started **09:02, before** the 09:05 checkout-api deploy → our deploy isn't
  the trigger;
- the payment provider is **healthy** → not the provider;
- the dominant error is `could not obtain connection from pool 'billing-postgres'`
  → the binding constraint is the **DB connection pool**, which Infra owns.

➡️ **Correct outcome for Payments:** this is **not our root cause — escalate / hand
off to Infra Team**, with the evidence. A good investigation can correctly end in a
hand-off.

## Step 5 — Investigate the SAME incident as Team B: Infra Team

Now switch the workspace to the other team:

1. **Import** **`profiles/infra-team.md`** and **select `infra-team`** so it is
   active.
2. **Swap the knowledge base:** remove the **`payments-team`** knowledge folder and
   add **`knowledge/infra-team`**, so only Infra's runbooks are searched.
3. Ask the **exact same question** with the **same incident URL**.

**What you should see.** Same tools, same data — but now the model owns the root
cause. It zeroes in on the **08:58 pgbouncer `default_pool_size` 100 → 40 change**,
confirms the Postgres primary is healthy (so it's the pool ceiling, not the
database), and gives the fix and next actions: **revert `default_pool_size` to 100
and RELOAD pgbouncer** (no dropped connections), verify the pool drains and 5xx
clears, then monitor pool utilization. It **warns not to fail over the primary**.

## What the demo proves

- **Domain profiles steer reasoning toward the team's correct action.** The only
  change between Step 4 and Step 5 is the active profile + knowledge folder. Same
  incident, same tools, same raw evidence — two right answers.
- **The knowledge base grounds the answer.** Each team's runbooks/TSGs/postmortems
  give the model team-specific first-checks and *dangerous-action* rules it would
  not otherwise know.
- **The extension is just an MCP connector.** Point the same extension at *your*
  real incident/log/deploy systems and the pattern works beyond the demo.

## Take it further

- Point the extension at real systems by setting the `NEATCONTEXT_DEMO_*_BASE`
  environment variables to your own incident/log/deploy APIs.
- Learn to build your own connector in
  **[Building Extensions](../extensions/overview.md)** — the demo's `server.cjs` is
  authored exactly like any third-party extension.
