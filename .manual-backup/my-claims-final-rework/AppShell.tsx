import type { ReactNode } from "react";

import ServiceWorkerRegistration from "../pwa/ServiceWorkerRegistration";
import BottomNavigation from "./BottomNavigation";

type AppShellProps = {
  children: ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="claim-app-shell">
      <ServiceWorkerRegistration />

      <main className="claim-app-content">{children}</main>

      <BottomNavigation />
    </div>
  );
}
