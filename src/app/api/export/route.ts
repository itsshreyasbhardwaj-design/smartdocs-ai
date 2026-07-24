import { NextRequest } from "next/server";
import { z } from "zod";
import { marked } from "marked";
import { checkRateLimit, getClientIp, rateLimitResponse } from "@/lib/rate-limit";
// html-to-docx has no type declarations; imported dynamically below.

const MAX_MARKDOWN_LENGTH = 300_000;

const BodySchema = z.object({
  markdown: z.string().max(MAX_MARKDOWN_LENGTH),
  filename: z.string().min(1).max(200),
  format: z.enum(["html", "docx"]),
});

function sanitizeFilename(name: string): string {
  const cleaned = name.replace(/[^a-zA-Z0-9-_]/g, "-").slice(0, 100);
  return cleaned || "document";
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  if (!checkRateLimit(`export:${ip}`, { limit: 30, windowMs: 60_000 })) {
    return rateLimitResponse(60);
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON body.", { status: 400 });
  }

  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return new Response("markdown, filename, and format are required.", { status: 400 });
  }

  const { markdown, format } = parsed.data;
  const filename = sanitizeFilename(parsed.data.filename);
  const html = await marked.parse(markdown, { async: true });

  if (format === "html") {
    const document = `<!doctype html>
<html><head><meta charset="utf-8"><title>${filename}</title></head>
<body>${html}</body></html>`;
    return new Response(document, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}.html"`,
      },
    });
  }

  const { default: HTMLtoDOCX } = await import("html-to-docx");
  const buffer = await HTMLtoDOCX(html, undefined, {
    table: { row: { cantSplit: true } },
    footer: false,
    pageNumber: false,
  });
  const bytes = buffer instanceof Buffer ? new Uint8Array(buffer) : new Uint8Array(buffer);

  return new Response(bytes, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename="${filename}.docx"`,
    },
  });
}
