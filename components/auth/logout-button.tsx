"use client";

import { LogOut } from "lucide-react";
import { useState } from "react";

import { useAuth } from "@/components/auth/auth-provider";

export function LogoutButton() {
  const { signOut } = useAuth();

  const [signingOut, setSigningOut] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);

  async function handleSignOut() {
    if (signingOut) {
      return;
    }

    setSigningOut(true);
    setErrorMessage(null);

    try {
      await signOut();

      /*
       * Recreate the complete app from
       * an empty Supabase session.
       */
      window.location.replace("/");
    } catch (error) {
      console.error(
        "ClaimEat sign out failed:",
        error,
      );

      setErrorMessage(
        "Could not log out. Please try again.",
      );

      setSigningOut(false);
    }
  }

  return (
    <div className="w-full">
      <button
        type="button"
        className="profile-logout-button"
        onClick={handleSignOut}
        disabled={signingOut}
      >
        <span>
          {signingOut
            ? "Signing out…"
            : "Log out"}
        </span>

        <LogOut
          size={18}
          aria-hidden="true"
        />
      </button>

      {errorMessage ? (
        <p
          role="alert"
          className="px-4 pb-3 text-sm text-[#9A543B]"
        >
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
