import { NextRequest, NextResponse } from "next/server";
import { authenticateAdmin } from "@/lib/admin-store";
import { createSession, verifySession, destroySession, getLogoutCookie } from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: "ユーザー名とパスワードを入力してください" },
        { status: 400 }
      );
    }

    const admin = await authenticateAdmin(username, password);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: "ユーザー名またはパスワードが正しくありません" },
        { status: 401 }
      );
    }

    const { cookieString } = await createSession(admin);
    return NextResponse.json(
      { success: true, admin: { id: admin.id, username: admin.username, role: admin.role } },
      { headers: { "Set-Cookie": cookieString } }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "ログインに失敗しました" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const session = await verifySession(request.headers.get("cookie"));
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({
    authenticated: true,
    admin: { adminId: session.adminId, username: session.username, role: session.role },
  });
}

export async function DELETE(request: NextRequest) {
  destroySession(request.headers.get("cookie"));
  return NextResponse.json(
    { success: true },
    { headers: { "Set-Cookie": getLogoutCookie() } }
  );
}
