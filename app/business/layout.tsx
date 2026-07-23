import type { ReactNode } from "react";

import { BusinessShell } from "@/components/business-shell/BusinessShell";

type BusinessLayoutProps = {
  children: ReactNode;
};

export default function BusinessLayout({
  children,
}: BusinessLayoutProps) {
  return (
    <BusinessShell>
      {children}
    </BusinessShell>
  );
}
