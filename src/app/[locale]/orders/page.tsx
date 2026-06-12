"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

interface OrderItem {
  productId: string;
  name: string;
  slug: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  id: string;
  status: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  tax: number;
  total: number;
  shippingName: string;
  shippingAddress: string;
  paymentMethod: string;
  createdAt: string;
}

const statusColorMap: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  paid: "bg-blue-100 text-blue-700",
  shipped: "bg-green-100 text-green-700",
  delivered: "bg-[#F5F5F5] text-[#888888]",
  cancelled: "bg-red-100 text-red-600",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const t = useTranslations("orders");
  const tCommon = useTranslations("common");

  useEffect(() => {
    fetch("/api/orders")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setOrders(data.orders);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <p className="text-[#888888]">{tCommon("loading")}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-bold text-[#1A1A1A]">{t("title")}</h1>

      {orders.length === 0 ? (
        <Card className="mt-8 p-8 text-center">
          <p className="text-[#888888]">{t("noOrders")}</p>
          <Link href="/products">
            <Button variant="outline" className="mt-3" size="sm">{t("viewProducts")}</Button>
          </Link>
        </Card>
      ) : (
        <div className="mt-8 space-y-4">
          {orders.map((order) => {
            const color = statusColorMap[order.status] || statusColorMap.pending;
            const statusLabel = order.status === "pending" ? t("pending")
              : order.status === "paid" ? t("paid")
              : order.status === "shipped" ? t("shipped")
              : order.status === "delivered" ? t("delivered")
              : order.status === "cancelled" ? t("cancelled")
              : t("pending");
            const date = new Date(order.createdAt).toLocaleDateString("ja-JP");
            return (
              <Card key={order.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-mono text-[#888888]">{order.id}</p>
                    <p className="text-xs text-[#888888]">{date}</p>
                    <p className="text-xs text-[#888888] mt-1">
                      {t("shippingTo")}: {order.shippingName} / {order.shippingAddress}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge className={`${color} border-0`}>{statusLabel}</Badge>
                    <p className="mt-1 text-lg font-bold text-[#C8A97E]">{formatPrice(order.total)}</p>
                  </div>
                </div>
                <div className="mt-3 border-t pt-3">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 py-1">
                      {item.image && (
                        <img src={item.image} alt={item.name} className="h-8 w-8 rounded object-cover" />
                      )}
                      <p className="text-sm text-[#888888]">
                        {item.name} × {item.quantity}
                      </p>
                      <p className="ml-auto text-sm text-[#888888]">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  ))}
                  <div className="mt-2 border-t pt-2 flex justify-between text-xs text-[#888888]">
                    <span>{t("breakdown", { subtotal: formatPrice(order.subtotal), shipping: formatPrice(order.shippingFee), tax: formatPrice(order.tax) })}</span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
