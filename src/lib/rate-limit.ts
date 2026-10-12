// Tiny in-memory sliding-window rate limiter for auth/vote endpoints.
// NOTE: counts live per server instance. Behind multiple Render instances,
// use a shared store (e.g. Redis/Upstash) instead.

const buckets = new Map<string, number[]>();

function prune(now: number, windowMs: number) {
  if (buckets.size <= 5000) return;
  for (const [key, hits] of buckets) {
    const fresh = hits.filter((t) => now - t < windowMs);
    if (fresh.length > 0) buckets.set(key, fresh);
    else buckets.delete(key);
  }
}

/** Returns true when the call is allowed, false when the caller is over limit. */
export function rateLimit(key: string, limit = 10, windowMs = 60_000): boolean {
  const now = Date.now();
  const hits = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (hits.length >= limit) return false;
  hits.push(now);
  buckets.set(key, hits);
  prune(now, windowMs);
  return true;
}

export function clientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim();
  return ip && ip.length > 0 ? ip : "unknown";
}
