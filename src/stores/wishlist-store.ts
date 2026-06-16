import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface WishlistItem {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
}

interface WishlistState {
  items: WishlistItem[];
  _hydrated: boolean;
  toggle: (item: WishlistItem) => boolean; // returns true if added
  has: (id: string) => boolean;
  remove: (id: string) => void;
  clear: () => void;
  setHydrated: (h: boolean) => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      _hydrated: false,

      toggle: (item) => {
        const exists = get().items.some((i) => i.id === item.id);
        set((state) => ({
          items: exists
            ? state.items.filter((i) => i.id !== item.id)
            : [...state.items, item],
        }));
        return !exists;
      },

      has: (id) => get().items.some((i) => i.id === id),

      remove: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

      clear: () => set({ items: [] }),

      setHydrated: (h) => set({ _hydrated: h }),
    }),
    {
      name: "tobacco-shop-wishlist",
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
