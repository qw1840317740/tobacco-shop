import { NextRequest, NextResponse } from "next/server";
import { verifyUserSession } from "@/lib/user-auth";
import { submitAgeDoc, getUserById } from "@/lib/user-store";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: NextRequest) {
  const session = verifyUserSession(request.headers.get("cookie"));
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const docType = formData.get("docType") as string;

    if (!file) {
      return NextResponse.json({ error: "ファイルを選択してください" }, { status: 400 });
    }
    if (!docType) {
      return NextResponse.json({ error: "書類の種類を選択してください" }, { status: 400 });
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "対応形式: JPEG, PNG, WebP" }, { status: 400 });
    }
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "ファイルサイズは10MB以下にしてください" }, { status: 400 });
    }

    // Store as base64 in DB — works on Vercel, and keeps files private
    const buffer = Buffer.from(await file.arrayBuffer());
    const docUrl = `data:${file.type};base64,${buffer.toString("base64")}`;

    const ok = await submitAgeDoc(session.userId, docUrl, docType);
    if (!ok) {
      return NextResponse.json({ error: "提出に失敗しました" }, { status: 500 });
    }

    return NextResponse.json({ success: true, docUrl: "submitted" });
  } catch (error) {
    console.error("Age doc upload error:", error);
    return NextResponse.json({ error: "アップロードに失敗しました" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const session = verifyUserSession(request.headers.get("cookie"));
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const user = await getUserById(session.userId);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  return NextResponse.json({
    success: true,
    ageDocStatus: user.ageDocStatus,
    ageDocType: user.ageDocType,
    ageDocUrl: user.ageDocUrl,
    ageDocRejectReason: user.ageDocRejectReason,
    ageVerified: user.ageVerified,
  });
}
