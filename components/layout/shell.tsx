import { Suspense } from "react";
import { PropsWithChildren } from "react";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export function Shell({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-[#F4EFE6] text-[#2F261F] dark:bg-[#171411] dark:text-[#fff7e8]">
      <Suspense fallback={<div className="h-20" />}>
        <Suspense fallback={<div className="h-20" />}>
        <SiteHeader />
      </Suspense>
      </Suspense>
      <main className="mx-auto max-w-6xl px-4 pb-6 pt-24">{children}</main>
      <SiteFooter />
    </div>
  );
}
