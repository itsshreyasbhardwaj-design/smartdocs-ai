import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { analyzeRepository, RepoNotFoundError } from "@/lib/analysis";
import { checkRateLimit, getClientIp, rateLimitResponse } from "@/lib/rate-limit";

const BodySchema = z.object({
  repoUrl: z.string().min(3).max(300),
});

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  if (!checkRateLimit(`analyze:${ip}`, { limit: 10, windowMs: 60_000 })) {
    return rateLimitResponse(60);
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "A valid GitHub repository URL is required.", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  try {
    const analysis = await analyzeRepository(parsed.data.repoUrl);
    return NextResponse.json({ analysis });
  } catch (err) {
    if (err instanceof RepoNotFoundError) {
      return NextResponse.json({ error: err.message }, { status: 404 });
    }
    const message = err instanceof Error ? err.message : "Failed to analyze repository.";
    return NextResponse.json({ error: message }, { status: 422 });
  }
}
