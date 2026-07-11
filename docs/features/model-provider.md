---
sidebar_position: 4
---

# Model Provider

NeatContext does **not** host or resell a model. You bring your own — a cloud API
key or a local model — and NeatContext orchestrates it: requests go **directly
from the app on your machine to the endpoint you configure**, with your profile
and knowledge assembled in.

## Open model settings

Click the **model button** at the left of the top bar (it shows the current model
name, e.g. `gpt-5.4-mini`). That opens the **Model Provider** page:

![The Model Provider settings page](/img/features/model-provider.png)

## Fill in the form

| Field | What to enter |
|---|---|
| **Provider** | Keep **OpenAI-compatible endpoint** — the recommended choice. It covers OpenAI itself and the many services and local runtimes that expose the same API (Azure OpenAI, OpenRouter, Together, vLLM, LM Studio, Ollama, …). |
| **Base URL** | The API root, e.g. `https://api.openai.com/v1`. For a local Ollama server use `http://localhost:11434/v1`. |
| **Model** | The model name as your provider spells it, e.g. `gpt-5.4-mini`. |
| **API key** | Your key. For local servers that don't check keys, enter any non-empty placeholder — the field must not be blank for live calls. |

Click **Save**. The top bar now shows your model name, and every chat in the
workspace uses this provider.

:::caution[Pick a tool-calling model]
Extensions only work if the active model supports **function/tool calling** (all
mainstream chat models do). With a non-tool-calling model you still get profiles
and knowledge search, but the model cannot query your systems.
:::

## How your key is stored

The API key is encrypted with your **operating system's secure storage**
and saved locally on your machine. It is never written in plaintext, never
committed to profile files, and never sent anywhere except to the provider
endpoint you configured.

## What happens without a provider

If no provider is configured (or it fails), chats still work: NeatContext
replies with a placeholder answer that shows the profile and knowledge context
it gathered for your question. It's a handy way to preview your setup — but for
real answers, configure a provider.
