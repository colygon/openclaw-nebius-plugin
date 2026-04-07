# Nebius Token Factory Provider Plugin for OpenClaw

A provider plugin that gives OpenClaw access to 44+ open-source models via Nebius's OpenAI-compatible inference API.

---

> **Model naming matters.** Always use the fully qualified name with the `nebius/` prefix:
>
> ```
> nebius/zai-org/GLM-5          <-- correct
> zai-org/GLM-5                 <-- WRONG: "Unknown model" error
> ```
>
> The catalog registers model IDs like `zai-org/GLM-5`. OpenClaw automatically
> prepends the provider prefix, so users and config files must always write
> `nebius/zai-org/GLM-5`.

---

## Prerequisites

- OpenClaw `>= 2026.3.24`
- A Nebius Token Factory API key from [studio.nebius.ai](https://studio.nebius.ai/)

---

## Installation

### 1. Set the API key

**Auth profiles and env vars are the source of truth for authentication.**
The plugin manifest does NOT accept an `apiKey` in its config — it resolves
credentials through OpenClaw's provider auth system.

There are two ways to provide the key (use both for reliability):

**a) Auth profile** (required for the agent):

Edit `~/.openclaw/agents/main/agent/auth-profiles.json` and add inside `"profiles"`:

```json
"nebius:default": {
  "type": "api_key",
  "provider": "nebius",
  "key": "v1.YOUR_KEY_HERE"
}
```

And inside `"lastGood"`:

```json
"nebius": "nebius:default"
```

**b) Environment variable** (required for the gateway LaunchAgent):

The gateway runs as a macOS LaunchAgent. Shell env vars (`.zshrc`) are NOT
visible to it. You must use `launchctl`:

```bash
launchctl setenv NEBIUS_API_KEY "v1.YOUR_KEY_HERE"
```

### 2. Enable the plugin

Edit `~/.openclaw/openclaw.json`:

Under `plugins.entries`:

```json
"nebius": { "enabled": true }
```

Under `plugins.installs`:

```json
"nebius": {
  "source": "path",
  "installPath": "/path/to/openclaw-nebius",
  "version": "1.2.0"
}
```

### 3. Set as default model (optional)

In `~/.openclaw/openclaw.json` under `agents.defaults.model`:

```json
"model": {
  "primary": "nebius/Qwen/Qwen3.5-397B-A17B"
}
```

### 4. Restart

```bash
openclaw gateway restart
```

---

## Available Models

### Chat / Reasoning

| Model | Type | Input $/1M | Output $/1M |
|-------|------|-----------|-------------|
| `nebius/Qwen/Qwen3.5-397B-A17B` | Chat | $0.60 | $3.60 |
| `nebius/Qwen/Qwen3-Coder-480B-A35B-Instruct` | Chat | $0.40 | $1.80 |
| `nebius/Qwen/Qwen3-235B-A22B-Thinking-2507` | Reasoning | $0.20 | $0.80 |
| `nebius/Qwen/Qwen3-235B-A22B-Instruct-2507` | Chat | $0.20 | $0.60 |
| `nebius/Qwen/Qwen3-Next-80B-A3B-Thinking` | Reasoning | $0.15 | $1.20 |
| `nebius/deepseek-ai/DeepSeek-V3.2` | Chat | $0.30 | $0.45 |
| `nebius/deepseek-ai/DeepSeek-R1-0528` | Reasoning | $0.80 | $2.40 |
| `nebius/zai-org/GLM-5` | Chat | $1.00 | $3.20 |
| `nebius/openai/gpt-oss-120b` | Reasoning | $0.15 | $0.60 |
| `nebius/NousResearch/Hermes-4-405B` | Reasoning | $1.00 | $3.00 |
| ... and 28 more (see `index.ts` for full catalog) | | | |

### Embedding

> **Not registered in this plugin.** The OpenClaw SDK does not yet support
> embedding-only models. Nebius offers embedding models (Qwen3-Embedding-8B,
> BGE-ICL, etc.) — use them directly via the Nebius API, not through OpenClaw.

### Image Generation (not chat-eligible)

| Model | Pricing |
|-------|---------|
| `nebius/black-forest-labs/FLUX.1-schnell` | per image |
| `nebius/black-forest-labs/FLUX.1-dev` | per image |

---

## Development

```bash
npm install
npm run check    # type-check without emitting
npm run build    # compile to dist/
npm test         # run vitest
```

---

## Troubleshooting

**"No API key found for provider nebius"**
- Verify `auth-profiles.json` has the `nebius:default` entry with `"type": "api_key"`, `"provider": "nebius"`, `"key": "..."`
- Run `launchctl setenv NEBIUS_API_KEY "..."` and restart the gateway
- Auth is resolved from profiles + env vars, NOT from plugin config

**"Unknown model: zai-org/GLM-5"**
- You must use the fully qualified name: `nebius/zai-org/GLM-5`
- Bare model IDs without the `nebius/` prefix will not resolve

**Config validation errors**
- Run `openclaw doctor --fix`

---

## Plugin Structure

```
openclaw-nebius/
  ├── package.json            # Metadata, scripts, OpenClaw compat
  ├── openclaw.plugin.json    # Manifest + auth config
  ├── index.ts                # Provider registration + model catalog
  ├── index.test.ts           # Vitest tests
  ├── tsconfig.json           # TypeScript config (outputs to dist/)
  ├── dist/                   # Compiled output (git-ignored)
  └── SETUP.md                # This file
```
