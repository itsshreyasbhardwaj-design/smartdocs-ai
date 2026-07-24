import type { AIProvider } from "./types";
import { MockProvider } from "./mock-provider";
import { OpenRouterProvider } from "./openrouter-provider";

export * from "./types";
export { MockProvider } from "./mock-provider";
export { OpenRouterProvider } from "./openrouter-provider";

/**
 * Provider factory. Falls back to the free local mock provider whenever no
 * OPENROUTER_API_KEY is configured, so the app is fully usable at $0.
 */
export function getAIProvider(): AIProvider {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (apiKey) return new OpenRouterProvider(apiKey);
  return new MockProvider();
}
