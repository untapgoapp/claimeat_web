import type { ReactNode } from "react";

type StatusTone = "good" | "warning" | "danger" | "muted" | "dark";

const toneClasses: Record<StatusTone, string> = {
  good: "bg-[#EEF1E3] text-[#6F7D43] dark:bg-[#556235] dark:text-[#E1E9B8]",
  warning: "bg-[#fff6df] text-[#74501f]",
  danger: "bg-[#fff0ea] text-[#8a3a20]",
  muted: "bg-black/[0.055] text-black/45 dark:bg-white/10 dark:text-white/35",
  dark: "bg-[#6F7D43] text-white dark:bg-[#9baa6a] dark:text-[#2F261F]",
};

export function StatusPill({
  children,
  tone = "muted",
  icon,
}: {
  children: ReactNode;
  tone?: StatusTone;
  icon?: ReactNode;
}) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-black uppercase tracking-wide",
        toneClasses[tone],
      ].join(" ")}
    >
      {icon}
      {children}
    </span>
  );
}
