---
sidebar_position: 4
---

# Knowledge Bases

A **knowledge base** is a local folder of documents — typically a team's
**runbooks**, **troubleshooting guides (TSGs)**, and **postmortems** — that your
connected AI client searches when answering. It's what turns "an LLM's general
opinion" into "an answer grounded in *your* documents, with citations you can
click".

## Link a folder in the Library

Knowledge folders live in your **[Library](./library.md)**. Open **Library →
Knowledge folders**, click **Add folder**, and pick a directory. The folder is
**linked in place** — NeatContext reads it where it lives; nothing is copied or
uploaded. A read-only **Team Library** can share folders too.

Some useful properties:

- **The folder stays yours.** Keep runbooks in the git repo where they already
  live; edits are picked up automatically on the next search.
- Click a folder's name to see its full path; use its reveal action to open it in
  your file explorer.

## Select it into a Context

On the **Contexts** page, under **Knowledge folders**, choose **Add from Library**
to attach a folder to the current Context. Attach as many as the topic needs
(runbooks + postmortems + architecture notes, say). The **✕** detaches a folder
from *this* Context only; other Contexts, the Library entry, and the folder on disk
are untouched.

## How it shows up in answers

When you ask a question in a connected client, the documents it uses are cited in
the answer's **Sources** section — as clickable links to the exact lines. That's
how you verify an answer instead of trusting it. Searches run locally on your
machine.

Text-based documents work best — Markdown, plain text, logs, JSON, CSV, HTML.
Folders work best when they're focused documentation folders rather than an entire
home directory.

## Tips for a good knowledge base

The documents that work best are the ones that are good for humans too:

- **Use the real names of things** — service names, error strings, config keys.
  A runbook that quotes the exact error
  (`could not obtain connection from pool 'billing-postgres'`) is easy to find
  the moment that error appears in an incident.
- **One topic per file**, with a descriptive filename (`checkout-api-5xx.md`
  beats `notes3.md`) — the filename is also what you'll see in the cited sources.
- **Keep postmortems.** They encode "we've seen this before", which is often the
  fastest route to a diagnosis.

The [incident demo's knowledge folders](https://github.com/XTSoftwareLabs/neatcontext-demo/tree/main/knowledge)
show the pattern: `runbooks/`, `tsg/`, and `postmortems/` per team.

:::info[Plan limits]
The number of knowledge folders per Context depends on your plan — see
[neatcontext.com/pricing](https://www.neatcontext.com/pricing).
:::
