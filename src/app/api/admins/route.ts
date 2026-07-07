import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/admin-auth";
import { listAdmins, createAdmin, deleteAdmin, resetPassword } from "@/lib/admin-store";

async function checkSuperAdmin(request: NextRequest): Promise<boolean> {
  const session = await verifySession(request.headers.get("cookie"));
  return session?.role === "superadmin";
}

export async function GET(request: NextRequest) {
  if (!checkSuperAdmin(request)) {
    return NextResponse.json({ error: "権限がありません" }, { status: 403 });
  }
  const admins = await listAdmins();
  return NextResponse.json({ admins });
}

export async function POST(request: NextRequest) {
  if (!checkSuperAdmin(request)) {
    return NextResponse.json({ error: "権限がありません" }, { status: 403 });
  }
  try {
    const body = await request.json();
    const { username, password, role } = body;
    if (!username || !password) {
      return NextResponse.json({ error: "ユーザー名とパスワードは必須です" }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: "パスワードは6文字以上必要です" }, { status: 400 });
    }
    const admin = await createAdmin(username, password, role || "admin");
    return NextResponse.json({ success: true, admin: { id: admin.id, username: admin.username, role: admin.role } }, { status: 201 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "作成に失敗しました";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

export async function PUT(request: NextRequest) {
  if (!checkSuperAdmin(request)) {
    return NextResponse.json({ error: "権限がありません" }, { status: 403 });
  }
  try {
    const body = await request.json();
    const { id, newPassword } = body;
    if (!id || !newPassword) {
      return NextResponse.json({ error: "id と newPassword は必須です" }, { status: 400 });
    }
    if (newPassword.length < 6) {
      return NextResponse.json({ error: "パスワードは6文字以上必要です" }, { status: 400 });
    }
    const ok = await resetPassword(id, newPassword);
    if (!ok) return NextResponse.json({ error: "管理者が見つかりません" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "更新に失敗しました" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!checkSuperAdmin(request)) {
    return NextResponse.json({ error: "権限がありません" }, { status: 403 });
  }
  try {
    const body = await request.json();
    const { id } = body;
    if (!id) return NextResponse.json({ error: "id は必須です" }, { status: 400 });
    const ok = await deleteAdmin(id);
    if (!ok) return NextResponse.json({ error: "管理者が見つかりません" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "削除に失敗しました";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
