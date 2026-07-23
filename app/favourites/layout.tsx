import type { ReactNode } from "react";

import AppShell from "../../components/app-shell/AppShell";

type AppRouteLayoutProps = {
  children: ReactNode;
};

export default function AppRouteLayout({
  children,
}: AppRouteLayoutProps) {
  return <AppShell>{children}</AppShell>;
}
