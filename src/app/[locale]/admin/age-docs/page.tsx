"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

interface AgeDocUser {
  id: string;
  name: string;
  email: string;
  ageDocStatus: string;
  ageDocType: string;
  ageDocUrl: string;
  ageDocRejectReason: string;
  createdAt: string;
}

export default function AdminAgeDocsPage() {
  const [docs, setDocs] = useState<AgeDocUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState<AgeDocUser | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const fetchDocs = async () => {
    try {
      const res = await fetch("/api/admin/age-docs");
      const data = await res.json();
      if (data.success) {
        setDocs(data.docs);
      }
    } catch {
      toast.error("取得に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleAction = async (userId: string, action: "approve" | "reject") => {
    setActionLoading(true);
    try {
      const res = await fetch("/api/admin/age-docs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, action, reason: action === "reject" ? rejectReason : "" }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(action === "approve" ? "承認しました" : "却下しました");
        setSelectedDoc(null);
        setRejectReason("");
        fetchDocs();
      } else {
        toast.error(data.error || "操作に失敗しました");
      }
    } catch {
      toast.error("通信エラーが発生しました");
    } finally {
      setActionLoading(false);
    }
  };

  const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
    pending: { label: "審査中", variant: "secondary" },
    approved: { label: "承認済み", variant: "default" },
    rejected: { label: "却下", variant: "destructive" },
  };

  const docTypeLabels: Record<string, string> = {
    drivers_license: "運転免許証",
    passport: "パスポート",
    my_number: "マイナンバーカード",
    residence_card: "在留カード",
  };

  if (loading) {
    return <div className="p-6 text-[#888888]">読み込み中...</div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">年齢確認書類</h1>
          <p className="text-sm text-[#888888] mt-1">提出された年齢確認書類の審査</p>
        </div>
        <Badge variant="secondary">{docs.filter((d) => d.ageDocStatus === "pending").length} 件 審査待ち</Badge>
      </div>

      {docs.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-[#888888]">提出された書類はありません</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {docs.map((doc) => {
            const statusInfo = statusMap[doc.ageDocStatus] || statusMap.pending;
            return (
              <Card key={doc.id} className="p-5">
                <div className="flex items-start gap-4">
                  {/* Document thumbnail */}
                  {doc.ageDocUrl && (
                    <div
                      className="w-20 h-20 rounded-lg border border-[#E5E5E5] overflow-hidden shrink-0 cursor-pointer hover:ring-2 hover:ring-[#C8A97E]"
                      onClick={() => setSelectedDoc(doc)}
                    >
                      <img
                        src={doc.ageDocUrl}
                        alt="書類"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-[#1A1A1A]">{doc.name}</p>
                      <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                    </div>
                    <p className="text-sm text-[#888888]">{doc.email}</p>
                    <p className="text-sm text-[#888888] mt-1">
                      書類: {docTypeLabels[doc.ageDocType] || doc.ageDocType}
                    </p>
                    {doc.ageDocRejectReason && (
                      <p className="text-sm text-red-500 mt-1">却下理由: {doc.ageDocRejectReason}</p>
                    )}
                  </div>

                  <div className="flex gap-2 shrink-0">
                    {doc.ageDocStatus === "pending" && (
                      <>
                        <Button
                          size="sm"
                          className="bg-green-600 text-white hover:bg-green-700"
                          onClick={() => handleAction(doc.id, "approve")}
                          disabled={actionLoading}
                        >
                          承認
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => { setSelectedDoc(doc); setRejectReason(""); }}
                          disabled={actionLoading}
                        >
                          却下
                        </Button>
                      </>
                    )}
                    <Button size="sm" variant="outline" onClick={() => setSelectedDoc(doc)}>
                      詳細
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Detail / Reject Dialog */}
      <Dialog open={!!selectedDoc} onOpenChange={(open) => { if (!open) setSelectedDoc(null); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>書類詳細</DialogTitle>
          </DialogHeader>
          {selectedDoc && (
            <div>
              <div className="space-y-2 text-sm">
                <p><span className="text-[#888888]">氏名:</span> {selectedDoc.name}</p>
                <p><span className="text-[#888888]">メール:</span> {selectedDoc.email}</p>
                <p><span className="text-[#888888]">書類:</span> {docTypeLabels[selectedDoc.ageDocType] || selectedDoc.ageDocType}</p>
                <p><span className="text-[#888888]">ステータス:</span> {statusMap[selectedDoc.ageDocStatus]?.label}</p>
              </div>
              {selectedDoc.ageDocUrl && (
                <div className="mt-4">
                  <img
                    src={selectedDoc.ageDocUrl}
                    alt="提出書類"
                    className="w-full rounded-lg border border-[#E5E5E5]"
                  />
                </div>
              )}
              {selectedDoc.ageDocStatus === "pending" && (
                <div className="mt-4 space-y-3">
                  <div>
                    <label className="text-sm text-[#333]">却下理由（却下時必須）</label>
                    <textarea
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      className="mt-1 w-full rounded-md border border-[#E5E5E5] px-3 py-2 text-sm"
                      rows={3}
                      placeholder="却下する場合、理由を入力してください"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      className="bg-green-600 text-white hover:bg-green-700"
                      onClick={() => handleAction(selectedDoc.id, "approve")}
                      disabled={actionLoading}
                    >
                      承認する
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleAction(selectedDoc.id, "reject")}
                      disabled={actionLoading}
                    >
                      却下する
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
