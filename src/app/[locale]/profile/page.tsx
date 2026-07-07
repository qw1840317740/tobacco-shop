"use client";

import { useState, useEffect, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { useTranslations } from "next-intl";
import { MapPin, Package, Heart, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface ProfileErrors {
  name?: string;
  phone?: string;
  birthdate?: string;
}

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const t = useTranslations("profile");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ProfileErrors>({});

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdError, setPwdError] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setPhone("");
      setBirthdate("");
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

  // Live validation — re-validate on field change so the hint clears as the user fixes it
  useEffect(() => {
    if (Object.keys(errors).length === 0) return;
    const next: ProfileErrors = { ...errors };
    if (name.trim().length >= 2) delete next.name;
    if (/^[\d\-\s]+$/.test(phone) && phone.replace(/\D/g, "").length >= 10) delete next.phone;
    if (birthdate && isBirthdateValid(birthdate)) delete next.birthdate;
    if (JSON.stringify(next) !== JSON.stringify(errors)) setErrors(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, phone, birthdate]);

  function isBirthdateValid(d: string): boolean {
    if (!d) return false;
    const dt = new Date(d);
    if (isNaN(dt.getTime())) return false;
    if (dt > new Date()) return false;
    const today = new Date();
    let age = today.getFullYear() - dt.getFullYear();
    const m = today.getMonth() - dt.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dt.getDate())) age--;
    return age >= 20;
  }

  function validate(): ProfileErrors {
    const next: ProfileErrors = {};
    if (name.trim().length < 2) next.name = t("nameRequired");
    if (!/^[\d\-\s]+$/.test(phone) || phone.replace(/\D/g, "").length < 10) {
      next.phone = t("phoneFormat");
    }
    if (!birthdate) {
      next.birthdate = t("birthdateRequired");
    } else if (!isBirthdateValid(birthdate)) {
      const dt = new Date(birthdate);
      next.birthdate = dt > new Date() ? t("birthdateFuture") : t("birthdateTooYoung");
    }
    return next;
  }

  const handleSave = async () => {
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) {
      toast.error(next.name || next.phone || next.birthdate || t("saveFailed"));
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, birthdate: birthdate || null }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(t("saved"));
        const authRes = await fetch("/api/user-auth");
        const authData = await authRes.json();
        if (authData.authenticated && authData.user) setUser(authData.user);
      } else {
        toast.error(data.error || t("saveFailed"));
      }
    } catch {
      toast.error(t("saveFailed"));
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    setPwdError("");
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setPwdError(t("fillAllFields"));
      return;
    }
    if (newPassword.length < 6) {
      setPwdError(t("passwordTooShort"));
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setPwdError(t("passwordMismatch"));
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
        toast.success(t("passwordChanged"));
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      } else {
        setPwdError(data.error || t("passwordChangeFailed"));
      }
    } catch {
      setPwdError(t("passwordChangeFailed"));
    } finally {
      setPwdLoading(false);
    }
  };

  if (!user) return null;

  const ageDocStatusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
    none: { label: t("ageDocStatusNone"), variant: "outline" },
    pending: { label: t("ageDocStatusPending"), variant: "secondary" },
    approved: { label: t("ageDocStatusApproved"), variant: "default" },
    rejected: { label: t("ageDocStatusRejected"), variant: "destructive" },
  };
  const ageDocInfo = ageDocStatusMap[user.ageDocStatus] || ageDocStatusMap.none;

  // Live-format phone hint preview — strip non-digits and show group of digits
  const phonePreview = useMemo(() => {
    const digits = phone.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 3) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  }, [phone]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-bold text-[#1A1A1A]">{t("title")}</h1>

      {/* Account Info */}
      <Card className="mt-8 p-6">
        <h2 className="text-lg font-semibold">{t("accountInfo")}</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="profile-name">{t("name")}</Label>
            <Input
              id="profile-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("nameHint")}
              maxLength={60}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "profile-name-err" : "profile-name-hint"}
              className={`mt-1 ${errors.name ? "border-red-500" : ""}`}
            />
            {errors.name ? (
              <p id="profile-name-err" className="mt-1 flex items-center gap-1 text-xs text-red-600">
                <AlertCircle className="h-3 w-3" /> {errors.name}
              </p>
            ) : (
              <p id="profile-name-hint" className="mt-1 text-xs text-[#888]">{t("nameHint")}</p>
            )}
          </div>
          <div>
            <Label>{t("email")}</Label>
            <Input type="email" value={email} disabled className="mt-1 bg-[#F5F5F5]" />
            <p className="mt-1 text-xs text-[#888]">{t("emailHint")}</p>
          </div>
          <div>
            <Label htmlFor="profile-phone">{t("phone")}</Label>
            <Input
              id="profile-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="090-1234-5678"
              inputMode="numeric"
              maxLength={20}
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? "profile-phone-err" : "profile-phone-hint"}
              className={`mt-1 ${errors.phone ? "border-red-500" : ""}`}
            />
            {errors.phone ? (
              <p id="profile-phone-err" className="mt-1 flex items-center gap-1 text-xs text-red-600">
                <AlertCircle className="h-3 w-3" /> {errors.phone}
              </p>
            ) : (
              <p id="profile-phone-hint" className="mt-1 text-xs text-[#888]">
                {t("phoneHint")}{phone && phone !== phonePreview && (
                  <span className="ml-2 text-[#C8A97E]">→ {phonePreview}</span>
                )}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="profile-bd">{t("birthdate")}</Label>
            <Input
              id="profile-bd"
              type="date"
              value={birthdate}
              max={new Date().toISOString().split("T")[0]}
              onChange={(e) => setBirthdate(e.target.value)}
              aria-invalid={!!errors.birthdate}
              aria-describedby={errors.birthdate ? "profile-bd-err" : "profile-bd-hint"}
              className={`mt-1 ${errors.birthdate ? "border-red-500" : ""}`}
            />
            {errors.birthdate ? (
              <p id="profile-bd-err" className="mt-1 flex items-center gap-1 text-xs text-red-600">
                <AlertCircle className="h-3 w-3" /> {errors.birthdate}
              </p>
            ) : (
              <p id="profile-bd-hint" className="mt-1 text-xs text-[#888]">{t("birthdateHint")}</p>
            )}
          </div>
        </div>
        <Button
          className="mt-6 bg-[#1A1A1A] text-white hover:bg-[#333]"
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? t("saving") : t("save")}
        </Button>
      </Card>

      {/* Age Verification Status */}
      <Card className="mt-6 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">{t("ageVerify")}</h2>
          <Badge variant={ageDocInfo.variant}>{ageDocInfo.label}</Badge>
        </div>
        {user.ageDocStatus === "rejected" && (
          <p className="mt-2 text-sm text-red-600">{t("ageRejectedReason")}</p>
        )}
        <p className="mt-2 text-sm text-[#888]">
          {user.ageVerified ? t("ageVerified") : t("ageVerifyNeeded")}
        </p>
        <Link href="/profile/age-verification">
          <Button variant="outline" className="mt-3" size="sm">
            {user.ageDocStatus === "none" ? t("uploadAgeDoc") : t("reviewAgeDoc")}
          </Button>
        </Link>
      </Card>

      {/* Password Change */}
      <Card className="mt-6 p-6">
        <h2 className="text-lg font-semibold">{t("passwordChange")}</h2>
        <div className="mt-4 grid gap-4 max-w-md">
          <div>
            <Label>{t("currentPassword")}</Label>
            <Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label>{t("newPassword")}</Label>
            <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label>{t("newPasswordConfirm")}</Label>
            <Input type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} className="mt-1" />
          </div>
          {pwdError && (
            <p className="flex items-center gap-1 text-xs text-red-600">
              <AlertCircle className="h-3 w-3" /> {pwdError}
            </p>
          )}
        </div>
        <Button className="mt-4" variant="outline" onClick={handlePasswordChange} disabled={pwdLoading}>
          {pwdLoading ? t("changingPassword") : t("changePassword")}
        </Button>
      </Card>

      {/* Quick Links */}
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <Link href="/profile/addresses">
          <Card className="p-4 hover:bg-[#F5F5F5] transition-colors cursor-pointer">
            <p className="flex items-center gap-2 font-medium text-[#333]"><MapPin className="h-6 w-6 text-[#C8A97E]" strokeWidth={1.5} /> {t("addressTitle") || "住所管理"}</p>
            <p className="text-sm text-[#888] mt-1">{t("addressDesc") || "配送先住所の管理"}</p>
          </Card>
        </Link>
        <Link href="/orders">
          <Card className="p-4 hover:bg-[#F5F5F5] transition-colors cursor-pointer">
            <p className="flex items-center gap-2 font-medium text-[#333]"><Package className="h-6 w-6 text-[#C8A97E]" strokeWidth={1.5} /> {t("ordersTitle") || "注文履歴"}</p>
            <p className="text-sm text-[#888] mt-1">{t("ordersDesc") || "過去の注文を確認"}</p>
          </Card>
        </Link>
        <Link href="/wishlist">
          <Card className="p-4 hover:bg-[#F5F5F5] transition-colors cursor-pointer">
            <p className="flex items-center gap-2 font-medium text-[#333]"><Heart className="h-6 w-6 text-[#C8A97E]" strokeWidth={1.5} /> {t("wishlistTitle") || "お気に入り"}</p>
            <p className="text-sm text-[#888] mt-1">{t("wishlistDesc") || "保存した商品"}</p>
          </Card>
        </Link>
      </div>
    </div>
  );
}
