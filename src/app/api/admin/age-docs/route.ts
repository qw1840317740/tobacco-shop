import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/admin-auth";
import { listAllAgeDocs, approveAgeDoc, rejectAgeDoc, getUserById } from "@/lib/user-store";

export async function GET(request: NextRequest) {
  const adminSession = verifySession(request.headers.get("cookie"));
  if (!adminSession) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const docs = await listAllAgeDocs();
    // Also include the doc URL for admin viewing
    const enriched = await Promise.all(
      docs.map(async (d) => {
        const user = await getUserById(d.id);
        return {
          ...d,
          ageDocUrl: user?.ageDocUrl || "",
          ageDocRejectReason: user?.ageDocRejectReason || "",
        };
      })
    );
    return NextResponse.json({ success: true, docs: enriched });
  } catch {
    return NextResponse.json({ error: "取得に失敗しました" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const adminSession = verifySession(request.headers.get("cookie"));
  if (!adminSession) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { userId, action, reason } = body;

    if (!userId || !action) {
      return NextResponse.json({ error: "パラメータが不足しています" }, { status: 400 });
    }

    if (action === "approve") {
      const ok = await approveAgeDoc(userId, adminSession.adminId);
      if (!ok) {
        return NextResponse.json({ error: "承認に失敗しました" }, { status: 500 });
      }
      return NextResponse.json({ success: true });
    } else if (action === "reject") {
      const ok = await rejectAgeDoc(userId, adminSession.adminId, reason || "");
      if (!ok) {
        return NextResponse.json({ error: "却下に失敗しました" }, { status: 500 });
      }
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: "無効なアクション" }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: "操作に失敗しました" }, { status: 500 });
  }
}
