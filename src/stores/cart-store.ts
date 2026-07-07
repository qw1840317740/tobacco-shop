import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  // Snapshot of stock at the time the item was added — protects the cart
  // from being out of sync with the live DB. Re-checked at checkout.
  maxQuantity: number;
  inStock: boolean;
}

const PER_ITEM_MAX = 10; // Japanese tobacco online sales: a per-item 10-stick
                          // cap is the common practical limit for individual
                          // buyers; matches the 1-10 dropdown that already
                          // existed in the cart UI.

interface CartState {
  items: CartItem[];
  _hydrated: boolean;
  addItem: (
    item: Omit<CartItem, "quantity" | "maxQuantity" | "inStock"> & {
      quantity?: number;
      maxQuantity?: number;
      inStock?: boolean;
    }
  ) => { ok: boolean; reason?: string };
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => { ok: boolean; reason?: string };
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
  setHydrated: (hydrated: boolean) => void;
  // Removes any cart items that are out of stock or whose product has been
  // delisted (caller passes current product list).
  reconcileWithCatalog: (live: Array<{ productId: string; inStock: boolean; maxQuantity?: number }>) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      _hydrated: false,

      addItem: (item) => {
        if (item.inStock === false) {
          return { ok: false, reason: "out_of_stock" };
        }
        const cap = Math.min(item.maxQuantity ?? PER_ITEM_MAX, PER_ITEM_MAX);
        const requested = item.quantity ?? 1;
        if (requested <= 0) {
          return { ok: false, reason: "invalid_qty" };
        }
        let rejected = false;
        set((state) => {
          const existing = state.items.find((i) => i.productId === item.productId);
          if (existing) {
            const next = existing.quantity + requested;
            if (next > cap) {
              rejected = true;
              return state;
            }
            return {
              items: state.items.map((i) =>
                i.productId === item.productId ? { ...i, quantity: next } : i
              ),
            };
          }
          if (requested > cap) {
            rejected = true;
            return state;
          }
          return {
            items: [
              ...state.items,
              {
                productId: item.productId,
                slug: item.slug,
                name: item.name,
                price: item.price,
                image: item.image,
                quantity: requested,
                maxQuantity: cap,
                inStock: true,
              },
            ],
          };
        });
        return rejected
          ? { ok: false, reason: "exceeds_max" }
          : { ok: true };
      },

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        })),

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          set((state) => ({
            items: state.items.filter((i) => i.productId !== productId),
          }));
          return { ok: true };
        }
        let rejected = false;
        let cap = PER_ITEM_MAX;
        set((state) => {
          const item = state.items.find((i) => i.productId === productId);
          if (!item) return state;
          cap = item.maxQuantity ?? PER_ITEM_MAX;
          if (quantity > cap) {
            rejected = true;
            return state;
          }
          return {
            items: state.items.map((i) =>
              i.productId === productId ? { ...i, quantity } : i
            ),
          };
        });
        return rejected
          ? { ok: false, reason: "exceeds_max" }
          : { ok: true };
      },

      clearCart: () => set({ items: [] }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      totalPrice: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

      setHydrated: (hydrated) => set({ _hydrated: hydrated }),

      reconcileWithCatalog: (live) => {
        const byId = new Map(live.map((p) => [p.productId, p]));
        set((state) => ({
          items: state.items.filter((i) => {
            const product = byId.get(i.productId);
            if (!product) return false; // product delisted — drop from cart
            if (!product.inStock) return false;
            return true;
          }),
        }));
      },
    }),
    {
      name: "tobacco-cart",
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
