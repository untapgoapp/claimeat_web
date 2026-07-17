export function MetricCard({
  label,
  value,
  dark = false,
}: {
  label: string;
  value: string;
  dark?: boolean;
}) {
  return (
    <div
      className={[
        "rounded-[1.5rem] p-4",
        dark
          ? "bg-white/10 text-white backdrop-blur"
          : "bg-[#F4EFE6] text-[#2F261F] dark:bg-[#171411] dark:text-white",
      ].join(" ")}
    >
      <p
        className={[
          "text-xs font-black uppercase tracking-wide",
          dark ? "text-white/42" : "text-black/35 dark:text-white/30",
        ].join(" ")}
      >
        {label}
      </p>

      <p className="mt-2 text-3xl font-black tracking-tight">{value}</p>
    </div>
  );
}
