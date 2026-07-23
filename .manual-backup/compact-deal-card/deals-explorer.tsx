"use client";

import { MapPin, Store } from "lucide-react";
import { useMemo, useState } from "react";

import { DealCard } from "@/components/deals/deal-card";
import type { Deal } from "@/lib/types";

type CategoryFilter =
  | "all"
  | "bakery"
  | "fruit_veg"
  | "ready_meal"
  | "grocery"
  | "family_pack";

const filters: {
  value: CategoryFilter;
  label: string;
}[] = [
  {
    value: "all",
    label: "All",
  },
  {
    value: "bakery",
    label: "Bakery",
  },
  {
    value: "fruit_veg",
    label: "Fruit & veg",
  },
  {
    value: "ready_meal",
    label: "Ready meals",
  },
  {
    value: "grocery",
    label: "Grocery",
  },
  {
    value: "family_pack",
    label: "Family",
  },
];

function dealMatchesCategory(
  deal: Deal,
  category: CategoryFilter,
) {
  if (category === "all") {
    return true;
  }

  return deal.category === category;
}

export function DealsExplorer({
  deals,
}: {
  deals: Deal[];
}) {
  const [category, setCategory] =
    useState<CategoryFilter>("all");

  const filteredDeals = useMemo(() => {
    return deals.filter((deal) =>
      dealMatchesCategory(deal, category),
    );
  }, [category, deals]);

  return (
    <section className="min-h-full w-full overflow-x-hidden bg-[#FBFAF6] text-[#18392B] dark:bg-[#171411] dark:text-white">
      <header className="sticky top-0 z-30 border-b border-black/[0.06] bg-[#FBFAF6]/95 backdrop-blur-xl dark:border-white/10 dark:bg-[#171411]/95">
        <div
          className="mx-auto w-full max-w-2xl px-4 pb-4"
          style={{
            paddingTop:
              "max(14px, env(safe-area-inset-top))",
          }}
        >
          <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-[0.16em] text-[#6A8A5E] dark:text-[#E1E9B8]">
            <MapPin
              size={14}
              strokeWidth={2.6}
              aria-hidden="true"
            />

            <span>Pärnu</span>
          </div>

          <h1 className="mt-2 text-[2rem] font-black leading-none tracking-[-0.045em] text-[#18392B] dark:text-white">
            Deals
          </h1>

          <p className="mt-2 max-w-sm text-sm leading-5 text-black/50 dark:text-white/45">
            Good food nearby, ready to be rescued.
          </p>
        </div>

        <div className="mx-auto w-full max-w-2xl">
          <div className="flex gap-2 overflow-x-auto px-4 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {filters.map((filter) => {
              const active =
                category === filter.value;

              return (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() =>
                    setCategory(filter.value)
                  }
                  className={[
                    "min-h-10 shrink-0 rounded-full border px-4 text-sm font-black transition active:scale-[0.97]",
                    active
                      ? "border-[#6A8A5E] bg-[#6A8A5E] text-white"
                      : "border-black/10 bg-white text-black/55 hover:border-[#6A8A5E]/40 hover:text-[#18392B] dark:border-white/10 dark:bg-white/5 dark:text-white/50",
                  ].join(" ")}
                  aria-pressed={active}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-2xl px-4 py-5">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-[1.4rem] font-black leading-tight tracking-[-0.035em] text-[#292621] dark:text-white">
              Available today
            </h2>

            <p className="mt-1 text-sm text-black/45 dark:text-white/40">
              {filteredDeals.length}{" "}
              {filteredDeals.length === 1
                ? "rescue offer"
                : "rescue offers"}
            </p>
          </div>
        </div>

        {filteredDeals.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {filteredDeals.map((deal) => (
              <DealCard
                key={deal.id}
                deal={deal}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function EmptyState() {
  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center rounded-[1.5rem] bg-white px-6 py-10 text-center ring-1 ring-black/5 dark:bg-white/[0.04] dark:ring-white/10">
      <div className="grid h-14 w-14 place-items-center rounded-full bg-[#E4EAD7] text-[#18392B]">
        <Store
          size={24}
          aria-hidden="true"
        />
      </div>

      <h2 className="mt-5 text-xl font-black tracking-tight text-[#18392B] dark:text-white">
        No offers match this filter
      </h2>

      <p className="mt-2 max-w-xs text-sm leading-6 text-black/50 dark:text-white/40">
        Try another category or check back later.
      </p>
    </div>
  );
}
