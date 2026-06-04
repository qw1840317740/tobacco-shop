import { NextRequest, NextResponse } from "next/server";
import { verifyUserSession } from "@/lib/user-auth";
import { getUserById, updateUserPassword } from "@/lib/user-store";
import { createHash } from "crypto";

function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}

export async function PUT(request: NextRequest) {
  const session = verifyUserSession(request.headers.get("cookie"));
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "パスワードを入力してください" }, { status: 400 });
    }
    if (newPassword.length < 6) {
      return NextResponse.json({ error: "パスワードは6文字以上必要です" }, { status: 400 });
    }

    const user = await getUserById(session.userId);
    if (!user || user.passwordHash !== hashPassword(currentPassword)) {
      return NextResponse.json({ error: "現在のパスワードが正しくありません" }, { status: 400 });
    }

    const ok = await updateUserPassword(session.userId, newPassword);
    if (!ok) {
      return NextResponse.json({ error: "パスワード変更に失敗しました" }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "パスワード変更に失敗しました" }, { status: 500 });
  }
}
