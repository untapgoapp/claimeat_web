"use client";

import { X } from "lucide-react";
import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";

type AuthMode = "login" | "signup";

export function AuthModal() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const authParam = searchParams.get("auth");
  const mode: AuthMode | null =
    authParam === "signup" ? "signup" : authParam === "login" ? "login" : null;

  const open = mode !== null;

  function close() {
    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.delete("auth");

    const nextQuery = nextParams.toString();
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, {
      scroll: false,
    });
  }

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        close();
      }
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[10000]">
      <button
        type="button"
        aria-label="Close login"
        onClick={close}
        className="absolute inset-0 bg-[#6F7D43]/35 backdrop-blur-xl"
      />

      <div className="pointer-events-none relative z-10 flex min-h-screen items-center justify-center px-4 py-8">
        <div className="pointer-events-auto relative w-full max-w-md overflow-hidden rounded-[2.25rem] bg-[#FBF8F2]/95 p-6 shadow-[0_30px_100px_rgba(0,0,0,0.25)] ring-1 ring-black/10 backdrop-blur-2xl dark:bg-[#241f1a]/95 dark:ring-white/10">
          <button
            type="button"
            onClick={close}
            className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-black/[0.06] text-black/60 transition hover:bg-[#556235]/[0.1] hover:text-black dark:bg-white/10 dark:text-white/60 dark:hover:text-white"
            aria-label="Close"
          >
            <X size={17} />
          </button>

          <LoginForm initialMode={mode} onSuccess={close} />
        </div>
      </div>
    </div>
  );
}
