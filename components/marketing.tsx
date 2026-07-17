import Link from "next/link";
import type { ReactNode } from "react";

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-sm font-bold uppercase tracking-wide text-[#6F7D43] dark:text-[#E1E9B8]">
      {children}
    </p>
  );
}

export function SectionIntro({
  eyebrow,
  title,
  text,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  text?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}

      <h2 className="mt-2 text-3xl font-black tracking-tight md:text-5xl">
        {title}
      </h2>

      {text && (
        <p className="mt-4 text-lg leading-8 text-black/60 dark:text-white/55">
          {text}
        </p>
      )}
    </div>
  );
}

export function FeatureCard({
  title,
  text,
  icon,
}: {
  title: string;
  text: string;
  icon: string;
}) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-[0_10px_30px_rgba(95,78,55,0.08)] ring-1 ring-[#DDD2C2] dark:bg-[#241f1a] dark:ring-white/10">
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EEF1E3] text-2xl dark:bg-[#556235]">
        {icon}
      </div>

      <h3 className="text-xl font-black">{title}</h3>

      <p className="mt-3 text-sm leading-6 text-black/60 dark:text-white/50">
        {text}
      </p>
    </div>
  );
}

export function StepCard({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-[0_10px_30px_rgba(95,78,55,0.08)] ring-1 ring-[#DDD2C2] dark:bg-[#241f1a] dark:ring-white/10">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#6f7d43] font-black text-white dark:bg-[#9baa6a] dark:text-[#2F261F]">
        {number}
      </div>

      <h3 className="mt-5 text-xl font-black">{title}</h3>

      <p className="mt-3 text-sm leading-6 text-black/60 dark:text-white/50">
        {text}
      </p>
    </div>
  );
}

export function StatCard({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note?: string;
}) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-[0_10px_30px_rgba(95,78,55,0.08)] ring-1 ring-[#DDD2C2] dark:bg-[#241f1a] dark:ring-white/10">
      <p className="text-sm text-black/50 dark:text-white/45">{label}</p>
      <p className="mt-2 text-3xl font-black">{value}</p>
      {note && (
        <p className="mt-2 text-sm leading-6 text-black/50 dark:text-white/40">
          {note}
        </p>
      )}
    </div>
  );
}

export function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-[#F4EFE6] px-4 py-3 dark:bg-[#171411]">
      <span className="text-sm text-black/55 dark:text-white/45">{label}</span>
      <span className="font-black">{value}</span>
    </div>
  );
}

export function DemoDealPreview() {
  return (
    <div className="rounded-[1.75rem] bg-white p-5 shadow-[0_10px_30px_rgba(95,78,55,0.08)] ring-1 ring-[#DDD2C2] dark:bg-[#241f1a] dark:ring-white/10">
      <div className="overflow-hidden rounded-[1.5rem]">
        <img
          src="/brand/bakery.png"
          alt="Bakery rescue bag"
          className="h-56 w-full object-cover"
        />
      </div>

      <div className="mt-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-[#6F7D43] dark:text-[#E1E9B8]">
              Today near Pärnu
            </p>

            <h3 className="mt-1 text-2xl font-black">Bakery Rescue Bag</h3>

            <p className="mt-1 text-sm text-black/55 dark:text-white/45">
              Selver Pärnu Keskus
            </p>
          </div>

          <div className="rounded-full bg-[#EEF1E3] px-3 py-1 text-xs font-black text-[#6F7D43] dark:bg-[#556235] dark:text-[#E1E9B8]">
            3 left
          </div>
        </div>

        <p className="mt-4 text-sm leading-6 text-black/60 dark:text-white/50">
          Fresh bakery items from today, packed for pickup before closing time.
        </p>

        <div className="mt-5 flex items-end justify-between">
          <div>
            <p className="text-3xl font-black text-[#6F7D43] dark:text-[#E1E9B8]">
              €3.99
            </p>

            <p className="text-sm text-black/40 line-through dark:text-white/35">
              €9.50
            </p>
          </div>

          <div className="text-right text-sm text-black/50 dark:text-white/40">
            <p>Pickup</p>
            <p className="font-bold text-black/70 dark:text-white/65">
              18:00-20:00
            </p>
          </div>
        </div>

        <Link
          href="/deals"
          className="mt-5 block rounded-2xl bg-[#6f7d43] px-5 py-3 text-center font-bold text-white hover:bg-[#5d6d32] dark:bg-[#9baa6a] dark:text-[#2F261F]"
        >
          See live deals
        </Link>
      </div>
    </div>
  );
}

export function BusinessPilotCard() {
  return (
    <div className="rounded-[1.75rem] bg-white p-6 shadow-[0_10px_30px_rgba(95,78,55,0.08)] ring-1 ring-[#DDD2C2] dark:bg-[#241f1a] dark:ring-white/10 md:p-8">
      <Eyebrow>Pilot example</Eyebrow>

      <h3 className="mt-2 text-3xl font-black">50 active stores</h3>

      <p className="mt-3 leading-7 text-black/60 dark:text-white/55">
        A simple pilot with stores selling a few rescue bags per day can create
        meaningful recovered value without changing the store into a delivery
        operation.
      </p>

      <div className="mt-6 grid gap-3">
        <MetricRow label="Bags per store per day" value="6" />
        <MetricRow label="Average bag price" value="€4.99" />
        <MetricRow label="Monthly orders" value="7,800" />
        <MetricRow label="Recovered monthly GMV" value="~€39k" />
      </div>
    </div>
  );
}
