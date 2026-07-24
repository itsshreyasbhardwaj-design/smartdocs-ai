import type { AIProvider, GenerateOptions } from "./types";
import { generateTemplate } from "@/lib/docs/templates";
import type { DocType } from "@/lib/docs/types";
import type { RepoAnalysis } from "@/lib/analysis";

const CHUNK_SIZE = 24;
const DELAY_MS = 8;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Zero-cost provider. Produces real, useful documentation deterministically
 * from the repo analysis (see lib/docs/templates.ts) — no API key required.
 * Streams the result in small chunks so the UI experience matches a live LLM.
 */
export class MockProvider implements AIProvider {
  id = "mock";
  name = "SmartDocs Local (no API key required)";
  isLive = false;

  async *generateStream(options: GenerateOptions): AsyncGenerator<string, void, unknown> {
    const docType = options.context?.docType as DocType | undefined;
    const analysis = options.context?.analysis as RepoAnalysis | undefined;

    const text =
      docType && analysis
        ? generateTemplate(docType, analysis)
        : options.messages.at(-1)?.content ?? "";

    for (let i = 0; i < text.length; i += CHUNK_SIZE) {
      yield text.slice(i, i + CHUNK_SIZE);
      await sleep(DELAY_MS);
    }
  }
}
