import { NextRequest } from "next/server";
import { z } from "zod";
import { marked } from "marked";
// html-to-docx has no type declarations; imported dynamically below.

const BodySchema = z.object({
  markdown: z.string(),
  filename: z.string().min(1).max(200),
  format: z.enum(["html", "docx"]),
});

export async function POST(req: NextRequest) {
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

  const { markdown, filename, format } = parsed.data;
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
