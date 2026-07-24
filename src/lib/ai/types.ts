export type AIMessageRole = "system" | "user" | "assistant";

export interface AIMessage {
  role: AIMessageRole;
  content: string;
}

export interface GenerateOptions {
  messages: AIMessage[];
  temperature?: number;
  maxTokens?: number;
  /** Structured context passed to providers that can use it without an LLM call (e.g. the mock provider). */
  context?: Record<string, unknown>;
}

export interface AIProvider {
  id: string;
  name: string;
  /** True when the provider is backed by a real LLM call (costs money / needs a key). */
  isLive: boolean;
  generateStream(options: GenerateOptions): AsyncGenerator<string, void, unknown>;
}
