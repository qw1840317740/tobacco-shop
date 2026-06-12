import { createHmac, timingSafeEqual } from "crypto";

// Stateless session — no file storage needed (works on Vercel)
// Token format: base64(json{adminId,username,role,iat}).hmacSignature

const SESSION_SECRET = process.env.SESSION_SECRET;
if (!SESSION_SECRET) {
  console.warn("[WARN] SESSION_SECRET is not set. Using insecure default. Set SESSION_SECRET in .env for production.");
}
const SECRET = SESSION_SECRET || "tabacoya-session-secret-key-2026-dev-only";

function sign(data: string): string {
  return createHmac("sha256", SECRET).update(data).digest("hex");
}

export function createSession(admin: {
  id: string;
  username: string;
  role: string;
}): { token: string; cookieString: string } {
  const payload = JSON.stringify({
    adminId: admin.id,
    username: admin.username,
    role: admin.role,
    iat: Date.now(),
  });
  const encoded = Buffer.from(payload).toString("base64");
  const signature = sign(encoded);
  const token = `${encoded}.${signature}`;
  return {
    token,
    cookieString: `admin_session=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=86400`,
  };
}

export function verifySession(
  cookieHeader: string | null
): { adminId: string; username: string; role: string } | null {
  if (!cookieHeader) return null;
  const token = parseCookie(cookieHeader, "admin_session");
  if (!token) return null;

  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [encoded, signature] = parts;
  const expected = sign(encoded);

  // Timing-safe comparison to prevent timing attacks
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
    // Check token age (24 hours max)
    if (Date.now() - payload.iat > 86400000) return null;
    return {
      adminId: payload.adminId,
      username: payload.username,
      role: payload.role,
    };
  } catch {
    return null;
  }
}

export function destroySession(_cookieHeader: string | null): string | null {
  // Stateless — just return something (cookie gets deleted by Set-Cookie header)
  return "destroyed";
}

export function getLogoutCookie(): string {
  return "admin_session=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0";
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

// Backward compatibility — existing API routes use this
export function isAdminAuthenticated(cookieHeader: string | null): boolean {
  return verifySession(cookieHeader) !== null;
}
