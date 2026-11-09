import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import * as api from "../api/client";
import type { AuthUser } from "../api/client";
import { invalidateAll } from "../utils/requestCache";

const STORAGE_KEY = "yurak.auth";

interface StoredAuth {
  token: string;
  user: AuthUser;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  register: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (name: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function loadStoredAuth(): StoredAuth | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredAuth) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<StoredAuth | null>(() => loadStoredAuth());

  const persist = useCallback((next: StoredAuth | null) => {
    setAuth(next);
    if (next) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const register = useCallback(
    async (email: string, password: string) => {
      const result = await api.register(email, password);
      persist({ token: result.token, user: result.user });
    },
    [persist]
  );

  const login = useCallback(
    async (email: string, password: string) => {
      const result = await api.login(email, password);
      persist({ token: result.token, user: result.user });
    },
    [persist]
  );

  // Cached responses (utils/requestCache.ts) are implicitly scoped to whichever
  // account fetched them. Clearing here (not on login/register, and not on
  // updateProfile below) is enough: this is the one path that can leave the app
  // signed out and then signed back in as a possibly-different account, so it's
  // the one place stale data from "whoever was signed in before" could otherwise
  // survive into a new session.
  const logout = useCallback(() => {
    persist(null);
    invalidateAll();
  }, [persist]);

  const updateProfile = useCallback(
    async (name: string) => {
      if (!auth) return;
      const result = await api.updateProfile(auth.token, name);
      persist({ token: auth.token, user: result.user });
    },
    [auth, persist]
  );

  const value = useMemo<AuthContextValue>(
    () => ({ user: auth?.user ?? null, token: auth?.token ?? null, register, login, logout, updateProfile }),
    [auth, register, login, logout, updateProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
