export function InfoTile({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[1.25rem] bg-[#F4EFE6] p-4 dark:bg-[#171411]">
      <p className="text-xs font-black uppercase tracking-wide text-black/35 dark:text-white/30">
        {label}
      </p>
      <p className="mt-1 font-black">{value}</p>
    </div>
  );
}
