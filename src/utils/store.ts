import { create } from 'zustand';
import { persist } from "zustand/middleware";

interface DataStore {

}

export const useDataStore = create<DataStore>((set:any, get:any) => ({
  data: null,
  setData: (data:any) => set({ data }),
}));

interface User {
  id: number;
  full_name: string;
  email: string;
  is_admin: boolean;
  is_staff_member: boolean;
  phone: string;
  role: string;
  avatar: string
};

interface AuthState {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: "auth-storage",
    }
  )
);