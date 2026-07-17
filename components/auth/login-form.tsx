"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";

type Mode = "login" | "signup";

export function LoginForm({
  initialMode = "login",
  onSuccess,
}: {
  initialMode?: Mode;
  onSuccess?: () => void;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<Mode>(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage(null);

    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              role: "customer",
            },
          },
        });

        if (error) throw error;

        if (data.user) {
          await supabase.from("profiles").upsert({
            id: data.user.id,
            role: "customer",
          });
        }
      }

      const { data } = await supabase.auth.getUser();
      const user = data.user;

      if (!user) {
        setMessage("Check your email to confirm your account.");
        return;
      }

      const profile = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

      const role = profile.data?.role;

      const redirect = searchParams.get("redirect");
      const safeRedirect =
        redirect && redirect.startsWith("/") && !redirect.startsWith("//")
          ? redirect
          : null;

      onSuccess?.();
      router.refresh();

      if (safeRedirect) {
        router.push(safeRedirect);
      } else if (role === "business") {
        router.push("/business");
      } else {
        router.push("/deals");
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not sign in.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <p className="text-sm font-black uppercase tracking-wide text-[#6F7D43] dark:text-[#E1E9B8]">
          ClaimEat
        </p>

        <h1 className="mt-2 text-3xl font-black tracking-tight">
          {mode === "login" ? "Welcome back" : "Create account"}
        </h1>

        <p className="mt-2 text-sm leading-6 text-black/55 dark:text-white/45">
          Claim discounted food nearby and pick it up before it goes to waste.
        </p>

        {mode === "signup" ? (
          <p className="mt-3 rounded-2xl bg-[#F4EFE6] p-3 text-sm font-semibold leading-6 text-black/55 dark:bg-[#171411] dark:text-white/45">
            Business accounts are approved manually. Create a customer account
            first, then contact ClaimEat to activate business access.
          </p>
        ) : null}
      </div>

      <GoogleSignInButton mode={mode} onSuccess={onSuccess} />

      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-black/10 dark:bg-white/10" />
        <span className="text-xs font-black uppercase tracking-wide text-black/35 dark:text-white/30">
          or
        </span>
        <div className="h-px flex-1 bg-black/10 dark:bg-white/10" />
      </div>

      <div className="mb-5 grid grid-cols-2 rounded-full bg-[#F4EFE6] p-1 dark:bg-[#171411]">
        <button
          type="button"
          onClick={() => setMode("login")}
          className={[
            "rounded-full px-4 py-2 text-sm font-black transition",
            mode === "login"
              ? "bg-[#6F7D43] text-white dark:bg-[#9baa6a] dark:text-[#2F261F]"
              : "text-black/50 dark:text-white/45",
          ].join(" ")}
        >
          Log in
        </button>

        <button
          type="button"
          onClick={() => setMode("signup")}
          className={[
            "rounded-full px-4 py-2 text-sm font-black transition",
            mode === "signup"
              ? "bg-[#6F7D43] text-white dark:bg-[#9baa6a] dark:text-[#2F261F]"
              : "text-black/50 dark:text-white/45",
          ].join(" ")}
        >
          Sign up
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="grid gap-2">
          <span className="text-sm font-black">Email</span>
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            required
            className="rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none focus:border-[#6f7d43] dark:border-white/10 dark:bg-[#171411]"
            placeholder="you@example.com"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-black">Password</span>
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            required
            minLength={6}
            className="rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none focus:border-[#6f7d43] dark:border-white/10 dark:bg-[#171411]"
            placeholder="••••••••"
          />
        </label>

        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-full bg-[#6F7D43] px-5 py-3 font-black text-white transition hover:bg-[#556235] disabled:opacity-60 dark:bg-[#9baa6a] dark:text-[#2F261F]"
        >
          {busy
            ? "Please wait..."
            : mode === "login"
              ? "Log in"
              : "Create account"}
        </button>
      </form>

      {message ? (
        <p className="mt-4 rounded-2xl bg-[#F4EFE6] p-3 text-sm text-black/60 dark:bg-[#171411] dark:text-white/50">
          {message}
        </p>
      ) : null}
    </div>
  );
}
