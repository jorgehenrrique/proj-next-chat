'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AdminState {
  isAdmin: boolean;
  token: string | null;
  setAdmin: (password: string) => Promise<void>;
  clearAdmin: () => void;
  verifyAdmin: () => boolean;
}

export const useAdmin = create<AdminState>()(
  persist(
    (set, get) => ({
      isAdmin: false,
      token: null,
      setAdmin: async (password: string) => {
        try {
          const response = await fetch('/api/admin/auth', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ password }),
          });

          const data = await response.json();

          if (data.success) {
            set({ isAdmin: true, token: data.token });
          } else {
            throw new Error(data.error);
          }
        } catch (error) {
          // console.error('Erro ao autenticar:', error);
          throw error;
        }
      },
      clearAdmin: () => set({ isAdmin: false, token: null }),
      verifyAdmin: () => get().isAdmin,
    }),
    {
      name: 'admin-storage',
    }
  )
);
