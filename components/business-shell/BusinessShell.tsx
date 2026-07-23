"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import { BusinessBottomNavigation } from "@/components/business-shell/BusinessBottomNavigation";
import { BusinessHeader } from "@/components/business-shell/BusinessHeader";

type BusinessShellProps = {
  children: ReactNode;
};

function shouldHideNavigation(
  pathname: string,
) {
  return (
    pathname === "/business/create" ||
    pathname === "/business/deals/new" ||
    pathname.endsWith("/edit")
  );
}

export function BusinessShell({
  children,
}: BusinessShellProps) {
  const pathname = usePathname();

  const hideNavigation =
    shouldHideNavigation(pathname);

  return (
    <div className="business-app-shell">
      <BusinessHeader />

      <main
        className={[
          "business-app-content",
          hideNavigation
            ? "business-app-content--form"
            : "",
        ].join(" ")}
      >
        {children}
      </main>

      {!hideNavigation ? (
        <BusinessBottomNavigation />
      ) : null}
    </div>
  );
}
