import type { RepoAnalysis } from "@/lib/analysis";
import type { AIMessage } from "@/lib/ai/types";
import { docTypeMeta, type DocType } from "./types";
import { generateTemplate } from "./templates";

/**
 * Builds the message list for a live LLM provider. We hand the model a
 * deterministic first draft (the template) plus the structured analysis, and
 * ask it to rewrite/polish it — this keeps output grounded in real repo facts
 * instead of the model hallucinating project details.
 */
export function buildPrompt(docType: DocType, analysis: RepoAnalysis): AIMessage[] {
  const meta = docTypeMeta(docType);
  const draft = generateTemplate(docType, analysis);

  const system = `You are SmartDocs, an expert technical writer that produces production-quality developer documentation. Write in clear, professional Markdown. Never invent facts that aren't supported by the provided repository analysis or draft — instead leave a clearly marked placeholder for a human to fill in. Do not wrap the whole response in a single code fence.`;

  const user = `Write the "${meta.title}" (${meta.description}) for the repository "${analysis.ref.owner}/${analysis.ref.repo}".

Repository analysis (ground truth — do not contradict this):
\`\`\`json
${JSON.stringify(analysis, null, 2)}
\`\`\`

A deterministic first draft is provided below. Improve its phrasing, tighten the structure, and make it read like a senior engineer wrote it — but keep every fact, command, and file path accurate to the analysis above. Return only the final Markdown document.

Draft:
\`\`\`markdown
${draft}
\`\`\``;

  return [
    { role: "system", content: system },
    { role: "user", content: user },
  ];
}
