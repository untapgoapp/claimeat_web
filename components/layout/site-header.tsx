"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";
import styles from "./site-header.module.css";

const customerNavLinks = [
  { href: "/deals", label: "Deals" },
  { href: "/my-claims", label: "My claims" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/for-businesses", label: "For businesses" },
];

const businessNavLinks = [
  { href: "/business", label: "Dashboard" },
  { href: "/business/deals", label: "Deals" },
  { href: "/business/deals/new", label: "Create deal" },
  { href: "/business/claims", label: "Pickups" },
  { href: "/deals", label: "Customer view" },
];

function isActive(pathname: string, search: string, href: string) {
  const view = new URLSearchParams(search).get("view");

  if (href === "/deals") {
    return pathname === "/deals" && view !== "map";
  }

  return pathname === href;
}

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, role, loading, isBusiness, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const currentSearch = searchParams.toString()
    ? `?${searchParams.toString()}`
    : "";

  function getAuthHref(mode: "login" | "signup") {
    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.set("auth", mode);

    const query = nextParams.toString();

    return query ? `${pathname}?${query}` : `${pathname}?auth=${mode}`;
  }

  const navLinks = useMemo(() => {
    return isBusiness ? businessNavLinks : customerNavLinks;
  }, [isBusiness]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname, currentSearch, role]);

  async function handleSignOut() {
    await signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <header className={styles.header}>
      <div className={styles.pill}>
        <Link href={isBusiness ? "/business" : "/"} className={styles.logoLink}>
          <img
            src="/brand/claim-eat-header-logo.png"
            className={styles.logoWordmark}
            alt="ClaimEat"
          />
        </Link>

        <div className={styles.desktopDivider} />

        <nav className={styles.nav} aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.navItem} ${
                isActive(pathname, currentSearch, link.href)
                  ? styles.navItemActive
                  : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className={styles.desktopDivider} />

        <div className={styles.actions}>
          {loading ? null : user ? (
            <>
              <span className={styles.roleBadge}>
                {isBusiness ? "Business" : "Customer"}
              </span>

              <button
                type="button"
                onClick={handleSignOut}
                className={styles.btnGhostButton}
              >
                Log out
              </button>

              {isBusiness ? (
                <Link href="/business/deals/new" className={styles.btnSolid}>
                  Create deal
                </Link>
              ) : (
                <Link href="/deals" className={styles.btnSolid}>
                  See deals
                </Link>
              )}
            </>
          ) : (
            <>
              <Link href={getAuthHref("login")} className={styles.btnGhost}>
                Log in
              </Link>

              <Link href={getAuthHref("signup")} className={styles.btnSolid}>
                Sign up
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className={styles.menuButton}
          onClick={() => setMenuOpen((value) => !value)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {menuOpen ? (
        <div className={styles.mobileMenu}>
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className={styles.mobileItem}>
              {link.label}
            </Link>
          ))}

          <div className={styles.mobileActions}>
            {user ? (
              <>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className={styles.mobileGhost}
                >
                  Log out
                </button>

                <Link
                  href={isBusiness ? "/business/deals/new" : "/deals"}
                  className={styles.mobileSolid}
                >
                  {isBusiness ? "Create deal" : "See deals"}
                </Link>
              </>
            ) : (
              <>
                <Link href={getAuthHref("login")} className={styles.mobileGhost}>
                  Log in
                </Link>

                <Link href={getAuthHref("signup")} className={styles.mobileSolid}>
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}
