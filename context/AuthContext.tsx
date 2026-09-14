"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import type { User } from "@/types/user";

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  register: (data: RegisterData) => Promise<void>;
  login: (data: LoginData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

const USER_STORAGE_KEY = "shopx-user";
const ACCOUNT_STORAGE_KEY = "shopx-account";

interface StoredAccount {
  user: User;
  password: string;
}

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(USER_STORAGE_KEY);

      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.error("Failed to load user session:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = async ({
    name,
    email,
    password,
  }: RegisterData) => {
    const normalizedEmail = email.trim().toLowerCase();

    const existingAccount = localStorage.getItem(
      ACCOUNT_STORAGE_KEY
    );

    if (existingAccount) {
      const account: StoredAccount = JSON.parse(existingAccount);

      if (account.user.email === normalizedEmail) {
        throw new Error(
          "An account with this email already exists."
        );
      }
    }

    const newUser: User = {
      id: `USR-${Date.now().toString(36).toUpperCase()}`,
      name: name.trim(),
      email: normalizedEmail,
      createdAt: new Date().toISOString(),
    };

    const account: StoredAccount = {
      user: newUser,
      password,
    };

    localStorage.setItem(
      ACCOUNT_STORAGE_KEY,
      JSON.stringify(account)
    );

    localStorage.setItem(
      USER_STORAGE_KEY,
      JSON.stringify(newUser)
    );

    setUser(newUser);
  };

  const login = async ({
    email,
    password,
  }: LoginData) => {
    const savedAccount = localStorage.getItem(
      ACCOUNT_STORAGE_KEY
    );

    if (!savedAccount) {
      throw new Error(
        "No account found. Please create an account first."
      );
    }

    const account: StoredAccount = JSON.parse(savedAccount);

    if (
      account.user.email !== email.trim().toLowerCase() ||
      account.password !== password
    ) {
      throw new Error("Invalid email or password.");
    }

    localStorage.setItem(
      USER_STORAGE_KEY,
      JSON.stringify(account.user)
    );

    setUser(account.user);
  };

  const logout = () => {
    localStorage.removeItem(USER_STORAGE_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: Boolean(user),
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}