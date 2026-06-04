"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { Link } from "@/i18n/navigation";

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

const statusMap: Record<string, { label: string; color: string }> = {
  pending: { label: "未入金", color: "bg-amber-100 text-amber-700" },
  paid: { label: "入金確認済", color: "bg-blue-100 text-blue-700" },
  shipped: { label: "発送済", color: "bg-green-100 text-green-700" },
  delivered: { label: "配達完了", color: "bg-stone-100 text-stone-600" },
  cancelled: { label: "キャンセル", color: "bg-red-100 text-red-600" },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

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
        <p className="text-stone-500">読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <h1 className="font-heading text-3xl font-bold text-stone-800">注文履歴</h1>

      {orders.length === 0 ? (
        <Card className="mt-8 p-8 text-center">
          <p className="text-stone-500">注文履歴はありません</p>
          <Link href="/products">
            <Button variant="outline" className="mt-3" size="sm">商品一覧を見る</Button>
          </Link>
        </Card>
      ) : (
        <div className="mt-8 space-y-4">
          {orders.map((order) => {
            const status = statusMap[order.status] || statusMap.pending;
            const date = new Date(order.createdAt).toLocaleDateString("ja-JP");
            return (
              <Card key={order.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-mono text-stone-500">{order.id}</p>
                    <p className="text-xs text-stone-400">{date}</p>
                    <p className="text-xs text-stone-400 mt-1">
                      配送先: {order.shippingName} / {order.shippingAddress}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge className={`${status.color} border-0`}>{status.label}</Badge>
                    <p className="mt-1 text-lg font-bold text-primary">{formatPrice(order.total)}</p>
                  </div>
                </div>
                <div className="mt-3 border-t pt-3">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 py-1">
                      {item.image && (
                        <img src={item.image} alt={item.name} className="h-8 w-8 rounded object-cover" />
                      )}
                      <p className="text-sm text-stone-600">
                        {item.name} × {item.quantity}
                      </p>
                      <p className="ml-auto text-sm text-stone-500">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  ))}
                  <div className="mt-2 border-t pt-2 flex justify-between text-xs text-stone-400">
                    <span>小計 {formatPrice(order.subtotal)} + 送料 {formatPrice(order.shippingFee)} + 税 {formatPrice(order.tax)}</span>
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
