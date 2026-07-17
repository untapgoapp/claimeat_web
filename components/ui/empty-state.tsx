import type { ReactNode } from "react";

export function EmptyState({
  icon,
  title,
  text,
  action,
}: {
  icon?: ReactNode;
  title: string;
  text?: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-[1.5rem] bg-[#F4EFE6] p-8 text-center dark:bg-[#171411]">
      {icon ? (
        <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-[#EEF1E3] text-[#6F7D43] dark:bg-[#556235] dark:text-[#E1E9B8]">
          {icon}
        </div>
      ) : null}

      <p className="text-xl font-black">{title}</p>

      {text ? (
        <p className="mt-2 text-sm text-black/50 dark:text-white/40">
          {text}
        </p>
      ) : null}

      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
