"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowLeft,
  BriefcaseBusiness,
  Plus,
  Smartphone,
} from "lucide-react";

function isFormRoute(pathname: string) {
  return (
    pathname === "/business/create" ||
    pathname === "/business/deals/new" ||
    pathname.endsWith("/edit")
  );
}

export function BusinessHeader() {
  const pathname = usePathname();
  const formRoute = isFormRoute(pathname);

  if (formRoute) {
    return (
      <header className="business-header">
        <div className="business-header__inner">
          <Link
            href="/business/deals"
            className="business-header__back"
          >
            <ArrowLeft
              size={20}
              aria-hidden="true"
            />

            <span>Create deal</span>
          </Link>
        </div>
      </header>
    );
  }

  return (
    <header className="business-header">
      <div className="business-header__inner">
        <Link
          href="/business"
          className="business-header__brand"
        >
          <span className="business-header__brand-icon">
            <BriefcaseBusiness
              size={19}
              aria-hidden="true"
            />
          </span>

          <span>
            <small>ClaimEat</small>
            <strong>Business</strong>
          </span>
        </Link>

        <div className="business-header__actions">
          <Link
            href="/deals"
            className="business-header__icon-button"
            aria-label="Open customer app"
            title="Open customer app"
          >
            <Smartphone
              size={19}
              aria-hidden="true"
            />
          </Link>

          <Link
            href="/business/deals/new"
            className="business-header__create"
          >
            <Plus
              size={19}
              strokeWidth={2.7}
              aria-hidden="true"
            />

            <span>New deal</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
