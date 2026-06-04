import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "有効なメールアドレスを入力してください" }, { status: 400 });
    }

    const subscriber = await db.subscriber.upsert({
      where: { email },
      update: {},
      create: { email },
    });

    return NextResponse.json({ success: true, id: subscriber.id });
  } catch (error) {
    console.error("Subscribe error:", error);
    return NextResponse.json({ error: "登録に失敗しました" }, { status: 500 });
  }
}

export async function GET() {
  const subscribers = await db.subscriber.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(subscribers);
}
