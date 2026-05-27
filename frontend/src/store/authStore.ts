import { create } from "zustand";

interface User {
  name: string;
  email: string;
  role: string;
}

interface AuthStore {
  token: string | null;

  user: User | null;

  login: (token: string, user: User) => void;

  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  token: localStorage.getItem("token"),

  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")!)
    : null,

  login: (token, user) => {
    localStorage.setItem("token", token);

    localStorage.setItem("user", JSON.stringify(user));

    set({
      token,
      user,
    });
  },

  logout: () => {
    localStorage.removeItem("token");

    localStorage.removeItem("user");

    set({
      token: null,
      user: null,
    });
  },
}));
