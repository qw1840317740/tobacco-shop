import { db } from "./db";

export interface Category {
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

export interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  comparePrice?: number;
  image: string;
  type: string;
  categoryId: string;
  region: string;
  strength: number;
  inStock: boolean;
  featured: boolean;
  desc: string;
}

function toCategory(row: {
  id: string; slug: string; name: string; nameJa: string; nameZh: string;
  description: string; image: string; count: number; sortOrder: number; visible: boolean;
}): Category {
  return {
    id: row.id, slug: row.slug, name: row.name, nameJa: row.nameJa, nameZh: row.nameZh,
    description: row.description, image: row.image, count: row.count, sortOrder: row.sortOrder, visible: row.visible,
  };
}

function toProduct(row: {
  id: string; slug: string; name: string; price: { toNumber(): number };
  comparePrice: { toNumber(): number } | null; image: string; type: string;
  categoryId: string; region: string; strength: number; inStock: boolean;
  featured: boolean; desc: string;
}): Product {
  return {
    id: row.id, slug: row.slug, name: row.name,
    price: row.price.toNumber(),
    comparePrice: row.comparePrice?.toNumber() ?? undefined,
    image: row.image, type: row.type, categoryId: row.categoryId,
    region: row.region, strength: row.strength, inStock: row.inStock,
    featured: row.featured, desc: row.desc,
  };
}

// ===== CATEGORIES =====

export async function getCategories(): Promise<Category[]> {
  const rows = await db.category.findMany({
    where: { visible: true },
    orderBy: { sortOrder: "asc" },
  });
  return rows.map(toCategory);
}

export async function getAllCategories(): Promise<Category[]> {
  const rows = await db.category.findMany({ orderBy: { sortOrder: "asc" } });
  return rows.map(toCategory);
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const row = await db.category.findUnique({ where: { slug } });
  return row ? toCategory(row) : null;
}

export async function addCategory(cat: Omit<Category, "id"> & { id?: string }): Promise<Category> {
  const data = { id: `cat_${Date.now()}`, ...cat };
  const row = await db.category.create({ data });
  return toCategory(row);
}

export async function updateCategory(id: string, updates: Partial<Category>): Promise<Category | null> {
  try {
    const row = await db.category.update({ where: { id }, data: updates });
    return toCategory(row);
  } catch { return null; }
}

export async function deleteCategory(id: string): Promise<boolean> {
  try {
    await db.product.deleteMany({ where: { categoryId: id } });
    await db.category.delete({ where: { id } });
    return true;
  } catch { return false; }
}

// ===== PRODUCTS =====

export async function getProducts(): Promise<Product[]> {
  const rows = await db.product.findMany({ orderBy: { createdAt: "desc" } });
  return rows.map(toProduct);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const rows = await db.product.findMany({ where: { featured: true } });
  return rows.map(toProduct);
}

export async function getProductsByCategory(categoryId: string): Promise<Product[]> {
  const rows = await db.product.findMany({ where: { categoryId } });
  return rows.map(toProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const row = await db.product.findUnique({ where: { slug } });
  return row ? toProduct(row) : null;
}

export async function addProduct(prod: Omit<Product, "id"> & { id?: string }): Promise<Product> {
  const data = { id: `prod_${Date.now()}`, ...prod };
  const row = await db.product.create({ data });
  return toProduct(row);
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
  try {
    const row = await db.product.update({ where: { id }, data: updates });
    return toProduct(row);
  } catch { return null; }
}

export async function deleteProduct(id: string): Promise<boolean> {
  try {
    await db.product.delete({ where: { id } });
    return true;
  } catch { return false; }
}
