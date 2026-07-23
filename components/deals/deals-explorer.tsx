"use client";

import {
  Check,
  ChevronDown,
  MapPin,
  Store,
  X,
} from "lucide-react";
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

  const [
    locationPickerOpen,
    setLocationPickerOpen,
  ] = useState(false);

  const filteredDeals = useMemo(() => {
    return deals.filter((deal) =>
      dealMatchesCategory(
        deal,
        category,
      ),
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
          <button
            type="button"
            onClick={() =>
              setLocationPickerOpen(true)
            }
            className="flex w-full items-center gap-3 rounded-[1.15rem] bg-white px-3.5 py-3 text-left shadow-[0_5px_18px_rgba(37,39,31,0.06)] ring-1 ring-black/[0.06] transition active:scale-[0.99] dark:bg-white/[0.05] dark:ring-white/10"
            aria-haspopup="dialog"
            aria-expanded={
              locationPickerOpen
            }
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#E4F3DF] text-[#176862]">
              <MapPin
                size={21}
                strokeWidth={2.4}
                aria-hidden="true"
              />
            </span>

            <span className="min-w-0 flex-1">
              <span className="block text-[10px] font-black uppercase tracking-[0.15em] text-black/40 dark:text-white/40">
                Location
              </span>

              <span className="mt-0.5 block truncate text-base font-black text-[#292621] dark:text-white">
                Pärnu
              </span>
            </span>

            <ChevronDown
              size={20}
              className="shrink-0 text-black/55 dark:text-white/55"
              aria-hidden="true"
            />
          </button>
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
                    setCategory(
                      filter.value,
                    )
                  }
                  className={[
                    "min-h-10 shrink-0 whitespace-nowrap rounded-full border px-4 text-sm font-black transition active:scale-[0.97]",
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
        <div className="mb-4">
          <h1 className="text-[1.4rem] font-black leading-tight tracking-[-0.035em] text-[#292621] dark:text-white">
            Available today
          </h1>

          <p className="mt-1 text-sm text-black/45 dark:text-white/40">
            {filteredDeals.length}{" "}
            {filteredDeals.length === 1
              ? "rescue offer"
              : "rescue offers"}
          </p>
        </div>

        {filteredDeals.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
            {filteredDeals.map((deal) => (
              <DealCard
                key={deal.id}
                deal={deal}
              />
            ))}
          </div>
        )}
      </div>

      {locationPickerOpen ? (
        <div
          className="fixed inset-0 z-[2147483500]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="location-picker-title"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/35 backdrop-blur-[2px]"
            onClick={() =>
              setLocationPickerOpen(false)
            }
            aria-label="Close location selector"
          />

          <div
            className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-lg rounded-t-[2rem] bg-[#FBFAF6] px-4 pb-6 pt-4 shadow-[0_-20px_60px_rgba(0,0,0,0.2)] dark:bg-[#211D19]"
            style={{
              paddingBottom:
                "max(24px, env(safe-area-inset-bottom))",
            }}
          >
            <div className="mx-auto mb-4 h-1.5 w-11 rounded-full bg-black/15 dark:bg-white/20" />

            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.15em] text-[#6A8A5E]">
                  Discover nearby
                </p>

                <h2
                  id="location-picker-title"
                  className="mt-1 text-2xl font-black tracking-[-0.04em] text-[#292621] dark:text-white"
                >
                  Choose your location
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setLocationPickerOpen(
                    false,
                  )
                }
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-[#292621] ring-1 ring-black/[0.06] dark:bg-white/10 dark:text-white dark:ring-white/10"
                aria-label="Close"
              >
                <X
                  size={19}
                  aria-hidden="true"
                />
              </button>
            </div>

            <button
              type="button"
              onClick={() =>
                setLocationPickerOpen(false)
              }
              className="mt-6 flex w-full items-center gap-3 rounded-[1.25rem] bg-white p-4 text-left ring-1 ring-black/[0.07] dark:bg-white/[0.06] dark:ring-white/10"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#E4F3DF] text-[#176862]">
                <MapPin
                  size={21}
                  aria-hidden="true"
                />
              </span>

              <span className="min-w-0 flex-1">
                <span className="block text-base font-black text-[#292621] dark:text-white">
                  Pärnu
                </span>

                <span className="mt-0.5 block text-sm text-black/45 dark:text-white/40">
                  Current ClaimEat pilot area
                </span>
              </span>

              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#6A8A5E] text-white">
                <Check
                  size={16}
                  strokeWidth={3}
                  aria-hidden="true"
                />
              </span>
            </button>

            <p className="mt-5 text-center text-sm leading-6 text-black/40 dark:text-white/35">
              More cities will appear here as
              ClaimEat expands.
            </p>
          </div>
        </div>
      ) : null}
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
