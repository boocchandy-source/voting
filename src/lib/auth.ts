import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";

const COOKIE_NAME = "tcc_session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export type SessionPayload = {
  sub: number; // students.id
  studentId: string;
  firstname: string;
  lastname: string;
  isAdmin: boolean;
};

function secret() {
  const s = process.env.SESSION_SECRET;
  if (!s) throw new Error("SESSION_SECRET is not set");
  return new TextEncoder().encode(s);
}

export async function createSession(payload: SessionPayload) {
  const token = await new SignJWT({ ...payload, sub: String(payload.sub) })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(secret());
  const jar = await cookies();
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function destroySession() {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}

/** Returns the session payload, or null when missing/invalid. */
export async function getSession(): Promise<SessionPayload | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    const sub = Number(payload.sub);
    if (!Number.isInteger(sub) || typeof payload.studentId !== "string") {
      return null;
    }
    return {
      sub,
      studentId: payload.studentId,
      firstname: String(payload.firstname ?? ""),
      lastname: String(payload.lastname ?? ""),
      isAdmin: Boolean(payload.isAdmin),
    };
  } catch {
    return null;
  }
}

/** Verifies a raw token (for middleware / edge runtime). */
export async function verifyToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, secret());
    return true;
  } catch {
    return false;
  }
}

export { COOKIE_NAME };
