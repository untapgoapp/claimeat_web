"use client";

import {
  LoaderCircle,
  LockKeyhole,
} from "lucide-react";
import {
  usePathname,
  useRouter,
} from "next/navigation";
import {
  useEffect,
  type PropsWithChildren,
} from "react";

import { useAuth } from "@/components/auth/auth-provider";

const PUBLIC_PATHS = new Set([
  "/",
  "/login",
  "/offline",
  "/forgot-password",
  "/reset-password",
]);

function isPublicPath(pathname: string) {
  if (PUBLIC_PATHS.has(pathname)) {
    return true;
  }

  /*
   * Authentication callbacks must remain
   * public so Supabase can complete login.
   */
  return pathname.startsWith("/auth/");
}

function getSafeNextPath() {
  if (typeof window === "undefined") {
    return "/deals";
  }

  const searchParams = new URLSearchParams(
    window.location.search,
  );

  const requestedPath =
    searchParams.get("next");

  if (
    !requestedPath ||
    !requestedPath.startsWith("/") ||
    requestedPath.startsWith("//") ||
    requestedPath.startsWith("/login")
  ) {
    return "/deals";
  }

  return requestedPath;
}

function getCurrentDestination(
  pathname: string,
) {
  if (typeof window === "undefined") {
    return pathname;
  }

  return `${pathname}${window.location.search}`;
}

export function RouteAccessGate({
  children,
}: PropsWithChildren) {
  const pathname = usePathname();
  const router = useRouter();

  const {
    user,
    loading,
  } = useAuth();

  const publicPath =
    isPublicPath(pathname);

  useEffect(() => {
    if (loading) {
      return;
    }

    /*
     * A logged-in user opening /login is
     * returned to the requested route.
     */
    if (
      pathname === "/login" &&
      user
    ) {
      router.replace(
        getSafeNextPath(),
      );

      return;
    }

    /*
     * Every non-public route requires an
     * authenticated Supabase user.
     */
    if (!publicPath && !user) {
      const destination =
        getCurrentDestination(pathname);

      router.replace(
        `/login?next=${encodeURIComponent(
          destination,
        )}`,
      );
    }
  }, [
    loading,
    pathname,
    publicPath,
    router,
    user,
  ]);

  /*
   * The landing and other explicitly public
   * routes render normally.
   */
  if (publicPath) {
    if (
      pathname === "/login" &&
      !loading &&
      user
    ) {
      return <AccessLoading />;
    }

    return <>{children}</>;
  }

  /*
   * Never flash protected page content while
   * Supabase checks or redirects the session.
   */
  if (loading || !user) {
    return <AccessLoading />;
  }

  return <>{children}</>;
}

function AccessLoading() {
  return (
    <main className="grid min-h-[100dvh] place-items-center bg-[#F5F2EB] px-6">
      <div className="text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-[1.35rem] bg-[#18392B] text-white shadow-[0_14px_36px_rgba(24,57,43,0.22)]">
          <LockKeyhole
            size={27}
            aria-hidden="true"
          />
        </span>

        <LoaderCircle
          size={22}
          className="mx-auto mt-5 animate-spin text-[#6F7D43]"
          aria-hidden="true"
        />

        <p className="mt-3 text-sm font-black text-[#18392B]">
          Checking your session…
        </p>
      </div>
    </main>
  );
}
