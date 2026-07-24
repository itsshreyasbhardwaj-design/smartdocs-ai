import { NextRequest } from "next/server";

interface Bucket {
  count: number;
  resetAt: number;
}

// Per-instance in-memory limiter. Good enough to blunt abusive bursts on a
// free, DB-less deployment — not a substitute for a distributed limiter, but
// it costs nothing and needs no external service.
const buckets = new Map<string, Bucket>();
const MAX_BUCKETS = 5000; // hard cap so this can never grow unbounded

export interface RateLimitOptions {
  /** Max requests allowed per window. */
  limit: number;
  /** Window size in milliseconds. */
  windowMs: number;
}

export function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

/** Returns true when the request is within the limit, false when it should be rejected. */
export function checkRateLimit(key: string, opts: RateLimitOptions): boolean {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || now >= existing.resetAt) {
    if (buckets.size >= MAX_BUCKETS) {
      // Evict the oldest-looking entry rather than let the map grow forever.
      const firstKey = buckets.keys().next().value;
      if (firstKey) buckets.delete(firstKey);
    }
    buckets.set(key, { count: 1, resetAt: now + opts.windowMs });
    return true;
  }

  if (existing.count >= opts.limit) return false;

  existing.count += 1;
  return true;
}

export function rateLimitResponse(retryAfterSeconds: number) {
  return new Response(
    JSON.stringify({ error: "Too many requests. Please slow down and try again shortly." }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": String(retryAfterSeconds),
      },
    }
  );
}
