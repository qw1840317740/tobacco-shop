import { NextRequest, NextResponse } from "next/server";
import { authenticateUser, getUserProfile } from "@/lib/user-store";
import { createUserSession, verifyUserSession, getUserLogoutCookie } from "@/lib/user-auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "メールアドレスとパスワードを入力してください" },
        { status: 400 }
      );
    }

    const user = await authenticateUser(email, password);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "メールアドレスまたはパスワードが正しくありません" },
        { status: 401 }
      );
    }

    const { cookieString } = createUserSession(user);
    const profile = {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role,
      ageVerified: user.ageVerified,
      ageDocStatus: user.ageDocStatus,
    };
    return NextResponse.json(
      { success: true, user: profile },
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
  const session = verifyUserSession(request.headers.get("cookie"));
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  const profile = await getUserProfile(session.userId);
  if (!profile) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({
    authenticated: true,
    user: {
      id: profile.id,
      email: profile.email,
      name: profile.name,
      phone: profile.phone,
      role: profile.role,
      ageVerified: profile.ageVerified,
      ageDocStatus: profile.ageDocStatus,
    },
  });
}

export async function DELETE() {
  return NextResponse.json(
    { success: true },
    { headers: { "Set-Cookie": getUserLogoutCookie() } }
  );
}
