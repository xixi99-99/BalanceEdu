import { create } from 'zustand';

export type ToastTone = 'success' | 'error' | 'info';

interface ToastMessage {
  id: number;
  message: string;
  tone: ToastTone;
}

interface UiState {
  sidebarCollapsed: boolean;
  mobileDrawerOpen: boolean;
  toast: ToastMessage | null;
  toggleSidebar: () => void;
  setMobileDrawerOpen: (open: boolean) => void;
  showToast: (message: string, tone?: ToastTone) => void;
  clearToast: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  sidebarCollapsed: false,
  mobileDrawerOpen: false,
  toast: null,
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setMobileDrawerOpen: (open) => set({ mobileDrawerOpen: open }),
  showToast: (message, tone = 'success') => set({ toast: { id: Date.now(), message, tone } }),
  clearToast: () => set({ toast: null }),
}));
