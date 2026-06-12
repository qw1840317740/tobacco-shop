import { scryptSync, randomBytes, timingSafeEqual } from "crypto";
import { db } from "./db";

export interface Admin {
  id: string;
  username: string;
  passwordHash: string;
  role: "superadmin" | "admin";
  createdAt: string;
}

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const derived = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derived}`;
}

function verifyPassword(password: string, stored: string): boolean {
  const [salt, derived] = stored.split(":");
  if (!salt || !derived) return false;
  const candidate = scryptSync(password, salt, 64).toString("hex");
  try {
    return timingSafeEqual(Buffer.from(derived), Buffer.from(candidate));
  } catch {
    return false;
  }
}

export async function authenticateAdmin(username: string, password: string): Promise<Admin | null> {
  const row = await db.admin.findUnique({ where: { username } });
  if (!row) return null;
  if (!verifyPassword(password, row.passwordHash)) return null;
  return {
    id: row.id,
    username: row.username,
    passwordHash: row.passwordHash,
    role: row.role as "superadmin" | "admin",
    createdAt: row.createdAt.toISOString(),
  };
}

export async function getAdminByUsername(username: string): Promise<Admin | null> {
  const row = await db.admin.findUnique({ where: { username } });
  if (!row) return null;
  return {
    id: row.id, username: row.username, passwordHash: row.passwordHash,
    role: row.role as "superadmin" | "admin", createdAt: row.createdAt.toISOString(),
  };
}

export async function getAdminById(id: string): Promise<Admin | null> {
  const row = await db.admin.findUnique({ where: { id } });
  if (!row) return null;
  return {
    id: row.id, username: row.username, passwordHash: row.passwordHash,
    role: row.role as "superadmin" | "admin", createdAt: row.createdAt.toISOString(),
  };
}

export async function listAdmins(): Promise<Omit<Admin, "passwordHash">[]> {
  const rows = await db.admin.findMany();
  return rows.map((r) => ({
    id: r.id, username: r.username,
    role: r.role as "superadmin" | "admin", createdAt: r.createdAt.toISOString(),
  }));
}

export async function createAdmin(
  username: string, password: string, role: "superadmin" | "admin" = "admin"
): Promise<Admin> {
  const existing = await db.admin.findUnique({ where: { username } });
  if (existing) throw new Error("ユーザー名は既に使用されています");
  const id = `admin_${randomBytes(8).toString("hex")}`;
  const row = await db.admin.create({
    data: { id, username, passwordHash: hashPassword(password), role },
  });
  return {
    id: row.id, username: row.username, passwordHash: row.passwordHash,
    role: row.role as "superadmin" | "admin", createdAt: row.createdAt.toISOString(),
  };
}

export async function deleteAdmin(id: string): Promise<boolean> {
  const count = await db.admin.count();
  if (count <= 1) throw new Error("最後の管理者は削除できません");
  try {
    await db.admin.delete({ where: { id } });
    return true;
  } catch { return false; }
}

export async function resetPassword(id: string, newPassword: string): Promise<boolean> {
  try {
    await db.admin.update({
      where: { id },
      data: { passwordHash: hashPassword(newPassword) },
    });
    return true;
  } catch { return false; }
}
