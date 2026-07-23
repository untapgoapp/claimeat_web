import type { ReactNode } from "react";

import AppShell from "../../components/app-shell/AppShell";

type MyClaimsLayoutProps = {
  children: ReactNode;
};

export default function MyClaimsLayout({
  children,
}: MyClaimsLayoutProps) {
  return <AppShell>{children}</AppShell>;
}
