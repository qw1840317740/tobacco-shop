"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";

interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  type: string;
  categoryId: string;
  region: string;
  strength: number;
  inStock: boolean;
  featured: boolean;
  desc: string;
}

interface Category {
  id: string;
  slug: string;
  nameJa: string;
  visible: boolean;
}

const EMPTY_PRODUCT = {
  slug: "", name: "", price: 0,
  image: "", type: "CIGARETTE", categoryId: "", region: "Japan",
  strength: 3, inStock: true, featured: false, desc: "",
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStock, setFilterStock] = useState<"all" | "instock" | "outofstock">("all");
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [editForm, setEditForm] = useState(EMPTY_PRODUCT);

  const loadData = useCallback(async () => {
    const [pRes, cRes] = await Promise.all([fetch("/api/products"), fetch("/api/categories")]);
    setProducts(await pRes.json());
    setCategories(await cRes.json());
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const filtered = products.filter((p) => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterStock === "instock" && !p.inStock) return false;
    if (filterStock === "outofstock" && p.inStock) return false;
    return true;
  });

  // Inline edit helpers
  const inlineSave = async (id: string, field: string, value: string | number | boolean) => {
    const res = await fetch("/api/products", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, [field]: value }),
    });
    if (!res.ok) { toast.error("保存に失敗しました"); return; }
    setProducts((prev) => prev.map((p) => p.id === id ? { ...p, [field]: value } : p));
    toast.success("保存しました");
  };

  const handleImageUpload = async (id: string, url: string) => {
    await inlineSave(id, "image", url);
  };

  // Drag and drop
  const handleDragStart = (idx: number) => setDragIdx(idx);
  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === idx) return;
    setProducts((prev) => {
      const updated = [...prev];
      const [item] = updated.splice(dragIdx, 1);
      updated.splice(idx, 0, item);
      return updated;
    });
    setDragIdx(idx);
  };
  const handleDragEnd = () => setDragIdx(null);

  // Delete
  const handleDelete = async () => {
    if (!deleteTarget) return;
    const res = await fetch("/api/products", {
      method: "DELETE", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: deleteTarget.id }),
    });
    if (res.ok) {
      toast.success("削除しました");
      setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
    } else {
      toast.error("削除に失敗しました");
    }
    setDeleteTarget(null);
  };

  // Add / Edit save
  const handleSaveProduct = async () => {
    if (!editForm.slug || !editForm.name || !editForm.categoryId) {
      toast.error("slug, 名前, カテゴリーは必須です");
      return;
    }
    const isEdit = !!editId;
    const res = await fetch("/api/products", {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(isEdit ? { id: editId, ...editForm } : editForm),
    });
    if (res.ok) {
      toast.success(isEdit ? "更新しました" : "追加しました");
      setShowAddModal(false);
      setDrawerOpen(false);
      loadData();
    } else {
      toast.error("保存に失敗しました");
    }
  };

  const openDrawer = (product: Product) => {
    setEditId(product.id);
    setEditForm({ slug: product.slug, name: product.name, price: product.price, image: product.image, type: product.type, categoryId: product.categoryId, region: product.region, strength: product.strength, inStock: product.inStock, featured: product.featured, desc: product.desc });
    setDrawerOpen(true);
  };

  const openAdd = () => {
    setEditId(null);
    setEditForm({ ...EMPTY_PRODUCT });
    setShowAddModal(true);
  };

  if (loading) {
    return <div className="flex h-96 items-center justify-center text-[#888888]">読み込み中...</div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">商品管理</h1>
          <p className="text-sm text-[#888888]">{products.length} 件の商品</p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 rounded-lg bg-[#1A1A1A] px-4 py-2 text-sm font-medium text-white hover:bg-[#333]"
        >
          + 新規商品
        </button>
      </div>

      {/* Filters */}
      <div className="mt-4 flex flex-wrap gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="商品名で検索..."
          className="rounded-lg border border-[#E5E5E5] px-3 py-2 text-sm focus:border-[#C8A97E] focus:outline-none"
        />
        <select
          value={filterStock}
          onChange={(e) => setFilterStock(e.target.value as typeof filterStock)}
          className="rounded-lg border border-[#E5E5E5] px-3 py-2 text-sm"
        >
          <option value="all">すべて</option>
          <option value="instock">在庫あり</option>
          <option value="outofstock">在庫切れ</option>
        </select>
      </div>

      {/* Product Cards Grid */}
      <div className="mt-6 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((product, idx) => (
          <div
            key={product.id}
            draggable
            onDragStart={() => handleDragStart(idx)}
            onDragOver={(e) => handleDragOver(e, idx)}
            onDragEnd={handleDragEnd}
            className={`group rounded-xl border bg-white shadow-sm transition-all hover:shadow-md ${
              dragIdx === idx ? "opacity-50" : ""
            }`}
          >
            {/* Image */}
            <div className="relative aspect-square overflow-hidden rounded-t-xl">
              <ImageUploader
                currentImage={product.image}
                onUpload={(url) => handleImageUpload(product.id, url)}
                compact
              />
              {/* Featured badge */}
              <button
                onClick={() => inlineSave(product.id, "featured", !product.featured)}
                className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-bold transition-colors ${
                  product.featured ? "bg-[#1A1A1A] text-white" : "bg-[#E5E5E5] text-[#888888] hover:bg-[#E5E5E5]"
                }`}
              >
                {product.featured ? "★ おすすめ" : "おすすめ"}
              </button>
              {/* Stock toggle */}
              <button
                onClick={() => inlineSave(product.id, "inStock", !product.inStock)}
                className={`absolute right-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  product.inStock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                }`}
              >
                {product.inStock ? "在庫あり" : "在庫切れ"}
              </button>
              {!product.inStock && (
                <div className="absolute inset-0 bg-black/20 pointer-events-none" />
              )}
            </div>

            {/* Info */}
            <div className="p-3">
              {/* Inline editable name */}
              <InlineField
                value={product.name}
                onSave={(v) => inlineSave(product.id, "name", v)}
                className="font-medium text-sm text-[#1A1A1A]"
              />
              <div className="mt-1 flex items-baseline gap-2">
                <InlineField
                  value={String(product.price)}
                  onSave={(v) => inlineSave(product.id, "price", Number(v))}
                  className="text-lg font-bold text-[#C8A97E]"
                  prefix="$"
                  type="number"
                />
              </div>
              <p className="mt-1 text-xs text-[#888888]">{product.region} · {product.type}</p>

              {/* Actions */}
              <div className="mt-3 flex gap-2 border-t pt-3">
                <button
                  onClick={() => openDrawer(product)}
                  className="flex-1 rounded-lg bg-[#F5F5F5] px-3 py-1.5 text-xs font-medium text-[#333] hover:bg-[#E5E5E5]"
                >
                  編集
                </button>
                <button
                  onClick={() => setDeleteTarget(product)}
                  className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100"
                >
                  削除
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Add card */}
        <button
          onClick={openAdd}
          className="flex aspect-[3/4] items-center justify-center rounded-xl border-2 border-dashed border-[#E5E5E5] text-[#888888] transition-colors hover:border-[#C8A97E] hover:text-[#C8A97E]"
        >
          <div className="text-center">
            <span className="text-3xl">+</span>
            <p className="mt-1 text-xs">新規商品</p>
          </div>
        </button>
      </div>

      {/* Detail Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/30" onClick={() => setDrawerOpen(false)} />
          <div className="relative w-full max-w-md overflow-y-auto bg-white shadow-sm">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-6 py-4">
              <h2 className="text-lg font-semibold text-[#1A1A1A]">商品詳細編集</h2>
              <button onClick={() => setDrawerOpen(false)} className="text-[#888888] hover:text-[#333]">✕</button>
            </div>
            <ProductForm
              form={editForm}
              setForm={setEditForm}
              categories={categories}
              onSave={handleSaveProduct}
              onCancel={() => setDrawerOpen(false)}
              onImageChange={(url) => setEditForm((f) => ({ ...f, image: url }))}
            />
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-lg bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[#1A1A1A]">新規商品追加</h2>
            <ProductForm
              form={editForm}
              setForm={setEditForm}
              categories={categories}
              onSave={handleSaveProduct}
              onCancel={() => setShowAddModal(false)}
              onImageChange={(url) => setEditForm((f) => ({ ...f, image: url }))}
            />
          </div>
        </div>
      )}

      {/* Delete confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="商品を削除"
        message={`「${deleteTarget?.name}」を削除しますか？この操作は取り消せません。`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

// Inline editable field
function InlineField({
  value, onSave, className, prefix, type = "text",
}: {
  value: string;
  onSave: (v: string) => void;
  className?: string;
  prefix?: string;
  type?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [temp, setTemp] = useState(value);

  if (editing) {
    return (
      <input
        type={type}
        value={temp}
        onChange={(e) => setTemp(e.target.value)}
        onBlur={() => { setEditing(false); if (temp !== value) onSave(temp); }}
        onKeyDown={(e) => { if (e.key === "Enter") { setEditing(false); if (temp !== value) onSave(temp); } if (e.key === "Escape") { setEditing(false); setTemp(value); } }}
        className={`${className || ""} w-full rounded border border-[#C8A97E] px-1 outline-none`}
        autoFocus
      />
    );
  }

  return (
    <span
      className={`${className || ""} cursor-pointer hover:bg-[#F5F5F5] rounded px-1 -mx-1 transition-colors`}
      onDoubleClick={() => { setTemp(value); setEditing(true); }}
    >
      {prefix}{value}
    </span>
  );
}

