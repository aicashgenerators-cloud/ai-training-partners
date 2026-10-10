import { createHmac, timingSafeEqual } from "node:crypto";
import { env } from "./env";

const TOKEN_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

function sign(payload: string): string {
  return createHmac("sha256", env.tokenSecret).update(payload).digest("base64url");
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

export function checkPassword(input: string): boolean {
  // Hash both sides so comparison time doesn't depend on length.
  const h = (s: string) => createHmac("sha256", "pw").update(s).digest("base64url");
  return safeEqual(h(input), h(env.adminPassword));
}

export function issueToken(): string {
  const exp = Date.now() + TOKEN_TTL_MS;
  const payload = String(exp);
  return `${payload}.${sign(payload)}`;
}

export function verifyToken(token: string | null | undefined): boolean {
  if (!token) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  if (!safeEqual(sig, sign(payload))) return false;
  const exp = Number(payload);
  return Number.isFinite(exp) && exp > Date.now();
}

export function bearerFrom(req: Request): string | null {
  const h = req.headers.get("authorization");
  if (!h || !h.toLowerCase().startsWith("bearer ")) return null;
  return h.slice(7).trim();
}

/** Tiny in-memory sliding-window limiter (per process; fine for a single instance). */
export function createLimiter(max: number, windowMs: number) {
  const hits = new Map<string, number[]>();
  return {
    take(key: string): boolean {
      const now = Date.now();
      const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
      if (recent.length >= max) {
        hits.set(key, recent);
        return false;
      }
      recent.push(now);
      hits.set(key, recent);
      return true;
    },
    reset(key: string) {
      hits.delete(key);
    },
  };
}

export function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  return (fwd?.split(",")[0] ?? "").trim() || "unknown";
}
