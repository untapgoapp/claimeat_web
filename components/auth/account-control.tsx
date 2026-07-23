"use client";

import Link from "next/link";
import { LogIn, UserRound } from "lucide-react";

import { useAuth } from "@/components/auth/auth-provider";
import { LogoutButton } from "@/components/auth/logout-button";

export function AccountControl() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="profile-account-status">
        Checking session…
      </div>
    );
  }

  if (!user) {
    return (
      <Link
        href="/login"
        className="profile-menu__link profile-account-sign-in"
      >
        <span>Sign in</span>

        <LogIn
          size={18}
          aria-hidden="true"
        />
      </Link>
    );
  }

  return (
    <>
      <div className="profile-account-identity">
        <UserRound
          size={18}
          aria-hidden="true"
        />

        <div>
          <span>Signed in as</span>

          <strong>
            {user.email || "ClaimEat user"}
          </strong>
        </div>
      </div>

      <LogoutButton />
    </>
  );
}
