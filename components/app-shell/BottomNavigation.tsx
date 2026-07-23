"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Heart,
  House,
  MapPinned,
  ShoppingBag,
  UserRound,
  type LucideIcon,
} from "lucide-react";

type NavigationItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

const navigationItems: NavigationItem[] = [
  {
    href: "/",
    label: "Home",
    icon: House,
  },
  {
    href: "/deals",
    label: "Deals",
    icon: ShoppingBag,
  },
  {
    href: "/discover",
    label: "Discover",
    icon: MapPinned,
  },
  {
    href: "/favourites",
    label: "Favourites",
    icon: Heart,
  },
  {
    href: "/profile",
    label: "Profile",
    icon: UserRound,
  },
];

function isRouteActive(
  pathname: string,
  href: string,
): boolean {
  if (href === "/") {
    return pathname === "/";
  }

  if (href === "/deals") {
    return (
      pathname === "/deals" ||
      pathname.startsWith("/deals/")
    );
  }

  return (
    pathname === href ||
    pathname.startsWith(`${href}/`)
  );
}

export default function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav
      className="bottom-navigation"
      aria-label="Main navigation"
    >
      <div className="bottom-navigation__inner">
        {navigationItems.map(
          ({
            href,
            label,
            icon: Icon,
          }) => {
            const active = isRouteActive(
              pathname,
              href,
            );

            return (
              <Link
                key={href}
                href={href}
                className={[
                  "bottom-navigation__item",
                  active
                    ? "bottom-navigation__item--active"
                    : "",
                ].join(" ")}
                aria-current={
                  active ? "page" : undefined
                }
              >
                <Icon
                  className="bottom-navigation__icon"
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
