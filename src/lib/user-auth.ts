// Stateless user session — uses Web Crypto (works in both Node 18+ and Edge runtime).
// Token format: base64(json{userId,email,name,role,iat}).hex(hmac-sha256)

const enc = new TextEncoder();
const SESSION_SECRET =
  process.env.SESSION_SECRET || "tabacoya-session-secret-key-2026-dev-only";

let keyPromise: Promise<CryptoKey> | null = null;
function getKey(): Promise<CryptoKey> {
  if (!keyPromise) {
    keyPromise = crypto.subtle.importKey(
      "raw",
      enc.encode(SESSION_SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign", "verify"]
    );
  }
  return keyPromise;
}

function bytesToHex(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let out = "";
  for (let i = 0; i < bytes.length; i++) {
    out += bytes[i].toString(16).padStart(2, "0");
  }
  return out;
}

async function sign(data: string): Promise<string> {
  const key = await getKey();
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  return bytesToHex(sig);
}

function b64encode(s: string): string {
  if (typeof btoa === "function") return btoa(unescape(encodeURIComponent(s)));
  // @ts-ignore
  return Buffer.from(s, "utf-8").toString("base64");
}

function b64decode<T = unknown>(s: string): T | null {
  try {
    // @ts-ignore
    const json = typeof Buffer !== "undefined"
      ? Buffer.from(s, "base64").toString("utf-8")
      : decodeURIComponent(escape(atob(s)));
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}

export async function createUserSession(user: {
  id: string;
  email: string;
  name: string;
  role: string;
}): Promise<{ token: string; cookieString: string }> {
  const payload = JSON.stringify({
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    iat: Date.now(),
  });
  const encoded = b64encode(payload);
  const signature = await sign(encoded);
  const token = `${encoded}.${signature}`;
  return {
    token,
    cookieString: `user_session=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=86400`,
  };
}

export async function verifyUserSession(
  cookieHeader: string | null
): Promise<{ userId: string; email: string; name: string; role: string } | null> {
  if (!cookieHeader) return null;
  const token = parseCookie(cookieHeader, "user_session");
  if (!token) return null;

  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [encoded, signature] = parts;
  const expected = await sign(encoded);
  if (expected.length !== signature.length) return null;
  if (expected !== signature) return null;

  const payload = b64decode<{ userId: string; email: string; name: string; role: string; iat: number }>(encoded);
  if (!payload) return null;
  if (Date.now() - payload.iat > 86400000) return null;
  return {
    userId: payload.userId,
    email: payload.email,
    name: payload.name,
    role: payload.role,
  };
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

export async function isUserAuthenticated(cookieHeader: string | null): Promise<boolean> {
  return (await verifyUserSession(cookieHeader)) !== null;
}
