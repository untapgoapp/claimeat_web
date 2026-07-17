import Link from "next/link";
import type { ReactNode } from "react";

export function SectionPanel({
  kicker,
  title,
  actionHref,
  actionLabel,
  children,
}: {
  kicker?: string;
  title: string;
  actionHref?: string;
  actionLabel?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[1.75rem] bg-white p-5 shadow-[0_10px_30px_rgba(95,78,55,0.08)] ring-1 ring-[#DDD2C2] dark:bg-[#241f1a] dark:ring-white/10 md:p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          {kicker ? (
            <p className="text-sm font-black uppercase tracking-wide text-[#6F7D43] dark:text-[#E1E9B8]">
              {kicker}
            </p>
          ) : null}

          <h2 className="mt-1 text-3xl font-black tracking-tight">{title}</h2>
        </div>

        {actionHref && actionLabel ? (
          <Link
            href={actionHref}
            className="rounded-full bg-[#F4EFE6] px-4 py-2 text-sm font-black text-[#6F7D43] transition hover:bg-[#EEF1E3] dark:bg-[#171411] dark:text-[#E1E9B8]"
          >
            {actionLabel}
          </Link>
        ) : null}
      </div>

      <div className="mt-5">{children}</div>
    </section>
  );
}
