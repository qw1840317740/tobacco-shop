import { NextRequest, NextResponse } from "next/server";
import { verifyUserSession } from "@/lib/user-auth";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  const session = verifyUserSession(request.headers.get("cookie"));
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const rows = await db.address.findMany({
    where: { userId: session.userId },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });
  return NextResponse.json({
    success: true,
    addresses: rows.map((r) => ({
      ...r,
      createdAt: r.createdAt.toISOString(),
    })),
  });
}

export async function POST(request: NextRequest) {
  const session = verifyUserSession(request.headers.get("cookie"));
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const { label, name, phone, postalCode, address1, address2, city, prefecture, isDefault } = body;

    if (!name || !postalCode || !address1) {
      return NextResponse.json({ error: "必須項目を入力してください" }, { status: 400 });
    }

    // If this is set as default, clear other defaults
    if (isDefault) {
      await db.address.updateMany({
        where: { userId: session.userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    const row = await db.address.create({
      data: {
        userId: session.userId,
        label: label || "home",
        name,
        phone: phone || "",
        postalCode,
        address1,
        address2: address2 || "",
        city: city || "",
        prefecture: prefecture || "",
        isDefault: isDefault || false,
      },
    });
    return NextResponse.json({
      success: true,
      address: { ...row, createdAt: row.createdAt.toISOString() },
    });
  } catch {
    return NextResponse.json({ error: "作成に失敗しました" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const session = verifyUserSession(request.headers.get("cookie"));
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const { id, label, name, phone, postalCode, address1, address2, city, prefecture, isDefault } = body;

    if (!id) {
      return NextResponse.json({ error: "IDが必要です" }, { status: 400 });
    }

    // Verify ownership
    const existing = await db.address.findUnique({ where: { id } });
    if (!existing || existing.userId !== session.userId) {
      return NextResponse.json({ error: "権限がありません" }, { status: 403 });
    }

    // If setting as default, clear other defaults
    if (isDefault) {
      await db.address.updateMany({
        where: { userId: session.userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    const row = await db.address.update({
      where: { id },
      data: {
        label: label ?? existing.label,
        name: name ?? existing.name,
        phone: phone ?? existing.phone,
        postalCode: postalCode ?? existing.postalCode,
        address1: address1 ?? existing.address1,
        address2: address2 ?? existing.address2,
        city: city ?? existing.city,
        prefecture: prefecture ?? existing.prefecture,
        isDefault: isDefault ?? existing.isDefault,
      },
    });
    return NextResponse.json({
      success: true,
      address: { ...row, createdAt: row.createdAt.toISOString() },
    });
  } catch {
    return NextResponse.json({ error: "更新に失敗しました" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = verifyUserSession(request.headers.get("cookie"));
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "IDが必要です" }, { status: 400 });
    }

    const existing = await db.address.findUnique({ where: { id } });
    if (!existing || existing.userId !== session.userId) {
      return NextResponse.json({ error: "権限がありません" }, { status: 403 });
    }

    await db.address.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "削除に失敗しました" }, { status: 500 });
  }
}
