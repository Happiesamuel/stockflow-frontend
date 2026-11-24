import { create } from "zustand";
import { api } from "@/lib/api";

type User = {
  id: string;
  fullName: string;
  email: string;
  avatarUrl: string | null;
};

type AuthState = {
  user: User | null;
  loading: boolean;
  loadUser: () => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  loading: true,

  loadUser: async () => {
    try {
      let res = await api("/auth/me");
      if (res.status === 401) {
        const refreshed = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
          { method: "POST", credentials: "include" },
        );
        if (refreshed.ok) res = await api("/auth/me");
      }
      if (!res.ok) return set({ user: null, loading: false });
      const { data } = await res.json();
      set({ user: data, loading: false });
    } catch {
      set({ user: null, loading: false });
    }
  },

  logout: async () => {
    await api("/auth/logout", { method: "POST" });
    set({ user: null });
  },
}));