// Shared product form for drawer and modal
function ProductForm({
  form, setForm, categories, onSave, onCancel, onImageChange,
}: {
  form: typeof EMPTY_PRODUCT;
  setForm: React.Dispatch<React.SetStateAction<typeof EMPTY_PRODUCT>>;
  categories: Category[];
  onSave: () => void;
  onCancel: () => void;
  onImageChange: (url: string) => void;
}) {
  return (
    <div className="mt-4 space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-[#888888]">Slug *</label>
          <input value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-xs font-medium text-[#888888]">商品名 *</label>
          <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-[#888888]">価格 (¥) *</label>
          <input type="number" step="1" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))} className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" />
        </div>
      </div>
      <div>
        <label className="text-xs font-medium text-[#888888]">画像</label>
        <div className="mt-1">
          <ImageUploader currentImage={form.image} onUpload={onImageChange} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-[#888888]">カテゴリー *</label>
          <select value={form.categoryId} onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))} className="mt-1 w-full rounded-lg border px-3 py-2 text-sm">
            <option value="">-- 選択 --</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.nameJa}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-[#888888]">種類</label>
          <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))} className="mt-1 w-full rounded-lg border px-3 py-2 text-sm">
            <option value="CIGARETTE">CIGARETTE</option>
            <option value="OTHER">OTHER</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-[#888888]">産地</label>
          <input value={form.region} onChange={(e) => setForm((f) => ({ ...f, region: e.target.value }))} className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-xs font-medium text-[#888888]">濃さ (1-5)</label>
          <input type="number" min="1" max="5" value={form.strength} onChange={(e) => setForm((f) => ({ ...f, strength: Number(e.target.value) }))} className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" />
        </div>
      </div>
      <div>
        <label className="text-xs font-medium text-[#888888]">説明</label>
        <textarea value={form.desc} onChange={(e) => setForm((f) => ({ ...f, desc: e.target.value }))} rows={3} className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" />
      </div>
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.inStock} onChange={(e) => setForm((f) => ({ ...f, inStock: e.target.checked }))} />
          在庫あり
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.featured} onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))} />
          おすすめ
        </label>
      </div>
      <div className="flex gap-3 pt-2">
        <button onClick={onSave} className="flex-1 rounded-lg bg-[#1A1A1A] py-2.5 text-sm font-medium text-white hover:bg-[#333]">保存</button>
        <button onClick={onCancel} className="flex-1 rounded-lg border border-[#E5E5E5] py-2.5 text-sm font-medium text-[#333] hover:bg-[#F5F5F5]">キャンセル</button>
      </div>
    </div>
  );
}
