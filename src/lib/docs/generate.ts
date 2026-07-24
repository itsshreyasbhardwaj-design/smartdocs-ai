import type { RepoAnalysis } from "@/lib/analysis";
import type { AIProvider } from "@/lib/ai/types";
import { buildPrompt } from "./prompts";
import type { DocType } from "./types";

export * from "./types";
export { generateTemplate } from "./templates";

export async function* generateDocument(
  docType: DocType,
  analysis: RepoAnalysis,
  provider: AIProvider
): AsyncGenerator<string, void, unknown> {
  const messages = buildPrompt(docType, analysis);
  yield* provider.generateStream({
    messages,
    context: { docType, analysis },
  });
}
