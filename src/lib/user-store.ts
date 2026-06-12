import { scryptSync, randomBytes, timingSafeEqual } from "crypto";
import { db } from "./db";

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  phone: string;
  birthdate: string | null;
  ageVerified: boolean;
  ageDocStatus: string;
  ageDocUrl: string;
  ageDocType: string;
  ageDocReviewedAt: string | null;
  ageDocReviewedBy: string | null;
  ageDocRejectReason: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone: string;
  birthdate: string | null;
  ageVerified: boolean;
  ageDocStatus: string;
  ageDocType: string;
  ageDocRejectReason: string;
  role: string;
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

function toUser(row: any): User {
  return {
    id: row.id,
    email: row.email,
    passwordHash: row.passwordHash,
    name: row.name,
    phone: row.phone,
    birthdate: row.birthdate ? row.birthdate.toISOString() : null,
    ageVerified: row.ageVerified,
    ageDocStatus: row.ageDocStatus,
    ageDocUrl: row.ageDocUrl,
    ageDocType: row.ageDocType,
    ageDocReviewedAt: row.ageDocReviewedAt ? row.ageDocReviewedAt.toISOString() : null,
    ageDocReviewedBy: row.ageDocReviewedBy,
    ageDocRejectReason: row.ageDocRejectReason,
    role: row.role,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

function toProfile(user: User): UserProfile {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    phone: user.phone,
    birthdate: user.birthdate,
    ageVerified: user.ageVerified,
    ageDocStatus: user.ageDocStatus,
    ageDocType: user.ageDocType,
    ageDocRejectReason: user.ageDocRejectReason,
    role: user.role,
    createdAt: user.createdAt,
  };
}

export async function authenticateUser(email: string, password: string): Promise<User | null> {
  const row = await db.user.findUnique({ where: { email } });
  if (!row) return null;
  if (!verifyPassword(password, row.passwordHash)) return null;
  return toUser(row);
}

export async function getUserById(id: string): Promise<User | null> {
  const row = await db.user.findUnique({ where: { id } });
  if (!row) return null;
  return toUser(row);
}

export async function getUserProfile(id: string): Promise<UserProfile | null> {
  const user = await getUserById(id);
  if (!user) return null;
  return toProfile(user);
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const row = await db.user.findUnique({ where: { email } });
  if (!row) return null;
  return toUser(row);
}

export async function createUser(
  email: string, password: string, name: string
): Promise<User> {
  const existing = await db.user.findUnique({ where: { email } });
  if (existing) throw new Error("このメールアドレスは既に登録されています");
  const id = `user_${randomBytes(8).toString("hex")}`;
  const row = await db.user.create({
    data: { id, email, passwordHash: hashPassword(password), name },
  });
  return toUser(row);
}

export async function updateUserProfile(
  id: string, updates: { name?: string; phone?: string; birthdate?: string }
): Promise<UserProfile | null> {
  const data: any = {};
  if (updates.name !== undefined) data.name = updates.name;
  if (updates.phone !== undefined) data.phone = updates.phone;
  if (updates.birthdate !== undefined) data.birthdate = updates.birthdate ? new Date(updates.birthdate) : null;
  try {
    const row = await db.user.update({ where: { id }, data });
    return toProfile(toUser(row));
  } catch {
    return null;
  }
}

export async function updateUserPassword(id: string, newPassword: string): Promise<boolean> {
  try {
    await db.user.update({
      where: { id },
      data: { passwordHash: hashPassword(newPassword) },
    });
    return true;
  } catch {
    return false;
  }
}

export async function submitAgeDoc(
  userId: string, docUrl: string, docType: string
): Promise<boolean> {
  try {
    await db.user.update({
      where: { id: userId },
      data: {
        ageDocUrl: docUrl,
        ageDocType: docType,
        ageDocStatus: "pending",
        ageDocReviewedAt: null,
        ageDocReviewedBy: null,
        ageDocRejectReason: "",
      },
    });
    return true;
  } catch {
    return false;
  }
}

export async function approveAgeDoc(userId: string, adminId: string): Promise<boolean> {
  try {
    await db.user.update({
      where: { id: userId },
      data: {
        ageDocStatus: "approved",
        ageVerified: true,
        ageDocReviewedAt: new Date(),
        ageDocReviewedBy: adminId,
        ageDocRejectReason: "",
      },
    });
    return true;
  } catch {
    return false;
  }
}

export async function rejectAgeDoc(userId: string, adminId: string, reason: string): Promise<boolean> {
  try {
    await db.user.update({
      where: { id: userId },
      data: {
        ageDocStatus: "rejected",
        ageVerified: false,
        ageDocReviewedAt: new Date(),
        ageDocReviewedBy: adminId,
        ageDocRejectReason: reason,
      },
    });
    return true;
  } catch {
    return false;
  }
}

export async function listPendingAgeDocs(): Promise<UserProfile[]> {
  const rows = await db.user.findMany({
    where: { ageDocStatus: "pending" },
    orderBy: { updatedAt: "asc" },
  });
  return rows.map((r) => toProfile(toUser(r)));
}

export async function listAllAgeDocs(): Promise<UserProfile[]> {
  const rows = await db.user.findMany({
    where: { ageDocStatus: { not: "none" } },
    orderBy: { updatedAt: "desc" },
  });
  return rows.map((r) => toProfile(toUser(r)));
}
