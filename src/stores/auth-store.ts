import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: string;
  ageVerified: boolean;
  ageDocStatus: string;
}

interface AuthState {
  user: AuthUser | null;
  _hydrated: boolean;
  setUser: (user: AuthUser | null) => void;
  clearUser: () => void;
  setHydrated: (hydrated: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      _hydrated: false,

      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
      setHydrated: (hydrated) => set({ _hydrated: hydrated }),
    }),
    {
      name: "tobacco-auth",
      partialize: (state) => ({ user: state.user }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
