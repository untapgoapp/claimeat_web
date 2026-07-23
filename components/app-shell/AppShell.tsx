import type { ReactNode } from "react";

import ServiceWorkerRegistration from "../pwa/ServiceWorkerRegistration";
import BottomNavigation from "./BottomNavigation";

type AppShellProps = {
  children: ReactNode;
  wide?: boolean;
};

export default function AppShell({
  children,
  wide = false,
}: AppShellProps) {
  return (
    <div
      className={[
        "claim-app-shell",
        wide ? "claim-app-shell--wide" : "",
      ].join(" ")}
    >
      <ServiceWorkerRegistration />

      <main
        className={[
          "claim-app-content",
          wide ? "claim-app-content--wide" : "",
        ].join(" ")}
      >
        {children}
      </main>

      <BottomNavigation />
    </div>
  );
}
