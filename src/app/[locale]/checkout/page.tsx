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
import { useParams } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";

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
  const params = useParams();
  const locale = (params?.locale as string) || "ja";

  const subtotal = totalPrice();
  const shipping = subtotal > 5000 ? 0 : 600;
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
        <h1 className="font-heading text-2xl font-bold text-stone-800">ログインが必要です</h1>
        <p className="mt-2 text-stone-500">お買い物にはログインが必要です。</p>
        <Link href="/login">
          <Button className="mt-4 bg-primary text-white hover:bg-primary/90">ログインページへ</Button>
        </Link>
      </div>
    );
  }

  if (user && !user.ageVerified && step !== "done") {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="font-heading text-2xl font-bold text-stone-800">年齢確認が必要です</h1>
        <p className="mt-2 text-stone-500">お買い物には年齢確認書類の提出が必要です。</p>
        <Link href="/profile/age-verification">
          <Button className="mt-4 bg-primary text-white hover:bg-primary/90">年齢確認書類を提出</Button>
        </Link>
      </div>
    );
  }

  if (items.length === 0 && step !== "done") {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="font-heading text-2xl font-bold text-stone-800">カートは空です</h1>
      </div>
    );
  }

  const handleConfirm = async () => {
    if (!shippingName || !shippingAddress) {
      toast.error("配送先情報を入力してください");
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
        toast.error(data.error || "注文の作成に失敗しました");
      }
    } catch {
      toast.error("通信エラーが発生しました");
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
        <h3 className="text-sm font-bold text-stone-700">振込先口座情報</h3>
      </div>
      <div className="grid grid-cols-2 gap-y-2 text-sm">
        <span className="text-stone-500">金融機関</span>
        <span className="font-medium text-stone-800">{BANK_INFO.bank}</span>
        <span className="text-stone-500">支店名</span>
        <span className="font-medium text-stone-800">{BANK_INFO.branch}</span>
        <span className="text-stone-500">口座種別</span>
        <span className="font-medium text-stone-800">{BANK_INFO.type}</span>
        <span className="text-stone-500">口座番号</span>
        <span className="font-medium text-stone-800">{BANK_INFO.number}</span>
        <span className="text-stone-500">名義人（カナ）</span>
        <span className="font-medium text-stone-800">{BANK_INFO.name}</span>
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <h1 className="font-heading text-3xl font-bold text-stone-800">レジに進む</h1>

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
              {s === "shipping" ? "配送先" : s === "payment" ? "支払い" : "確認"}
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
              <h2 className="font-heading text-lg font-semibold">配送先情報</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>氏名</Label>
                  <Input value={shippingName} onChange={(e) => setShippingName(e.target.value)} placeholder="山田太郎" className="mt-1" />
                </div>
                <div>
                  <Label>電話番号</Label>
                  <Input value={shippingPhone} onChange={(e) => setShippingPhone(e.target.value)} placeholder="090-1234-5678" className="mt-1" />
                </div>
                <div>
                  <Label>郵便番号</Label>
                  <Input value={shippingPostalCode} onChange={(e) => setShippingPostalCode(e.target.value)} placeholder="100-0001" className="mt-1" />
                </div>
                <div>
                  <Label>メール</Label>
                  <Input value={user?.email || ""} disabled className="mt-1 bg-stone-50" />
                </div>
                <div className="sm:col-span-2">
                  <Label>住所</Label>
                  <Input value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)} placeholder="東京都千代田区..." className="mt-1" />
                </div>
              </div>
              <Button className="mt-6 w-full bg-primary text-white hover:bg-primary/90" onClick={() => {
                if (!shippingName.trim() || !shippingAddress.trim()) {
                  toast.error("氏名と住所を入力してください");
                  return;
                }
                setStep("payment");
              }}>
                支払い方法の確認へ進む
              </Button>
            </Card>
          )}

          {/* Step 2: Payment → Bank transfer info */}
          {step === "payment" && (
            <Card className="p-6">
              <h2 className="font-heading text-lg font-semibold">お支払い方法</h2>
              <div className="mt-4">
                <div className="flex items-center gap-2 rounded-lg bg-primary/5 border border-primary/10 px-4 py-3 text-sm">
                  <svg className="h-5 w-5 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-stone-700">お支払いは<strong className="text-primary">銀行振込</strong>にてお願いいたします</span>
                </div>
              </div>
              <div className="mt-4 space-y-4">
                <p className="text-sm text-stone-500 leading-relaxed">
                  ご注文確定後、以下の口座へお振込みください。
                  お振込みの確認ができ次第、商品を発送いたします。
                </p>
                <BankInfoCard />
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 leading-relaxed">
                  ⚠️ ご注文確定後、<strong>3営業日以内</strong>に上記口座へお振込みください。
                  期限を過ぎますと注文は自動キャンセルとなります。
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <Button variant="outline" onClick={() => setStep("shipping")} className="flex-1">戻る</Button>
                <Button className="flex-1 bg-primary text-white hover:bg-primary/90" onClick={() => setStep("confirm")}>注文確認へ</Button>
              </div>
            </Card>
          )}

          {/* Step 3: Confirm */}
          {step === "confirm" && (
            <Card className="p-6">
              <h2 className="font-heading text-lg font-semibold">注文確認</h2>
              <div className="mt-4 space-y-2 text-sm">
                {items.map((item) => (
                  <div key={item.productId} className="flex justify-between">
                    <span>{item.name} x{item.quantity}</span>
                    <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 p-3 rounded-lg bg-stone-50 text-sm">
                <p className="text-stone-600">配送先: {shippingName} / {shippingAddress}</p>
              </div>
              <Separator className="my-4" />
              <div className="space-y-1 text-sm">
                <div className="flex justify-between"><span>小計</span><span>{formatPrice(subtotal)}</span></div>
                <div className="flex justify-between"><span>送料</span><span>{shipping === 0 ? "無料" : formatPrice(shipping)}</span></div>
                <div className="flex justify-between"><span>税（10%）</span><span>{formatPrice(tax)}</span></div>
                <Separator />
                <div className="flex justify-between text-base font-bold"><span>合計</span><span className="text-primary">{formatPrice(total)}</span></div>
              </div>
              <div className="mt-4 rounded-lg border border-stone-200 bg-stone-50 p-3 text-xs text-stone-500">
                支払い方法：<strong className="text-stone-700">銀行振込</strong>（ご注文確定後、3営業日以内にお振込みください）
              </div>
              <div className="mt-6 flex gap-3">
                <Button variant="outline" onClick={() => setStep("payment")} className="flex-1">戻る</Button>
                <Button className="flex-1 bg-primary text-white hover:bg-primary/90" onClick={handleConfirm} disabled={submitting}>
                  {submitting ? "処理中..." : "注文を確定する"}
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
                <h2 className="mt-4 font-heading text-2xl font-bold text-stone-800">ご注文を受け付けました</h2>
                <p className="mt-2 text-sm text-stone-500">注文番号：<span className="font-mono font-bold text-stone-700">{orderId}</span></p>
              </div>

              <Card className="p-6">
                <h3 className="font-heading text-base font-semibold flex items-center gap-2">
                  <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  振込先口座情報
                </h3>
                <div className="mt-4">
                  <BankInfoCard />
                </div>
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between rounded-lg bg-primary/5 px-4 py-2">
                    <span className="text-stone-600">お振込金額</span>
                    <span className="text-lg font-bold text-primary">{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between text-stone-500">
                    <span>振込期限</span>
                    <span className="font-medium text-stone-700">3営業日以内</span>
                  </div>
                </div>
              </Card>

              <div className="rounded-lg border border-stone-200 bg-stone-50 p-4 text-xs text-stone-500 leading-relaxed">
                <p className="font-medium text-stone-600 mb-1">💡 お振込み時のご注意</p>
                <ul className="list-disc pl-4 space-by-1">
                  <li>お振込人名はご注文時の氏名でお願いいたします</li>
                  <li>振込手数料はお客様負担となります</li>
                  <li>お振込みの確認後、確認メールをお送りいたします</li>
                </ul>
              </div>

              <div className="flex gap-3">
                <Link
                  href="/orders"
                  className="inline-flex h-12 flex-1 items-center justify-center rounded-xl border border-stone-200 text-sm font-medium text-stone-600 transition-all hover:bg-stone-50"
                >
                  注文履歴を見る
                </Link>
                <Link
                  href="/"
                  className="inline-flex h-12 flex-1 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-white transition-all hover:bg-primary/90"
                >
                  トップページに戻る
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar: Order summary (hide on done page) */}
        {step !== "done" && (
          <div className="lg:col-span-2">
            <Card className="sticky top-20 p-6">
              <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-primary">注文内容</h3>
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
