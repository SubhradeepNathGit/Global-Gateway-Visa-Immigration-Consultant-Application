import { create } from "zustand";

export const useSidebarStore = create((set) => ({
  collapsed: false,
  mobileOpen: false,
  toggle: () => set((s) => ({ collapsed: !s.collapsed })),
  setCollapsed: (v) => set({ collapsed: v }),
  setMobileOpen: (v) => set({ mobileOpen: v }),
  toggleMobileOpen: () => set((s) => ({ mobileOpen: !s.mobileOpen })),
}));
