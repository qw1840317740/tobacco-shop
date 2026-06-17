"use client";

import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Link } from "@/i18n/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { Check, X, FileText } from "lucide-react";

export default function AgeVerificationPage() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const [docType, setDocType] = useState("drivers_license");
  const [docStatus, setDocStatus] = useState(user?.ageDocStatus || "none");
  const [rejectReason, setRejectReason] = useState("");
  const [docUrl, setDocUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Fetch full status
    fetch("/api/users/age-doc")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setDocStatus(data.ageDocStatus);
          setRejectReason(data.ageDocRejectReason || "");
          setDocUrl(data.ageDocUrl || "");
        }
      })
      .catch(() => {});
  }, []);

  const handleUpload = async (file: File) => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error("ファイルサイズは10MB以下にしてください");
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("docType", docType);
      const res = await fetch("/api/users/age-doc", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        toast.success("書類を提出しました。審査にお時間いただきます。");
        setDocStatus("pending");
        setDocUrl(data.docUrl);
        // Refresh user in store
        const authRes = await fetch("/api/user-auth");
        const authData = await authRes.json();
        if (authData.authenticated && authData.user) {
          setUser(authData.user);
        }
      } else {
        toast.error(data.error || "アップロードに失敗しました");
      }
    } catch {
      toast.error("通信エラーが発生しました");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleUpload(file);
  };

  const docTypeOptions = [
    { value: "my_number", label: "個人番号カード（マイナンバーカード）" },
    { value: "drivers_license", label: "運転免許証" },
    { value: "passport", label: "パスポート" },
    { value: "residence_card", label: "在留カード" },
    { value: "special_permanent", label: "特別永住者証明書" },
    { value: "pension_book", label: "国民年金手帳" },
    { value: "disability_book", label: "身体障害者手帳・各種福祉手帳" },
    { value: "family_register", label: "戸籍謄本／抄本" },
    { value: "resident_register", label: "住民票の写し" },
  ];

  const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; color: string }> = {
    none: { label: "未提出", variant: "outline", color: "text-[#888888]" },
    pending: { label: "審査中", variant: "secondary", color: "text-amber-600" },
    approved: { label: "承認済み", variant: "default", color: "text-green-600" },
    rejected: { label: "却下", variant: "destructive", color: "text-red-600" },
  };
  const statusInfo = statusMap[docStatus] || statusMap.none;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <Link href="/profile" className="text-sm text-[#888888] hover:text-[#C8A97E]">← プロフィールに戻る</Link>
      <h1 className="text-3xl font-bold text-[#1A1A1A] mt-2">年齢確認書類のアップロード</h1>
      <p className="mt-2 text-sm text-[#888888]">
        煙草の販売には年齢確認が必要です。運転免許証、パスポート、またはマイナンバーカードの写真をアップロードしてください。
      </p>

      {/* Current Status */}
      <Card className="mt-6 p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-medium">現在のステータス</h2>
          <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
        </div>

        {docStatus === "approved" && (
          <p className="mt-3 flex items-center gap-1.5 text-sm text-green-600"><Check className="h-4 w-4 shrink-0" strokeWidth={1.5} /> 年齢確認が完了しています。お買い物が可能です。</p>
        )}
        {docStatus === "pending" && (
          <p className="mt-3 text-sm text-amber-600">
            ⏳ 書類を審査中です。通常1〜2営業日で完了します。
          </p>
        )}
        {docStatus === "rejected" && (
          <div className="mt-3">
            <p className="flex items-center gap-1.5 text-sm text-red-600"><X className="h-4 w-4 shrink-0" strokeWidth={1.5} /> 書類が却下されました。以下の理由を確認し、再提出してください。</p>
            {rejectReason && (
              <p className="mt-1 text-sm text-red-500 bg-red-50 rounded p-2">却下理由: {rejectReason}</p>
            )}
          </div>
        )}
      </Card>

      {/* Preview of submitted document */}
      {docUrl && (docStatus === "pending" || docStatus === "approved" || docStatus === "rejected") && (
        <Card className="mt-4 p-5">
          <h2 className="font-medium mb-3">提出済み書類</h2>
          <img
            src={docUrl}
            alt="提出した書類"
            className="max-w-xs rounded-lg border border-[#E5E5E5]"
          />
        </Card>
      )}

      {/* Upload form - only show if not approved and not pending */}
      {docStatus !== "approved" && docStatus !== "pending" && (
        <Card className="mt-6 p-5">
          <h2 className="font-medium mb-4">書類をアップロード</h2>

          {/* Document type */}
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-[#888888]">書類の種類</label>
            <select
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
              className="w-full rounded-md border border-[#E5E5E5] px-3 py-2 text-sm"
            >
              {docTypeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Drop zone */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragOver
                ? "border-[#C8A97E] bg-[#F5F5F5]"
                : "border-[#E5E5E5] hover:border-[#888888]"
            }`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
            style={{ cursor: "pointer" }}
          >
            <FileText className="mx-auto mb-2 h-10 w-10 text-[#C8A97E]" strokeWidth={1.5} />
            <p className="text-sm text-[#888888]">
              クリックしてファイルを選択、またはドラッグ＆ドロップ
            </p>
            <p className="text-xs text-[#888888] mt-1">JPG, PNG, PDF / 最大10MB</p>
            <input
              ref={fileRef}
              type="file"
              accept="image/*,.pdf"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleUpload(file);
              }}
            />
          </div>

          {uploading && (
            <p className="mt-3 text-sm text-[#888888]">アップロード中...</p>
          )}
        </Card>
      )}
    </div>
  );
}
