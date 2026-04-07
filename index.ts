import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
import { createProviderApiKeyAuthMethod } from "openclaw/plugin-sdk/provider-auth";

/**
 * Model type tags used in the `input` array to distinguish capabilities.
 * OpenClaw uses these to filter which models are offered for which tasks.
 *
 *   "text"      — standard text-to-text chat/completion
 *   "image"     — text-to-image generation (not chat-eligible)
 *   "embedding" — embedding-only (not chat-eligible)
 */

export interface NebiusModel {
  id: string;
  name: string;
  contextWindow: number;
  maxTokens: number;
  input: ("text" | "image")[];
  cost: { input: number; output: number };
  reasoning: boolean;
}

// ─── Chat / Reasoning Models ────────────────────────────────────────────────

const CHAT_MODELS: NebiusModel[] = [
  // MiniMax
  { id: "minimax/MiniMax-M2.5", name: "MiniMax M2.5", contextWindow: 32000, maxTokens: 4096, input: ["text"], cost: { input: 0.3, output: 1.2 }, reasoning: false },
  { id: "minimax/MiniMax-M2.1", name: "MiniMax M2.1", contextWindow: 32000, maxTokens: 4096, input: ["text"], cost: { input: 0.3, output: 1.2 }, reasoning: false },

  // NVIDIA
  { id: "nvidia/Nemotron-3-Super-120b-a12b", name: "Nemotron 3 Super 120B", contextWindow: 1000000, maxTokens: 4096, input: ["text"], cost: { input: 0.3, output: 0.9 }, reasoning: false },
  { id: "nvidia/Nemotron-Nano-V2-12b", name: "Nemotron Nano V2 12B", contextWindow: 32000, maxTokens: 4096, input: ["text"], cost: { input: 0.07, output: 0.2 }, reasoning: false },
  { id: "nvidia/Llama-3_1-Nemotron-Ultra-253B-v1", name: "Nemotron Ultra 253B", contextWindow: 128000, maxTokens: 4096, input: ["text"], cost: { input: 0.6, output: 1.8 }, reasoning: false },
  { id: "nvidia/Nemotron-3-Nano-30B-A3B", name: "Nemotron 3 Nano 30B", contextWindow: 32000, maxTokens: 4096, input: ["text"], cost: { input: 0.06, output: 0.24 }, reasoning: false },

  // Qwen
  { id: "Qwen/Qwen3.5-397B-A17B", name: "Qwen 3.5 397B MoE", contextWindow: 32000, maxTokens: 4096, input: ["text"], cost: { input: 0.6, output: 3.6 }, reasoning: false },
  { id: "Qwen/Qwen3-Coder-480B-A35B-Instruct", name: "Qwen3 Coder 480B", contextWindow: 32000, maxTokens: 4096, input: ["text"], cost: { input: 0.4, output: 1.8 }, reasoning: false },
  { id: "Qwen/Qwen3-235B-A22B-Thinking-2507", name: "Qwen3 235B Thinking", contextWindow: 32000, maxTokens: 4096, input: ["text"], cost: { input: 0.2, output: 0.8 }, reasoning: true },
  { id: "Qwen/Qwen3-235B-A22B-Instruct-2507", name: "Qwen3 235B Instruct", contextWindow: 32000, maxTokens: 4096, input: ["text"], cost: { input: 0.2, output: 0.6 }, reasoning: false },
  { id: "Qwen/Qwen3-Next-80B-A3B-Thinking", name: "Qwen3 Next 80B Thinking", contextWindow: 32000, maxTokens: 4096, input: ["text"], cost: { input: 0.15, output: 1.2 }, reasoning: true },
  { id: "Qwen/Qwen3-32B", name: "Qwen3 32B", contextWindow: 32000, maxTokens: 4096, input: ["text"], cost: { input: 0.1, output: 0.3 }, reasoning: false },
  { id: "Qwen/Qwen3-30B-A3B-Thinking-2507", name: "Qwen3 30B Thinking", contextWindow: 32000, maxTokens: 4096, input: ["text"], cost: { input: 0.1, output: 0.3 }, reasoning: true },
  { id: "Qwen/Qwen3-30B-A3B-Instruct-2507", name: "Qwen3 30B Instruct", contextWindow: 32000, maxTokens: 4096, input: ["text"], cost: { input: 0.1, output: 0.3 }, reasoning: false },
  { id: "Qwen/Qwen3-Coder-30B-A3B-Instruct", name: "Qwen3 Coder 30B", contextWindow: 32000, maxTokens: 4096, input: ["text"], cost: { input: 0.1, output: 0.3 }, reasoning: false },
  { id: "Qwen/Qwen2.5-VL-72B-Instruct", name: "Qwen2.5 VL 72B", contextWindow: 32000, maxTokens: 4096, input: ["text"], cost: { input: 0.25, output: 0.75 }, reasoning: false },
  { id: "Qwen/Qwen2.5-Coder-7B", name: "Qwen2.5 Coder 7B", contextWindow: 32000, maxTokens: 4096, input: ["text"], cost: { input: 0.03, output: 0.09 }, reasoning: false },

  // Moonshot AI
  { id: "moonshot-ai/Kimi-K2.5", name: "Kimi K2.5", contextWindow: 32000, maxTokens: 4096, input: ["text"], cost: { input: 0.5, output: 2.5 }, reasoning: false },
  { id: "moonshot-ai/Kimi-K2-Instruct", name: "Kimi K2 Instruct", contextWindow: 32000, maxTokens: 4096, input: ["text"], cost: { input: 0.5, output: 2.4 }, reasoning: false },
  { id: "moonshot-ai/Kimi-K2-Thinking", name: "Kimi K2 Thinking", contextWindow: 32000, maxTokens: 4096, input: ["text"], cost: { input: 0.6, output: 2.5 }, reasoning: true },

  // Z.ai (GLM)
  { id: "zai-org/GLM-5", name: "GLM-5", contextWindow: 32000, maxTokens: 4096, input: ["text"], cost: { input: 1.0, output: 3.2 }, reasoning: false },
  { id: "zai-org/GLM-4.7", name: "GLM-4.7", contextWindow: 32000, maxTokens: 4096, input: ["text"], cost: { input: 0.4, output: 2.0 }, reasoning: false },
  { id: "zai-org/GLM-4.5", name: "GLM-4.5", contextWindow: 32000, maxTokens: 4096, input: ["text"], cost: { input: 0.6, output: 2.2 }, reasoning: false },
  { id: "zai-org/GLM-4.5-Air", name: "GLM-4.5 Air", contextWindow: 32000, maxTokens: 4096, input: ["text"], cost: { input: 0.2, output: 1.2 }, reasoning: false },

  // DeepSeek
  { id: "deepseek-ai/DeepSeek-V3.2", name: "DeepSeek V3.2", contextWindow: 128000, maxTokens: 4096, input: ["text"], cost: { input: 0.3, output: 0.45 }, reasoning: false },
  { id: "deepseek-ai/DeepSeek-R1-0528", name: "DeepSeek R1", contextWindow: 128000, maxTokens: 4096, input: ["text"], cost: { input: 0.8, output: 2.4 }, reasoning: true },
  { id: "deepseek-ai/DeepSeek-V3-0324", name: "DeepSeek V3", contextWindow: 128000, maxTokens: 4096, input: ["text"], cost: { input: 0.5, output: 1.5 }, reasoning: false },

  // NousResearch
  { id: "NousResearch/Hermes-4-405B", name: "Hermes 4 405B", contextWindow: 32000, maxTokens: 4096, input: ["text"], cost: { input: 1.0, output: 3.0 }, reasoning: true },
  { id: "NousResearch/Hermes-4-70B", name: "Hermes 4 70B", contextWindow: 32000, maxTokens: 4096, input: ["text"], cost: { input: 0.13, output: 0.4 }, reasoning: true },

  // OpenAI (open-weight)
  { id: "openai/gpt-oss-120b", name: "GPT-OSS 120B", contextWindow: 128000, maxTokens: 4096, input: ["text"], cost: { input: 0.15, output: 0.6 }, reasoning: true },
  { id: "openai/gpt-oss-20b", name: "GPT-OSS 20B", contextWindow: 128000, maxTokens: 4096, input: ["text"], cost: { input: 0.05, output: 0.2 }, reasoning: true },

  // Prime Intellect
  { id: "PrimeIntellect/INTELLECT-3", name: "INTELLECT-3", contextWindow: 32000, maxTokens: 4096, input: ["text"], cost: { input: 0.2, output: 1.1 }, reasoning: false },

  // Google
  { id: "google/Gemma-3-27b-it", name: "Gemma 3 27B", contextWindow: 32000, maxTokens: 4096, input: ["text"], cost: { input: 0.1, output: 0.3 }, reasoning: false },
  { id: "google/Gemma-2-9b-it", name: "Gemma 2 9B", contextWindow: 8000, maxTokens: 4096, input: ["text"], cost: { input: 0.03, output: 0.09 }, reasoning: false },
  { id: "google/Gemma-2-2b-it", name: "Gemma 2 2B", contextWindow: 8000, maxTokens: 4096, input: ["text"], cost: { input: 0.02, output: 0.06 }, reasoning: false },

  // Meta
  { id: "meta-llama/Llama-3.3-70B-Instruct", name: "Llama 3.3 70B Instruct", contextWindow: 128000, maxTokens: 4096, input: ["text"], cost: { input: 0.13, output: 0.4 }, reasoning: false },
  { id: "meta-llama/Meta-Llama-3.1-8B-Instruct", name: "Llama 3.1 8B Instruct", contextWindow: 128000, maxTokens: 4096, input: ["text"], cost: { input: 0.02, output: 0.06 }, reasoning: false },
  { id: "meta-llama/Meta-Llama-Guard-3-8B", name: "Llama Guard 3 8B", contextWindow: 32000, maxTokens: 4096, input: ["text"], cost: { input: 0.02, output: 0.06 }, reasoning: false },
];

