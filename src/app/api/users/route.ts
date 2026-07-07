import { NextRequest, NextResponse } from "next/server";
import { createUser, getUserProfile, updateUserProfile, getUserById } from "@/lib/user-store";
import { verifyUserSession, createUserSession } from "@/lib/user-auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    if (!email || !password || !name) {
      return NextResponse.json(
        { success: false, error: "すべての項目を入力してください" },
        { status: 400 }
      );
    }

    // Email format validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "正しいメールアドレスを入力してください" },
        { status: 400 }
      );
    }

    // Name validation (at least 2 chars, no pure numbers)
    if (name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: "氏名は2文字以上入力してください" },
        { status: 400 }
      );
    }

    // Password validation (at least 6 chars, must contain letter + number)
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: "パスワードは6文字以上必要です" },
        { status: 400 }
      );
    }
    if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
      return NextResponse.json(
        { success: false, error: "パスワードは英字と数字をそれぞれ含めてください" },
        { status: 400 }
      );
    }

    const user = await createUser(email, password, name);
    const { cookieString } = await createUserSession(user);
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
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "登録に失敗しました" },
      { status: 400 }
    );
  }
}

export async function GET(request: NextRequest) {
  const session = await verifyUserSession(request.headers.get("cookie"));
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const profile = await getUserProfile(session.userId);
  if (!profile) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true, user: profile });
}

export async function PUT(request: NextRequest) {
  const session = await verifyUserSession(request.headers.get("cookie"));
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const { name, phone, birthdate } = body;

    // Server-side validation — defense in depth
    if (typeof name === "string" && name.trim().length < 2) {
      return NextResponse.json(
        { error: "氏名は2文字以上で入力してください" },
        { status: 400 }
      );
    }
    if (phone !== undefined && phone !== null && phone !== "") {
      if (typeof phone !== "string" || !/^[\d\-\s]+$/.test(phone) || phone.replace(/\D/g, "").length < 10) {
        return NextResponse.json(
          { error: "電話番号の形式が正しくありません" },
          { status: 400 }
        );
      }
    }
    if (birthdate) {
      const dt = new Date(birthdate);
      if (isNaN(dt.getTime()) || dt > new Date()) {
        return NextResponse.json(
          { error: "正しい生年月日を入力してください" },
          { status: 400 }
        );
      }
      const today = new Date();
      let age = today.getFullYear() - dt.getFullYear();
      const m = today.getMonth() - dt.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dt.getDate())) age--;
      if (age < 20) {
        return NextResponse.json(
          { error: "20歳未満の方はご利用いただけません" },
          { status: 400 }
        );
      }
    }

    const profile = await updateUserProfile(session.userId, { name, phone, birthdate });
    if (!profile) {
      return NextResponse.json({ error: "Update failed" }, { status: 500 });
    }
    return NextResponse.json({ success: true, user: profile });
  } catch {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
