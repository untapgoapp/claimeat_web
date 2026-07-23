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

export type UserRole =
  | "customer"
  | "business";

type AuthContextValue = {
  user: User | null;
  role: UserRole | null;
  loading: boolean;
  isBusiness: boolean;
  isCustomer: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext =
  createContext<AuthContextValue | null>(
    null,
  );

async function getRoleForUser(
  userId: string,
): Promise<UserRole> {
  const profileResponse = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();

  const profileRole =
    profileResponse.data?.role;

  if (profileRole === "business") {
    return "business";
  }

  if (profileRole === "customer") {
    return "customer";
  }

  const businessUserResponse =
    await supabase
      .from("business_users")
      .select("id")
      .eq("user_id", userId)
      .limit(1);

  if (
    (businessUserResponse.data || [])
      .length > 0
  ) {
    return "business";
  }

  return "customer";
}

export function AuthProvider({
  children,
}: PropsWithChildren) {
  const [user, setUser] =
    useState<User | null>(null);

  const [role, setRole] =
    useState<UserRole | null>(null);

  const [loading, setLoading] =
    useState(true);

  /*
   * Supabase sends INITIAL_SESSION,
   * SIGNED_IN and SIGNED_OUT here.
   *
   * Use the supplied session directly.
   * Do not call getUser() again inside
   * the auth event callback.
   */
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (event, session) => {
        const nextUser =
          session?.user ?? null;

        setUser(nextUser);
        setLoading(false);

        if (
          event === "SIGNED_OUT" ||
          !nextUser
        ) {
          setRole(null);
        }
      },
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  /*
   * Load the profile separately from
   * the auth event callback.
   */
  useEffect(() => {
    let cancelled = false;

    if (!user) {
      setRole(null);
      return;
    }

    void getRoleForUser(user.id)
      .then((nextRole) => {
        if (!cancelled) {
          setRole(nextRole);
        }
      })
      .catch((error: unknown) => {
        console.error(
          "Could not load user role:",
          error,
        );

        if (!cancelled) {
          setRole("customer");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [user]);

  async function refreshProfile() {
    if (!user) {
      setRole(null);
      return;
    }

    const nextRole =
      await getRoleForUser(user.id);

    setRole(nextRole);
  }

  async function signOut() {
    const { error } =
      await supabase.auth.signOut({
        scope: "local",
      });

    if (error) {
      console.error(
        "Supabase sign out failed:",
        error,
      );

      throw error;
    }

    /*
     * Update immediately instead of
     * waiting for React to process the
     * SIGNED_OUT event.
     */
    setUser(null);
    setRole(null);
    setLoading(false);
  }

  const value =
    useMemo<AuthContextValue>(
      () => ({
        user,
        role,
        loading,
        isBusiness:
          role === "business",
        isCustomer:
          role === "customer",
        signOut,
        refreshProfile,
      }),
      [user, role, loading],
    );

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider",
    );
  }

  return context;
}
