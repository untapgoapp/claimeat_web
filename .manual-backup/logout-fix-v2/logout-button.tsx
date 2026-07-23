"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useAuth } from "@/components/auth/auth-provider";

export function LogoutButton() {
  const { signOut } = useAuth();
  const router = useRouter();

  const [signingOut, setSigningOut] =
    useState(false);

  async function handleSignOut() {
    if (signingOut) {
      return;
    }

    setSigningOut(true);

    try {
      await signOut();

      router.replace("/");
      router.refresh();
    } catch (error) {
      console.error(
        "ClaimEat sign out failed:",
        error,
      );

      setSigningOut(false);
    }
  }

  return (
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
  );
}
