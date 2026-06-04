import { db } from "./db";

export interface OrderItem {
  productId: string;
  name: string;
  slug: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
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
  updatedAt: string;
}

function toOrder(row: any): Order {
  return {
    id: row.id,
    userId: row.userId,
    status: row.status,
    items: row.items as OrderItem[],
    subtotal: Number(row.subtotal),
    shippingFee: Number(row.shippingFee),
    tax: Number(row.tax),
    total: Number(row.total),
    shippingName: row.shippingName,
    shippingPhone: row.shippingPhone,
    shippingPostalCode: row.shippingPostalCode,
    shippingAddress: row.shippingAddress,
    paymentMethod: row.paymentMethod,
    notes: row.notes,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function createOrder(data: {
  userId: string;
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
  notes?: string;
}): Promise<Order> {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  const id = `ORD-${dateStr}-${rand}`;

  const row = await db.order.create({
    data: {
      id,
      userId: data.userId,
      status: "pending",
      items: data.items as any,
      subtotal: data.subtotal,
      shippingFee: data.shippingFee,
      tax: data.tax,
      total: data.total,
      shippingName: data.shippingName,
      shippingPhone: data.shippingPhone,
      shippingPostalCode: data.shippingPostalCode,
      shippingAddress: data.shippingAddress,
      paymentMethod: data.paymentMethod,
      notes: data.notes || "",
    },
  });
  return toOrder(row);
}

export async function getOrdersByUserId(userId: string): Promise<Order[]> {
  const rows = await db.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
  return rows.map(toOrder);
}

export async function getOrderById(id: string): Promise<Order | null> {
  const row = await db.order.findUnique({ where: { id } });
  if (!row) return null;
  return toOrder(row);
}

export async function getAllOrders(): Promise<Order[]> {
  const rows = await db.order.findMany({
    orderBy: { createdAt: "desc" },
  });
  return rows.map(toOrder);
}

export async function updateOrderStatus(id: string, status: string): Promise<boolean> {
  try {
    await db.order.update({
      where: { id },
      data: { status },
    });
    return true;
  } catch {
    return false;
  }
}
