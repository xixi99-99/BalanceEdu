import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { demoUsers } from '../mock/data';
import type { User, UserRole } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (role: UserRole) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (role) => set({ user: demoUsers[role], isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
      switchRole: (role) => set({ user: demoUsers[role], isAuthenticated: true }),
    }),
    { name: 'balanceedu-auth' },
  ),
);
