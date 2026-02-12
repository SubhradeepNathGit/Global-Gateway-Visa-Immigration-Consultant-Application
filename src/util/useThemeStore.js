import { create } from "zustand";

export const useThemeStore = create((set) => ({
  dark: true,
  toggle: () => set((s) => ({ dark: !s.dark })),
}));