// ─── Embedding Models ───────────────────────────────────────────────────────
// Excluded from provider catalog: OpenClaw's ModelDefinitionConfig only allows
// input: "text" | "image". Embedding models would need a separate registration
// path (registerEmbeddingProvider) if/when the SDK supports it.
//
// Available on Nebius but not registered here:
//   - Qwen/Qwen3-Embedding-8B
//   - BAAI/bge-multilingual-gemma2
//   - BAAI/BGE-ICL
//   - intfloat/e5-mistral-7b-instruct

// ─── Image Generation Models (not chat-eligible) ───────────────────────────

const IMAGE_MODELS: NebiusModel[] = [
  { id: "black-forest-labs/FLUX.1-schnell", name: "FLUX.1 Schnell", contextWindow: 4096, maxTokens: 4096, input: ["image"], cost: { input: 0, output: 0 }, reasoning: false },
  { id: "black-forest-labs/FLUX.1-dev", name: "FLUX.1 Dev", contextWindow: 4096, maxTokens: 4096, input: ["image"], cost: { input: 0, output: 0 }, reasoning: false },
];

// ─── Full catalog (exported for testing) ────────────────────────────────────

export const NEBIUS_MODELS: NebiusModel[] = [
  ...CHAT_MODELS,
  ...IMAGE_MODELS,
];

