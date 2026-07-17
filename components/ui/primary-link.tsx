import Link from "next/link";
import type { ReactNode } from "react";

export function PrimaryLink({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "soft";
}) {
  return (
    <Link
      href={href}
      className={[
        "inline-flex items-center justify-center rounded-2xl px-6 py-4 font-black transition",
        variant === "primary"
          ? "bg-[#6F7D43] text-white hover:bg-[#556235] dark:bg-[#9baa6a] dark:text-[#2F261F]"
          : "bg-[#F4EFE6] text-[#6F7D43] hover:bg-[#EEF1E3] dark:bg-[#171411] dark:text-[#E1E9B8]",
      ].join(" ")}
    >
      {children}
    </Link>
  );
}
