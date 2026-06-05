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
  code: string;
  name: string;
  nameEn: string;
  nameZh: string;
  price: number;
  image: string;
  type: string;
  categoryId: string;
  region: string;
  inStock: boolean;
  featured: boolean;
  sticks: number;
  tar: number;
  nicotine: number;
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
  id: string; slug: string; code: string; name: string; nameEn: string; nameZh: string;
  price: { toNumber(): number };
  image: string; type: string;
  categoryId: string; region: string; inStock: boolean;
  featured: boolean; sticks: number; tar: { toNumber(): number }; nicotine: { toNumber(): number };
  desc: string;
}): Product {
  return {
    id: row.id, slug: row.slug, code: row.code ?? "", name: row.name, nameEn: row.nameEn ?? "", nameZh: row.nameZh ?? "",
    price: row.price.toNumber(),
    image: row.image, type: row.type, categoryId: row.categoryId,
    region: row.region, inStock: row.inStock,
    featured: row.featured, sticks: row.sticks ?? 20, tar: row.tar?.toNumber() ?? 0, nicotine: row.nicotine?.toNumber() ?? 0,
    desc: row.desc,
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

export async function searchProducts(query: string, limit?: number): Promise<Product[]> {
  const rows = await db.product.findMany({
    where: {
      OR: [
        { code:   { contains: query, mode: "insensitive" } },
        { name:   { contains: query, mode: "insensitive" } },
        { nameEn: { contains: query, mode: "insensitive" } },
        { nameZh: { contains: query, mode: "insensitive" } },
        { region: { contains: query, mode: "insensitive" } },
        { type:   { contains: query, mode: "insensitive" } },
        { desc:   { contains: query, mode: "insensitive" } },
      ],
    },
    orderBy: { createdAt: "desc" },
    ...(limit ? { take: limit } : {}),
  });
  return rows.map(toProduct);
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
