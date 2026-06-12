"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Link } from "@/i18n/navigation";

interface Address {
  id: string;
  label: string;
  name: string;
  phone: string;
  postalCode: string;
  address1: string;
  address2: string;
  city: string;
  prefecture: string;
  isDefault: boolean;
  createdAt: string;
}

const emptyForm = {
  label: "home",
  name: "",
  phone: "",
  postalCode: "",
  address1: "",
  address2: "",
  city: "",
  prefecture: "",
  isDefault: false,
};

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchAddresses = async () => {
    try {
      const res = await fetch("/api/users/addresses");
      const data = await res.json();
      if (data.success) {
        setAddresses(data.addresses);
      }
    } catch {
      toast.error("住所の取得に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleSubmit = async () => {
    if (!form.name || !form.postalCode || !form.address1) {
      toast.error("必須項目を入力してください");
      return;
    }
    setSubmitting(true);
    try {
      const url = "/api/users/addresses";
      const method = editingId ? "PUT" : "POST";
      const body = editingId ? { ...form, id: editingId } : form;
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(editingId ? "住所を更新しました" : "住所を追加しました");
        setDialogOpen(false);
        setForm(emptyForm);
        setEditingId(null);
        fetchAddresses();
      } else {
        toast.error(data.error || "操作に失敗しました");
      }
    } catch {
      toast.error("通信エラーが発生しました");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("この住所を削除しますか？")) return;
    try {
      const res = await fetch(`/api/users/addresses?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast.success("住所を削除しました");
        fetchAddresses();
      } else {
        toast.error(data.error || "削除に失敗しました");
      }
    } catch {
      toast.error("通信エラーが発生しました");
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      const res = await fetch("/api/users/addresses", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isDefault: true }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("デフォルト住所を変更しました");
        fetchAddresses();
      }
    } catch {
      toast.error("通信エラーが発生しました");
    }
  };

  const openEdit = (addr: Address) => {
    setForm({
      label: addr.label,
      name: addr.name,
      phone: addr.phone,
      postalCode: addr.postalCode,
      address1: addr.address1,
      address2: addr.address2,
      city: addr.city,
      prefecture: addr.prefecture,
      isDefault: addr.isDefault,
    });
    setEditingId(addr.id);
    setDialogOpen(true);
  };

  const openAdd = () => {
    setForm(emptyForm);
    setEditingId(null);
    setDialogOpen(true);
  };

  const labelMap: Record<string, string> = { home: "自宅", work: "勤務先", other: "その他" };

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <p className="text-[#888888]">読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/profile" className="text-sm text-[#888888] hover:text-[#C8A97E]">← プロフィールに戻る</Link>
          <h1 className="text-3xl font-bold text-[#1A1A1A] mt-2">住所管理</h1>
        </div>
        <Button onClick={openAdd} className="bg-[#1A1A1A] text-white hover:bg-[#333]" size="sm">
          + 追加
        </Button>
      </div>

      {addresses.length === 0 ? (
        <Card className="mt-6 p-8 text-center">
          <p className="text-[#888888]">住所が登録されていません</p>
          <Button onClick={openAdd} variant="outline" className="mt-3" size="sm">住所を追加</Button>
        </Card>
      ) : (
        <div className="mt-6 space-y-4">
          {addresses.map((addr) => (
            <Card key={addr.id} className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{labelMap[addr.label] || addr.label}</Badge>
                    {addr.isDefault && <Badge>デフォルト</Badge>}
                  </div>
                  <p className="mt-2 font-medium">{addr.name}</p>
                  {addr.phone && <p className="text-sm text-[#888888]">{addr.phone}</p>}
                  <p className="text-sm text-[#888888] mt-1">〒{addr.postalCode}</p>
                  <p className="text-sm text-[#888888]">
                    {addr.prefecture}{addr.city}{addr.address1}
                  </p>
                  {addr.address2 && <p className="text-sm text-[#888888]">{addr.address2}</p>}
                </div>
                <div className="flex gap-2">
                  {!addr.isDefault && (
                    <Button variant="ghost" size="sm" onClick={() => handleSetDefault(addr.id)}>
                      デフォルトに
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => openEdit(addr)}>編集</Button>
                  <Button variant="ghost" size="sm" className="text-red-600" onClick={() => handleDelete(addr.id)}>削除</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingId ? "住所を編集" : "新しい住所を追加"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            <div>
              <Label>ラベル</Label>
              <select
                value={form.label}
                onChange={(e) => setForm({ ...form, label: e.target.value })}
                className="mt-1 w-full rounded-md border border-[#E5E5E5] px-3 py-2 text-sm"
              >
                <option value="home">自宅</option>
                <option value="work">勤務先</option>
                <option value="other">その他</option>
              </select>
            </div>
            <div>
              <Label>宛名 *</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1" />
            </div>
            <div>
              <Label>電話番号</Label>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="mt-1" />
            </div>
            <div>
              <Label>郵便番号 *</Label>
              <Input value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} className="mt-1" />
            </div>
            <div>
              <Label>都道府県</Label>
              <Input value={form.prefecture} onChange={(e) => setForm({ ...form, prefecture: e.target.value })} className="mt-1" />
            </div>
            <div>
              <Label>市区町村</Label>
              <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="mt-1" />
            </div>
            <div>
              <Label>住所 *</Label>
              <Input value={form.address1} onChange={(e) => setForm({ ...form, address1: e.target.value })} className="mt-1" />
            </div>
            <div>
              <Label>建物名・部屋番号</Label>
              <Input value={form.address2} onChange={(e) => setForm({ ...form, address2: e.target.value })} className="mt-1" />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.isDefault}
                onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
                className="rounded border-[#E5E5E5]"
              />
              <Label>デフォルトの配送先に設定</Label>
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>キャンセル</Button>
            <Button className="bg-[#1A1A1A] text-white hover:bg-[#333]" onClick={handleSubmit} disabled={submitting}>
              {submitting ? "保存中..." : "保存"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
