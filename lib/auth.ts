import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/**
 * Single-user admin auth: one password in an env var, session held in an
 * HMAC-signed, HTTP-only cookie. No database, no dependencies.
 *
 * Required env (see .env.local):
 *   ADMIN_PASSWORD  the password you log in with
 *   ADMIN_SECRET    random string used to sign the session cookie
 */

const COOKIE = "admin_session";
const MAX_AGE = 60 * 60 * 12; // 12 hours

function secret(): string {
  const value = process.env.ADMIN_SECRET;
  if (!value || value.length < 16) {
    throw new Error(
      "ADMIN_SECRET is missing or too short. Set a random 32+ character value in .env.local.",
    );
  }
  return value;
}

const sign = (payload: string) =>
  createHmac("sha256", secret()).update(payload).digest("base64url");

/** Constant-time compare that tolerates length mismatch. */
function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export function verifyPassword(candidate: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    throw new Error("ADMIN_PASSWORD is not set. Add it to .env.local.");
  }
  return safeEqual(candidate, expected);
}

/** token = <expiry>.<nonce>.<hmac> */
function createToken(): string {
  const expires = Date.now() + MAX_AGE * 1000;
  const nonce = randomBytes(12).toString("base64url");
  const payload = `${expires}.${nonce}`;
  return `${payload}.${sign(payload)}`;
}

function isTokenValid(token: string | undefined): boolean {
  if (!token) return false;

  const parts = token.split(".");
  if (parts.length !== 3) return false;

  const [expires, nonce, mac] = parts;
  if (!safeEqual(mac, sign(`${expires}.${nonce}`))) return false;

  const expiry = Number(expires);
  return Number.isFinite(expiry) && expiry > Date.now();
}

export async function startSession(): Promise<void> {
  const jar = await cookies();
  jar.set(COOKIE, createToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function endSession(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export async function isAuthenticated(): Promise<boolean> {
  try {
    const jar = await cookies();
    return isTokenValid(jar.get(COOKIE)?.value);
  } catch {
    return false;
  }
}
