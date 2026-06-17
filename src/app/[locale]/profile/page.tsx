"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Link } from "@/i18n/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { MapPin, Package, Heart } from "lucide-react";

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [pwdLoading, setPwdLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setPhone("");
      setBirthdate("");
      // Fetch full profile
      fetch("/api/users")
        .then((r) => r.json())
        .then((data) => {
          if (data.success && data.user) {
            setName(data.user.name);
            setEmail(data.user.email);
            setPhone(data.user.phone || "");
            setBirthdate(data.user.birthdate ? data.user.birthdate.split("T")[0] : "");
          }
        })
        .catch(() => {});
    }
  }, [user]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, birthdate: birthdate || null }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("プロフィールを更新しました");
        // Refresh auth store
        const authRes = await fetch("/api/user-auth");
        const authData = await authRes.json();
        if (authData.authenticated && authData.user) {
          setUser(authData.user);
        }
      } else {
        toast.error(data.error || "更新に失敗しました");
      }
    } catch {
      toast.error("通信エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      toast.error("すべての項目を入力してください");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("パスワードは6文字以上必要です");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      toast.error("新しいパスワードが一致しません");
      return;
    }
    setPwdLoading(true);
    try {
      const res = await fetch("/api/users/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("パスワードを変更しました");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      } else {
        toast.error(data.error || "変更に失敗しました");
      }
    } catch {
      toast.error("通信エラーが発生しました");
    } finally {
      setPwdLoading(false);
    }
  };

  if (!user) return null;

  const ageDocStatusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
    none: { label: "未提出", variant: "outline" },
    pending: { label: "審査中", variant: "secondary" },
    approved: { label: "承認済み", variant: "default" },
    rejected: { label: "却下", variant: "destructive" },
  };
  const ageDocInfo = ageDocStatusMap[user.ageDocStatus] || ageDocStatusMap.none;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-bold text-[#1A1A1A]">プロフィール</h1>

      {/* Account Info */}
      <Card className="mt-8 p-6">
        <h2 className="text-lg font-semibold">アカウント情報</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <Label>氏名</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label>メール</Label>
            <Input type="email" value={email} disabled className="mt-1 bg-[#F5F5F5]" />
          </div>
          <div>
            <Label>電話番号</Label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="090-1234-5678" className="mt-1" />
          </div>
          <div>
            <Label>生年月日</Label>
            <Input type="date" value={birthdate} onChange={(e) => setBirthdate(e.target.value)} className="mt-1" />
          </div>
        </div>
        <Button className="mt-6 bg-[#1A1A1A] text-white hover:bg-[#333]" onClick={handleSave} disabled={loading}>
          {loading ? "保存中..." : "保存"}
        </Button>
      </Card>

      {/* Age Verification Status */}
      <Card className="mt-6 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">年齢確認</h2>
          <Badge variant={ageDocInfo.variant}>{ageDocInfo.label}</Badge>
        </div>
        {user.ageDocStatus === "rejected" && (
          <p className="mt-2 text-sm text-red-600">却下理由: 書類を再提出してください</p>
        )}
        <p className="mt-2 text-sm text-[#888888]">
          {user.ageVerified
            ? "年齢確認が完了しています。"
            : "お買い物には年齢確認が必要です。"}
        </p>
        <Link href="/profile/age-verification">
          <Button variant="outline" className="mt-3" size="sm">
            {user.ageDocStatus === "none" ? "書類をアップロード" : "確認・再提出"}
          </Button>
        </Link>
      </Card>

      {/* Password Change */}
      <Card className="mt-6 p-6">
        <h2 className="text-lg font-semibold">パスワード変更</h2>
        <div className="mt-4 grid gap-4 max-w-md">
          <div>
            <Label>現在のパスワード</Label>
            <Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label>新しいパスワード</Label>
            <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label>新しいパスワード確認</Label>
            <Input type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} className="mt-1" />
          </div>
        </div>
        <Button className="mt-4" variant="outline" onClick={handlePasswordChange} disabled={pwdLoading}>
          {pwdLoading ? "変更中..." : "パスワードを変更"}
        </Button>
      </Card>

      {/* Quick Links */}
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <Link href="/profile/addresses">
          <Card className="p-4 hover:bg-[#F5F5F5] transition-colors cursor-pointer">
            <p className="flex items-center gap-2 font-medium text-[#333]"><MapPin className="h-6 w-6 text-[#C8A97E]" strokeWidth={1.5} /> 住所管理</p>
            <p className="text-sm text-[#888888] mt-1">配送先住所の管理</p>
          </Card>
        </Link>
        <Link href="/orders">
          <Card className="p-4 hover:bg-[#F5F5F5] transition-colors cursor-pointer">
            <p className="flex items-center gap-2 font-medium text-[#333]"><Package className="h-6 w-6 text-[#C8A97E]" strokeWidth={1.5} /> 注文履歴</p>
            <p className="text-sm text-[#888888] mt-1">過去の注文を確認</p>
          </Card>
        </Link>
        <Link href="/wishlist">
          <Card className="p-4 hover:bg-[#F5F5F5] transition-colors cursor-pointer">
            <p className="flex items-center gap-2 font-medium text-[#333]"><Heart className="h-6 w-6 text-[#C8A97E]" strokeWidth={1.5} /> お気に入り</p>
            <p className="text-sm text-[#888888] mt-1">保存した商品</p>
          </Card>
        </Link>
      </div>
    </div>
  );
}
