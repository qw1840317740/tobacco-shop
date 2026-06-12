"use client";

import { useCartStore } from "@/stores/cart-store";
import { useAuthStore } from "@/stores/auth-store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Link } from "@/i18n/navigation";
import { useState, useEffect } from "react";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

const BANK_INFO = {
  bank: "三菱UFJ銀行",
  branch: "丸の内支店",
  type: "普通",
  number: "1234567",
  name: "タバコショップ　カ",
};

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCartStore();
  const user = useAuthStore((s) => s.user);
  const [step, setStep] = useState<"shipping" | "payment" | "confirm" | "done">("shipping");
  const [orderId, setOrderId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [shippingName, setShippingName] = useState("");
  const [shippingPhone, setShippingPhone] = useState("");
  const [shippingPostalCode, setShippingPostalCode] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [identityConfirmed, setIdentityConfirmed] = useState(false);
  const tCompliance = useTranslations("compliance");
  const tCheckout = useTranslations("checkout");

  const subtotal = totalPrice();
  const shipping = 600;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  // Load user's default address on mount
  useEffect(() => {
    if (user) {
      fetch("/api/users/addresses")
        .then((r) => r.json())
        .then((data) => {
          if (data.success && data.addresses?.length > 0) {
            const defaultAddr = data.addresses.find((a: any) => a.isDefault) || data.addresses[0];
            setShippingName(defaultAddr.name || "");
            setShippingPhone(defaultAddr.phone || "");
            setShippingPostalCode(defaultAddr.postalCode || "");
            setShippingAddress(
              `${defaultAddr.prefecture || ""}${defaultAddr.city || ""}${defaultAddr.address1 || ""}${defaultAddr.address2 ? " " + defaultAddr.address2 : ""}`
            );
          }
        })
        .catch(() => {});
    }
  }, [user]);

  // Check login and age verification
  if (!user && step !== "done") {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="font-heading text-2xl font-bold text-stone-800">{tCheckout("loginRequired")}</h1>
        <p className="mt-2 text-stone-500">{tCheckout("loginRequiredDesc")}</p>
        <Link href="/login">
          <Button className="mt-4 bg-primary text-white hover:bg-primary/90">{tCheckout("goToLogin")}</Button>
        </Link>
      </div>
    );
  }

  if (user && !user.ageVerified && step !== "done") {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="font-heading text-2xl font-bold text-stone-800">{tCheckout("ageVerificationRequired")}</h1>
        <p className="mt-2 text-stone-500">{tCheckout("ageVerificationRequiredDesc")}</p>
        <Link href="/profile/age-verification">
          <Button className="mt-4 bg-primary text-white hover:bg-primary/90">{tCheckout("submitAgeDoc")}</Button>
        </Link>
      </div>
    );
  }

  if (items.length === 0 && step !== "done") {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="font-heading text-2xl font-bold text-stone-800">{tCheckout("cartEmpty")}</h1>
      </div>
    );
  }

  const handleConfirm = async () => {
    if (!shippingName || !shippingAddress) {
      toast.error(tCheckout("fillShippingInfo"));
      setStep("shipping");
      return;
    }
    setSubmitting(true);
    try {
      const orderItems = items.map((item) => ({
        productId: item.productId,
        name: item.name,
        slug: item.slug,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      }));
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: orderItems,
          subtotal,
          shippingFee: shipping,
          tax,
          total,
          shippingName,
          shippingPhone,
          shippingPostalCode,
          shippingAddress,
          paymentMethod: "bank_transfer",
        }),
      });
      const data = await res.json();
      if (data.success && data.order) {
        setOrderId(data.order.id);
        clearCart();
        setStep("done");
      } else {
        toast.error(data.error || tCheckout("orderCreateFailed"));
      }
    } catch {
      toast.error(tCheckout("networkError"));
    } finally {
      setSubmitting(false);
    }
  };

  const BankInfoCard = () => (
    <div className="rounded-xl bg-gradient-to-br from-stone-50 to-stone-100/80 border border-stone-200/60 p-5 space-y-3">
      <div className="flex items-center gap-2 mb-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
          <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21" />
          </svg>
        </div>
        <h3 className="text-sm font-bold text-stone-700">{tCheckout("bankAccountInfo")}</h3>
      </div>
      <div className="grid grid-cols-2 gap-y-2 text-sm">
        <span className="text-stone-500">{tCheckout("bankName")}</span>
        <span className="font-medium text-stone-800">{BANK_INFO.bank}</span>
        <span className="text-stone-500">{tCheckout("branchName")}</span>
        <span className="font-medium text-stone-800">{BANK_INFO.branch}</span>
        <span className="text-stone-500">{tCheckout("accountType")}</span>
        <span className="font-medium text-stone-800">{BANK_INFO.type}</span>
        <span className="text-stone-500">{tCheckout("accountNumber")}</span>
        <span className="font-medium text-stone-800">{BANK_INFO.number}</span>
        <span className="text-stone-500">{tCheckout("accountHolder")}</span>
        <span className="font-medium text-stone-800">{BANK_INFO.name}</span>
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <h1 className="font-heading text-3xl font-bold text-stone-800">{tCheckout("proceedToCheckout")}</h1>

      {/* Step indicator */}
      <div className="mt-6 flex items-center gap-2">
        {(["shipping", "payment", "confirm"] as const).map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-colors ${
              step === s || (step === "done" && i === 2) ? "bg-primary text-white" : "bg-stone-200 text-stone-500"
            }`}>{i + 1}</div>
            <span className={`hidden text-sm sm:inline ${
              step === s || (step === "done" && i === 2) ? "font-medium text-primary" : "text-stone-400"
            }`}>
              {s === "shipping" ? tCheckout("stepShipping") : s === "payment" ? tCheckout("stepPayment") : tCheckout("stepConfirm")}
            </span>
            {i < 2 && <div className="mx-2 h-px w-4 bg-stone-200 sm:w-8" />}
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">

          {/* Step 1: Shipping */}
          {step === "shipping" && (
            <Card className="p-6">
              <h2 className="font-heading text-lg font-semibold">{tCheckout("shippingInfo")}</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>{tCheckout("name")}</Label>
                  <Input value={shippingName} onChange={(e) => setShippingName(e.target.value)} placeholder={tCheckout("namePlaceholder")} className="mt-1" />
                </div>
                <div>
                  <Label>{tCheckout("phone")}</Label>
                  <Input value={shippingPhone} onChange={(e) => setShippingPhone(e.target.value)} placeholder={tCheckout("phonePlaceholder")} className="mt-1" />
                </div>
                <div>
                  <Label>{tCheckout("postalCode")}</Label>
                  <Input value={shippingPostalCode} onChange={(e) => setShippingPostalCode(e.target.value)} placeholder={tCheckout("postalCodePlaceholder")} className="mt-1" />
                </div>
                <div>
                  <Label>{tCheckout("email")}</Label>
                  <Input value={user?.email || ""} disabled className="mt-1 bg-stone-50" />
                </div>
                <div className="sm:col-span-2">
                  <Label>{tCheckout("address")}</Label>
                  <Input value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)} placeholder={tCheckout("addressPlaceholder")} className="mt-1" />
                </div>
              </div>
              <Button className="mt-6 w-full bg-primary text-white hover:bg-primary/90" onClick={() => {
                if (!shippingName.trim() || !shippingAddress.trim()) {
                  toast.error(tCheckout("fillNameAndAddress"));
                  return;
                }
                setStep("payment");
              }}>
                {tCheckout("proceedToPayment")}
              </Button>
            </Card>
          )}

          {/* Step 2: Payment → Bank transfer info */}
          {step === "payment" && (
            <Card className="p-6">
              <h2 className="font-heading text-lg font-semibold">{tCheckout("paymentMethod")}</h2>
              <div className="mt-4">
                <div className="flex items-center gap-2 rounded-lg bg-primary/5 border border-primary/10 px-4 py-3 text-sm">
                  <svg className="h-5 w-5 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-stone-700">{tCheckout("bankTransferNotice")}</span>
                </div>
              </div>
              <div className="mt-4 space-y-4">
                <p className="text-sm text-stone-500 leading-relaxed">
                  {tCheckout("bankTransferInstruction")}
                </p>
                <BankInfoCard />
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 leading-relaxed">
                  ⚠️ {tCheckout("transferDeadline")}
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <Button variant="outline" onClick={() => setStep("shipping")} className="flex-1">{tCheckout("back")}</Button>
                <Button className="flex-1 bg-primary text-white hover:bg-primary/90" onClick={() => setStep("confirm")}>{tCheckout("proceedToConfirm")}</Button>
              </div>
            </Card>
          )}

          {/* Step 3: Confirm */}
          {step === "confirm" && (
            <Card className="p-6">
              <h2 className="font-heading text-lg font-semibold">{tCheckout("orderSummary")}</h2>

              {/* Health warning */}
              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-800 leading-relaxed">
                ⚠️ {tCompliance("healthWarning")}
              </div>

              <div className="mt-4 space-y-2 text-sm">
                {items.map((item) => (
                  <div key={item.productId} className="flex justify-between">
                    <span>{item.name} x{item.quantity}</span>
                    <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 p-3 rounded-lg bg-stone-50 text-sm">
                <p className="text-stone-600">{tCheckout("shippingInfo")}: {shippingName} / {shippingAddress}</p>
              </div>

              {/* Address match warning */}
              <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-2.5 text-xs text-amber-800 leading-relaxed">
                📍 {tCompliance("addressMatch")}
              </div>

              <Separator className="my-4" />
              <div className="space-y-1 text-sm">
                <div className="flex justify-between"><span>{tCheckout("subtotal")}</span><span>{formatPrice(subtotal)}</span></div>
                <div className="flex justify-between">
                  <span>{tCheckout("shippingFee")}</span>
                  <span>{formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between"><span>{tCheckout("tax")}</span><span>{formatPrice(tax)}</span></div>
                <Separator />
                <div className="flex justify-between text-base font-bold"><span>{tCheckout("total")}</span><span className="text-primary">{formatPrice(total)}</span></div>
              </div>

              {/* Shipping note */}
              <div className="mt-3 rounded-lg border border-stone-200 bg-stone-50 p-2.5 text-xs text-stone-500 leading-relaxed">
                📦 {tCompliance("shippingNote")}
              </div>

              <div className="mt-4 rounded-lg border border-stone-200 bg-stone-50 p-3 text-xs text-stone-500">
                {tCheckout("payment")}：<strong className="text-stone-700">{tCheckout("bankTransfer")}</strong>
              </div>

              {/* Identity confirmation checkbox */}
              <label className="mt-4 flex items-start gap-3 rounded-lg border border-primary/20 bg-primary/5 p-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={identityConfirmed}
                  onChange={(e) => setIdentityConfirmed(e.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-stone-300"
                />
                <span className="text-xs leading-relaxed text-stone-700">{tCompliance("identityConfirm")}</span>
              </label>

              <div className="mt-6 flex gap-3">
                <Button variant="outline" onClick={() => setStep("payment")} className="flex-1">←</Button>
                <Button className="flex-1 bg-primary text-white hover:bg-primary/90" onClick={handleConfirm} disabled={submitting || !identityConfirmed}>
                  {submitting ? "..." : tCheckout("placeOrder")}
                </Button>
              </div>
            </Card>
          )}

          {/* Done: Order complete */}
          {step === "done" && (
            <div className="space-y-6">
              <div className="text-center py-8">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <h2 className="mt-4 font-heading text-2xl font-bold text-stone-800">{tCheckout("orderAccepted")}</h2>
                <p className="mt-2 text-sm text-stone-500">{tCheckout("orderId")}<span className="font-mono font-bold text-stone-700">{orderId}</span></p>
              </div>

              <Card className="p-6">
                <h3 className="font-heading text-base font-semibold flex items-center gap-2">
                  <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {tCheckout("bankAccountInfo")}
                </h3>
                <div className="mt-4">
                  <BankInfoCard />
                </div>
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between rounded-lg bg-primary/5 px-4 py-2">
                    <span className="text-stone-600">{tCheckout("transferAmount")}</span>
                    <span className="text-lg font-bold text-primary">{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between text-stone-500">
                    <span>{tCheckout("transferDeadlineLabel")}</span>
                    <span className="font-medium text-stone-700">{tCheckout("within3BizDays")}</span>
                  </div>
                </div>
              </Card>

              <div className="rounded-lg border border-stone-200 bg-stone-50 p-4 text-xs text-stone-500 leading-relaxed">
                <p className="font-medium text-stone-600 mb-1">💡 {tCheckout("transferNotesTitle")}</p>
                <ul className="list-disc pl-4 space-by-1">
                  <li>{tCheckout("transferNote1")}</li>
                  <li>{tCheckout("transferNote2")}</li>
                  <li>{tCheckout("transferNote3")}</li>
                </ul>
              </div>

              <div className="flex gap-3">
                <Link
                  href="/orders"
                  className="inline-flex h-12 flex-1 items-center justify-center rounded-xl border border-stone-200 text-sm font-medium text-stone-600 transition-all hover:bg-stone-50"
                >
                  {tCheckout("viewOrders")}
                </Link>
                <Link
                  href="/"
                  className="inline-flex h-12 flex-1 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-white transition-all hover:bg-primary/90"
                >
                  {tCheckout("backToHome")}
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar: Order summary (hide on done page) */}
        {step !== "done" && (
          <div className="lg:col-span-2">
            <Card className="sticky top-20 p-6">
              <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-primary">{tCheckout("orderContents")}</h3>
              <div className="mt-4 space-y-3">
                {items.map((item) => (
                  <div key={item.productId} className="flex gap-3">
                    <img src={item.image} alt={item.name} className="h-12 w-12 rounded object-cover" />
                    <div className="flex-1"><p className="text-sm font-medium line-clamp-1">{item.name}</p><p className="text-xs text-stone-400">x{item.quantity}</p></div>
                    <span className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
