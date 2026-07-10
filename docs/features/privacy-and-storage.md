---
sidebar_position: 7
---

# Privacy & Data Storage

NeatContext is **local-first** by design. This page spells out exactly what that
means: where each piece of data lives, how secrets are protected, and what does
(and does not) leave your machine.

## What stays on your machine

Everything you work with:

| Data | Where it lives |
|---|---|
| Domain profiles | Plain `.md` files — imported ones stay at their original path; created ones live in the app's data folder under `profiles/`. |
| Knowledge bases | **Your existing folders, read in place.** Never copied, never uploaded, never indexed to a cloud. |
| Chats, tabs, workspace layout | `workspace.json` in the app's data folder. |
| Extensions you added | Copied into the app's data folder under `extensions/`. |
| Model API key, extension keys and OAuth tokens | Stored locally, **encrypted** (see below). |

The app's data folder is the standard per-user application directory
(`%APPDATA%\NeatContext` on Windows, `~/Library/Application Support/NeatContext`
on macOS). All state files there are written atomically, so a crash mid-write
can't corrupt your workspace.

## How secrets are handled

- All secrets — the model API key, extension API keys, OAuth access/refresh
  tokens — are encrypted with your **operating system's secure storage**
  (Electron `safeStorage`, backed by DPAPI on Windows and Keychain on macOS)
  before touching disk. They are never stored in plaintext.
- Extension credentials are **injected in memory** into an extension's server at
  the moment a tool runs. They are never written into the extension's folder,
  and the extension is expected never to persist them.
- Profiles and workspace files never contain keys, so committing profiles to git
  is safe.

## What leaves your machine

Only what you have explicitly configured, and only to endpoints you chose:

1. **Model requests** go directly from the app to **your** model provider's
   endpoint (with your key). The assembled context — the active profile and the
   retrieved knowledge snippets — is part of those requests, so choose a
   provider you trust with that content. No inference runs on NeatContext
   servers, and there is no middleman relay.
2. **Extension traffic** goes from the extension's local process to whatever
   backend that extension talks to (e.g. the PagerDuty or Datadog API — or just
   `localhost` for the demo).
3. **Account traffic**: sign-in and subscription checks talk to the NeatContext
   account service; the app also checks for updates. Neither involves your
   profiles, knowledge, chats, or keys.

Knowledge retrieval itself is fully local — keyword search over your folders, no
embeddings service, no cloud index.

## Safety defaults for tools

- Built-in tools are **read-only**: search knowledge, read files, list/read
  profiles. There are no built-in write tools.
- `read_local_file` is **sandboxed** to the folders you attached and your
  profile files — the model cannot read arbitrary paths.
- Folders named `secrets` or `credentials` (plus `.git`, `node_modules`, and
  build-output directories) are skipped by knowledge search.
- The bundled extensions are read-only, and the extension guide
  [strongly recommends](../extensions/overview.md#security-model) the same for
  anything you install or build.

## Your data is portable

Profiles are Markdown. Knowledge is your own folders. The workspace is JSON.
Nothing is held in a proprietary store — if you stop using NeatContext, you lose
nothing.
