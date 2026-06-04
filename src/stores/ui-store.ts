import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UIState {
  ageVerified: boolean;
  sidebarOpen: boolean;
  cartOpen: boolean;
  setAgeVerified: (verified: boolean) => void;
  setSidebarOpen: (open: boolean) => void;
  setCartOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      ageVerified: false,
      sidebarOpen: false,
      cartOpen: false,
      setAgeVerified: (verified) => set({ ageVerified: verified }),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setCartOpen: (open) => set({ cartOpen: open }),
    }),
    {
      name: "tobacco-ui",
      partialize: (state) => ({ ageVerified: state.ageVerified }),
    }
  )
);
