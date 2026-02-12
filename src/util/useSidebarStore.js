import { create } from "zustand";

export const useSidebarStore = create((set) => ({
  collapsed: false,
  toggle: () => set((s) => ({ collapsed: !s.collapsed })),
  setCollapsed: (v) => set({ collapsed: v }),
}));
