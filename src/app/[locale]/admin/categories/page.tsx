"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";

interface Category {
  id: string;
  slug: string;
  name: string;
  nameJa: string;
  nameZh: string;
  description: string;
  image: string;
  count: number;
  sortOrder: number;
  visible: boolean;
}

const EMPTY_CAT: Omit<Category, "id"> = {
  slug: "", name: "", nameJa: "", nameZh: "", description: "",
  image: "", count: 0, sortOrder: 0, visible: true,
};

export default function AdminCategoriesPage() {
  const [categories, setCats] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editCat, setEditCat] = useState<Category | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [form, setForm] = useState(EMPTY_CAT);

  const loadData = useCallback(async () => {
    const res = await fetch("/api/categories");
    setCats(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const openNew = () => { setForm(EMPTY_CAT); setIsNew(true); setEditCat(null); };
  const openEdit = (cat: Category) => {
    setForm(cat); setEditCat(cat); setIsNew(false);
  };

  const handleSave = async () => {
    if (!form.slug || !form.nameJa) { toast.error("slug と 日本語名は必須です"); return; }
    const res = await fetch("/api/categories", {
      method: isNew ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(isNew ? form : { id: editCat?.id, ...form }),
    });
    if (res.ok) {
      toast.success(isNew ? "追加しました" : "更新しました");
      setEditCat(null);
      loadData();
    } else {
      toast.error("保存に失敗しました");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const res = await fetch("/api/categories", {
      method: "DELETE", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: deleteTarget.id }),
    });
    if (res.ok) {
      toast.success("削除しました");
      loadData();
    } else {
      toast.error("削除に失敗しました");
    }
    setDeleteTarget(null);
  };

  const toggleVisible = async (cat: Category) => {
    const res = await fetch("/api/categories", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: cat.id, visible: !cat.visible }),
    });
    if (res.ok) {
      setCats((prev) => prev.map((c) => c.id === cat.id ? { ...c, visible: !c.visible } : c));
      toast.success(cat.visible ? "非表示にしました" : "表示にしました");
    }
  };

  if (loading) {
    return <div className="flex h-96 items-center justify-center text-[#888888]">読み込み中...</div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">カテゴリー管理</h1>
          <p className="text-sm text-[#888888]">{categories.length} 件のカテゴリー</p>
        </div>
        <button onClick={openNew} className="inline-flex items-center gap-2 rounded-lg bg-[#1A1A1A] px-4 py-2 text-sm font-medium text-white hover:bg-[#333]">
          + 新規カテゴリー
        </button>
      </div>

      {/* Category Cards */}
      <div className="mt-6 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => (
          <div key={cat.id} className="group rounded-xl border bg-white shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative h-40">
              {cat.image ? (
                <img src={cat.image} alt={cat.nameJa} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center bg-[#F5F5F5] text-[#888888] text-3xl">🏷️</div>
              )}
              <div className="absolute bottom-3 left-3">
                <h3 className="text-lg font-bold text-white">{cat.nameJa}</h3>
                <p className="text-xs text-[#888888]">{cat.slug} · {cat.count}商品</p>
              </div>
              <button
                onClick={() => toggleVisible(cat)}
                className={`absolute right-3 top-3 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  cat.visible ? "bg-green-500 text-white" : "bg-stone-500 text-white"
                }`}
              >
                {cat.visible ? "表示" : "非表示"}
              </button>
            </div>
            <div className="p-3 flex gap-2">
              <button onClick={() => openEdit(cat)} className="flex-1 rounded-lg bg-[#F5F5F5] px-3 py-1.5 text-xs font-medium text-[#333] hover:bg-[#E5E5E5]">編集</button>
              <button onClick={() => setDeleteTarget(cat)} className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100">削除</button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {(editCat || isNew) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-lg bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[#1A1A1A]">{isNew ? "新規カテゴリー" : "カテゴリー編集"}</h2>
            <div className="mt-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-[#888888]">Slug *</label>
                  <input value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="text-xs font-medium text-[#888888]">日本語名 *</label>
                  <input value={form.nameJa} onChange={(e) => setForm((f) => ({ ...f, nameJa: e.target.value }))} className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-[#888888]">English名</label>
                  <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="text-xs font-medium text-[#888888]">中国語名</label>
                  <input value={form.nameZh} onChange={(e) => setForm((f) => ({ ...f, nameZh: e.target.value }))} className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-[#888888]">説明</label>
                <input value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" />
              </div>
              <ImageUploader currentImage={form.image} onUpload={(url) => setForm((f) => ({ ...f, image: url }))} />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-[#888888]">商品数</label>
                  <input type="number" value={form.count} onChange={(e) => setForm((f) => ({ ...f, count: Number(e.target.value) }))} className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="text-xs font-medium text-[#888888]">並び順</label>
                  <input type="number" value={form.sortOrder} onChange={(e) => setForm((f) => ({ ...f, sortOrder: Number(e.target.value) }))} className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" />
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.visible} onChange={(e) => setForm((f) => ({ ...f, visible: e.target.checked }))} />
                表示する
              </label>
              <div className="flex gap-3 pt-2">
                <button onClick={handleSave} className="flex-1 rounded-lg bg-[#1A1A1A] py-2.5 text-sm font-medium text-white hover:bg-[#333]">保存</button>
                <button onClick={() => { setEditCat(null); setIsNew(false); }} className="flex-1 rounded-lg border py-2.5 text-sm font-medium text-[#333] hover:bg-[#F5F5F5]">キャンセル</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="カテゴリーを削除"
        message={`「${deleteTarget?.nameJa}」を削除しますか？所属する商品もすべて削除されます。`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
