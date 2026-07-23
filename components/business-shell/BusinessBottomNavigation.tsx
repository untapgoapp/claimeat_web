"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ClipboardCheck,
  LayoutDashboard,
  Store,
  Tags,
  type LucideIcon,
} from "lucide-react";

type NavigationItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

const navigationItems: NavigationItem[] = [
  {
    href: "/business",
    label: "Overview",
    icon: LayoutDashboard,
  },
  {
    href: "/business/deals",
    label: "Deals",
    icon: Tags,
  },
  {
    href: "/business/claims",
    label: "Claims",
    icon: ClipboardCheck,
  },
  {
    href: "/business/store",
    label: "Store",
    icon: Store,
  },
];

function isActive(
  pathname: string,
  href: string,
) {
  if (href === "/business") {
    return pathname === "/business";
  }

  return (
    pathname === href ||
    pathname.startsWith(`${href}/`)
  );
}

export function BusinessBottomNavigation() {
  const pathname = usePathname();

  return (
    <nav
      className="business-bottom-navigation"
      aria-label="Business navigation"
    >
      <div className="business-bottom-navigation__inner">
        {navigationItems.map(
          ({
            href,
            label,
            icon: Icon,
          }) => {
            const active = isActive(
              pathname,
              href,
            );

            return (
              <Link
                key={href}
                href={href}
                className={[
                  "business-bottom-navigation__item",
                  active
                    ? "business-bottom-navigation__item--active"
                    : "",
                ].join(" ")}
                aria-current={
                  active ? "page" : undefined
                }
              >
                <Icon
                  className="business-bottom-navigation__icon"
                  strokeWidth={
                    active ? 2.5 : 2
                  }
                  aria-hidden="true"
                />

                <span>{label}</span>
              </Link>
            );
          },
        )}
      </div>
    </nav>
  );
}
