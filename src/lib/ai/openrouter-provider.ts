import type { AIProvider, GenerateOptions } from "./types";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

/**
 * Real LLM provider via OpenRouter. Requires OPENROUTER_API_KEY. Streams
 * tokens using OpenRouter's SSE-over-HTTP chat completions endpoint.
 */
export class OpenRouterProvider implements AIProvider {
  id = "openrouter";
  name: string;
  isLive = true;

  private apiKey: string;
  private model: string;

  constructor(apiKey: string, model = process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini") {
    this.apiKey = apiKey;
    this.model = model;
    this.name = `OpenRouter (${model})`;
  }

  async *generateStream(options: GenerateOptions): AsyncGenerator<string, void, unknown> {
    const res = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://github.com/itsshreyasbhardwaj-design/smartdocs-ai",
        "X-Title": "SmartDocs",
      },
      body: JSON.stringify({
        model: this.model,
        messages: options.messages,
        temperature: options.temperature ?? 0.4,
        max_tokens: options.maxTokens ?? 2048,
        stream: true,
      }),
    });

    if (!res.ok || !res.body) {
      const errText = await res.text().catch(() => res.statusText);
      throw new Error(`OpenRouter request failed (${res.status}): ${errText}`);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith("data:")) continue;
        const payload = trimmed.slice(5).trim();
        if (payload === "[DONE]") return;
        try {
          const parsed = JSON.parse(payload);
          const delta = parsed.choices?.[0]?.delta?.content;
          if (delta) yield delta as string;
        } catch {
          // ignore malformed SSE keep-alive chunks
        }
      }
    }
  }
}
