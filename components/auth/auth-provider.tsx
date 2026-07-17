"use client";

import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";

export type UserRole = "customer" | "business";

type AuthContextValue = {
  user: User | null;
  role: UserRole | null;
  loading: boolean;
  isBusiness: boolean;
  isCustomer: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

async function getRoleForUser(userId: string): Promise<UserRole> {
  const profileResponse = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();

  const profileRole = profileResponse.data?.role;

  if (profileRole === "business") return "business";
  if (profileRole === "customer") return "customer";

  const businessUserResponse = await supabase
    .from("business_users")
    .select("id")
    .eq("user_id", userId)
    .limit(1);

  if ((businessUserResponse.data || []).length > 0) {
    return "business";
  }

  return "customer";
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadSession() {
    setLoading(true);

    const { data } = await supabase.auth.getUser();
    const nextUser = data.user ?? null;

    setUser(nextUser);

    if (nextUser) {
      const nextRole = await getRoleForUser(nextUser.id);
      setRole(nextRole);
    } else {
      setRole(null);
    }

    setLoading(false);
  }

  async function refreshProfile() {
    if (!user) return;

    const nextRole = await getRoleForUser(user.id);
    setRole(nextRole);
  }

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
    setRole(null);
  }

  useEffect(() => {
    void loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      void loadSession();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      role,
      loading,
      isBusiness: role === "business",
      isCustomer: role === "customer",
      signOut,
      refreshProfile,
    }),
    [user, role, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
