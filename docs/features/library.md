---
sidebar_position: 2
---

# The Library

The **Library** is your local registry of reusable resources — **domain
profiles**, **knowledge folders**, and **extensions**. You *author and link*
resources here once; your [Contexts](./contexts.md) then *select* from them. A
single Library resource can be used by many Contexts, and removing it from a
Context never deletes it from the Library or from disk.

## Personal resources

Everything you create or link in the app is **personal** and lives on your
machine:

- **Domain profiles** — create a new Markdown profile in-app, or **link an
  existing `.md` file in place**. Linked profiles stay at their original path, so
  you can keep them in a git repo and edit them in NeatContext's editor (edits save
  back to the same file). See [Domain Profiles](./domain-profiles.md).
- **Knowledge folders** — **link a folder in place**. NeatContext reads it where it
  lives; nothing is copied or uploaded. See [Knowledge Bases](./knowledge-bases.md).
- **Extensions** — bundled connectors, plus any you **Add** or **Create**. See
  [Using Extensions](./using-extensions.md).

## The Team Library (optional, read-only)

A team can share approved resources through a **Team Library**: any folder that
follows the convention

```text
<team-library>/
  profiles/      # shared domain profiles (.md)
  knowledge/     # shared knowledge folders
  extensions/    # shared extension sources
  library.json   # marker file identifying the folder as a Team Library
```

typically kept as a **git clone**. Connect it from the Library page (and disconnect
it there too). NeatContext treats it as **read-only**: team profiles and folders
are view- and reveal-only, and team extension *sources* stay inert until you
explicitly install them (see below). NeatContext **never writes into the Team
Library** — contributing back is a normal git workflow.

Each resource shows its **origin** so you can tell built-in, personal, and team
resources apart.

## Installing extensions

The bundled **PagerDuty** and **Datadog** connectors are ready to use right away.
Any other extension — one you **Add**, **Create**, or that comes from a Team
Library — has to be **installed** before you can use it: open **Library →
Extensions** (or the **Extensions** page) and click **Install**, then review it.
See [Using Extensions](./using-extensions.md).

## Your files stay yours

Linked profiles and knowledge folders stay wherever you put them on disk — the
Library just points to them. Nothing in the Library is uploaded to a NeatContext
server.
