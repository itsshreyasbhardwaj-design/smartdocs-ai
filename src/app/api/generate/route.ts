import { NextRequest } from "next/server";
import { z } from "zod";
import { generateDocument } from "@/lib/docs/generate";
import { DOC_TYPES } from "@/lib/docs/types";
import { getAIProvider } from "@/lib/ai";
import type { RepoAnalysis } from "@/lib/analysis";
import { checkRateLimit, getClientIp, rateLimitResponse } from "@/lib/rate-limit";

const DOC_TYPE_IDS = DOC_TYPES.map((d) => d.id) as [string, ...string[]];
const MAX_BODY_BYTES = 300_000;

const BodySchema = z.object({
  docType: z.enum(DOC_TYPE_IDS),
  analysis: z.record(z.string(), z.unknown()),
});

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  if (!checkRateLimit(`generate:${ip}`, { limit: 60, windowMs: 60_000 })) {
    return rateLimitResponse(60);
  }

  const raw = await req.text();
  if (raw.length > MAX_BODY_BYTES) {
    return new Response("Request body too large.", { status: 413 });
  }

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return new Response("Invalid JSON body.", { status: 400 });
  }

  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return new Response("A docType and repository analysis are required.", { status: 400 });
  }

  const provider = getAIProvider();
  const analysis = parsed.data.analysis as unknown as RepoAnalysis;
  const docType = parsed.data.docType as (typeof DOC_TYPES)[number]["id"];

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const chunk of generateDocument(docType, analysis, provider)) {
          controller.enqueue(encoder.encode(chunk));
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Generation failed.";
        controller.enqueue(encoder.encode(`\n\n> ⚠️ Generation error: ${message}`));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "X-Provider": provider.id,
    },
  });
}
