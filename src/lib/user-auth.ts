import { createHmac, timingSafeEqual } from "crypto";

// Stateless user session — mirrors admin-auth.ts pattern
// Token format: base64(json{userId,email,role,iat}).hmacSignature

const SESSION_SECRET = process.env.SESSION_SECRET;
if (!SESSION_SECRET) {
  console.warn("[WARN] SESSION_SECRET is not set. Using insecure default. Set SESSION_SECRET in .env for production.");
}
const SECRET = SESSION_SECRET || "tabacoya-session-secret-key-2026-dev-only";

function sign(data: string): string {
  return createHmac("sha256", SECRET).update(data).digest("hex");
}

export function createUserSession(user: {
  id: string;
  email: string;
  name: string;
  role: string;
}): { token: string; cookieString: string } {
  const payload = JSON.stringify({
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    iat: Date.now(),
  });
  const encoded = Buffer.from(payload).toString("base64");
  const signature = sign(encoded);
  const token = `${encoded}.${signature}`;
  return {
    token,
    cookieString: `user_session=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=86400`,
  };
}

export function verifyUserSession(
  cookieHeader: string | null
): { userId: string; email: string; name: string; role: string } | null {
  if (!cookieHeader) return null;
  const token = parseCookie(cookieHeader, "user_session");
  if (!token) return null;

  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [encoded, signature] = parts;
  const expected = sign(encoded);

  try {
    const sigBuf = Buffer.from(signature);
    const expBuf = Buffer.from(expected);
    if (sigBuf.length !== expBuf.length) return null;
    if (!timingSafeEqual(sigBuf, expBuf)) return null;
  } catch {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64").toString("utf-8"));
    if (Date.now() - payload.iat > 86400000) return null;
    return {
      userId: payload.userId,
      email: payload.email,
      name: payload.name,
      role: payload.role,
    };
  } catch {
    return null;
  }
}

export function getUserLogoutCookie(): string {
  return "user_session=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0";
}

function parseCookie(header: string, name: string): string | null {
  const cookies = header.split(";").map((c) => c.trim());
  for (const cookie of cookies) {
    if (cookie.startsWith(`${name}=`)) {
      return cookie.substring(name.length + 1);
    }
  }
  return null;
}

export function isUserAuthenticated(cookieHeader: string | null): boolean {
  return verifyUserSession(cookieHeader) !== null;
}