export const PROVIDER_ID = "nebius";
export const BASE_URL = "https://api.tokenfactory.nebius.com/v1";

// ─── Plugin entry ───────────────────────────────────────────────────────────

export default definePluginEntry({
  id: PROVIDER_ID,
  name: "Nebius Token Factory",
  description:
    "Nebius Token Factory model provider — 44+ open-source models via a single OpenAI-compatible endpoint",
  register(api) {
    api.registerProvider({
      id: PROVIDER_ID,
      label: "Nebius Token Factory",
      docsPath: "/providers/nebius",
      envVars: ["NEBIUS_API_KEY"],
      auth: [
        createProviderApiKeyAuthMethod({
          providerId: PROVIDER_ID,
          methodId: "api-key",
          label: "Nebius Token Factory API key",
          optionKey: "nebiusApiKey",
          flagName: "--nebius-api-key",
          envVar: "NEBIUS_API_KEY",
          promptMessage: "Enter your Nebius Token Factory API key",
          defaultModel: `${PROVIDER_ID}/Qwen/Qwen3.5-397B-A17B`,
        }),
      ],
      catalog: {
        order: "simple",
        run: async (ctx) => {
          const { apiKey } = ctx.resolveProviderApiKey(PROVIDER_ID);
          if (!apiKey) return null;
          return {
            provider: {
              baseUrl: BASE_URL,
              apiKey,
              api: "openai-completions",
              models: NEBIUS_MODELS,
            },
          };
        },
      },
    });
  },
});
