"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { formatPrice } from "@/lib/utils";

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
  userId: string;
  status: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  tax: number;
  total: number;
  shippingName: string;
  shippingPhone: string;
  shippingPostalCode: string;
  shippingAddress: string;
  paymentMethod: string;
  notes: string;
  createdAt: string;
}

const statusOptions = [
  { value: "pending", label: "未入金", color: "bg-amber-100 text-amber-700" },
  { value: "paid", label: "入金確認済", color: "bg-blue-100 text-blue-700" },
  { value: "shipped", label: "発送済", color: "bg-green-100 text-green-700" },
  { value: "delivered", label: "配達完了", color: "bg-[#F5F5F5] text-[#333]" },
  { value: "cancelled", label: "キャンセル", color: "bg-red-100 text-red-600" },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updating, setUpdating] = useState(false);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch {
      toast.error("取得に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, status: string) => {
    setUpdating(true);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("ステータスを更新しました");
        fetchOrders();
        if (selectedOrder?.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status });
        }
      } else {
        toast.error(data.error || "更新に失敗しました");
      }
    } catch {
      toast.error("通信エラーが発生しました");
    } finally {
      setUpdating(false);
    }
  };

  const getStatusInfo = (status: string) => statusOptions.find((s) => s.value === status) || statusOptions[0];

  if (loading) {
    return <div className="p-6 text-[#888888]">読み込み中...</div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">注文管理</h1>
          <p className="text-sm text-[#888888] mt-1">全注文の確認と管理</p>
        </div>
        <Badge variant="secondary">{orders.length} 件</Badge>
      </div>

      {orders.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-[#888888]">注文はまだありません</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const statusInfo = getStatusInfo(order.status);
            const date = new Date(order.createdAt).toLocaleDateString("ja-JP");
            return (
              <Card key={order.id} className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-mono font-medium text-[#333]">{order.id}</p>
                      <Badge className={`${statusInfo.color} border-0`}>{statusInfo.label}</Badge>
                    </div>
                    <p className="text-xs text-[#888888] mt-1">{date}</p>
                    <p className="text-sm text-[#333] mt-1">
                      {order.shippingName} — {order.shippingAddress}
                    </p>
                    <p className="text-xs text-[#888888] mt-1">
                      {order.items.length} 点の商品
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-lg font-bold text-[#C8A97E]">{formatPrice(order.total)}</p>
                    <div className="mt-2">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className="text-xs rounded-md border border-[#E5E5E5] px-2 py-1"
                      >
                        {statusOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Detail Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={(open) => { if (!open) setSelectedOrder(null); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>注文詳細 — {selectedOrder?.id}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <p><span className="text-[#888888]">ステータス:</span> {getStatusInfo(selectedOrder.status).label}</p>
                <p><span className="text-[#888888]">日付:</span> {new Date(selectedOrder.createdAt).toLocaleDateString("ja-JP")}</p>
                <p><span className="text-[#888888]">宛名:</span> {selectedOrder.shippingName}</p>
                <p><span className="text-[#888888]">電話:</span> {selectedOrder.shippingPhone}</p>
                <p className="col-span-2"><span className="text-[#888888]">住所:</span> 〒{selectedOrder.shippingPostalCode} {selectedOrder.shippingAddress}</p>
                {selectedOrder.notes && (
                  <p className="col-span-2"><span className="text-[#888888]">備考:</span> {selectedOrder.notes}</p>
                )}
              </div>
              <div className="border-t pt-3">
                <p className="text-sm font-medium mb-2">商品一覧</p>
                {selectedOrder.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 py-1 text-sm">
                    <span>{item.name} × {item.quantity}</span>
                    <span className="ml-auto text-[#888888]">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-3 text-sm space-y-1">
                <div className="flex justify-between"><span className="text-[#888888]">小計</span><span>{formatPrice(selectedOrder.subtotal)}</span></div>
                <div className="flex justify-between"><span className="text-[#888888]">送料</span><span>{formatPrice(selectedOrder.shippingFee)}</span></div>
                <div className="flex justify-between"><span className="text-[#888888]">税</span><span>{formatPrice(selectedOrder.tax)}</span></div>
                <div className="flex justify-between font-bold"><span>合計</span><span className="text-[#C8A97E]">{formatPrice(selectedOrder.total)}</span></div>
              </div>
              <div className="flex gap-2 pt-2">
                {statusOptions.map((opt) => (
                  <Button
                    key={opt.value}
                    size="sm"
                    variant={selectedOrder.status === opt.value ? "default" : "outline"}
                    onClick={() => handleStatusChange(selectedOrder.id, opt.value)}
                    disabled={updating}
                  >
                    {opt.label}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
