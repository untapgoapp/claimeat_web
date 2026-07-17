"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import DealMap from "@/components/deal-map";
import type { MapDeal } from "@/lib/types";

type CategoryFilter =
  | "all"
  | "bakery"
  | "fruit_veg"
  | "ready_meal"
  | "grocery"
  | "family_pack";

type ViewMode = "map" | "list";

const filters: { value: CategoryFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "bakery", label: "Bakery" },
  { value: "fruit_veg", label: "Fruit & veg" },
  { value: "ready_meal", label: "Ready meals" },
  { value: "grocery", label: "Grocery" },
  { value: "family_pack", label: "Family" },
];

function inferCategory(deal: MapDeal): CategoryFilter {
  const value = `${deal.title} ${deal.description || ""}`.toLowerCase();

  if (value.includes("bakery") || value.includes("bread") || value.includes("pastry")) {
    return "bakery";
  }

  if (value.includes("fruit") || value.includes("veg")) {
    return "fruit_veg";
  }

  if (value.includes("meal") || value.includes("dinner") || value.includes("lunch")) {
    return "ready_meal";
  }

  if (value.includes("family")) {
    return "family_pack";
  }

  if (value.includes("grocery")) {
    return "grocery";
  }

  return "all";
}

function formatTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "TBD";

  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function getSavingPercent(deal: MapDeal) {
  if (!deal.originalPrice || deal.originalPrice <= deal.price) return 0;

  return Math.round(((deal.originalPrice - deal.price) / deal.originalPrice) * 100);
}

export function DealsMapBrowser({ deals }: { deals: MapDeal[] }) {
  const [selectedDealId, setSelectedDealId] = useState<string | null>(
    deals[0]?.id || null
  );
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("map");

  const filteredDeals = useMemo(() => {
    return deals.filter((deal) => {
      if (category === "all") return true;
      return inferCategory(deal) === category;
    });
  }, [category, deals]);

  const selectedDeal =
    filteredDeals.find((deal) => deal.id === selectedDealId) ||
    filteredDeals[0] ||
    null;

  function handleFilterChange(nextCategory: CategoryFilter) {
    setCategory(nextCategory);

    const nextDeal = deals.find((deal) => {
      if (nextCategory === "all") return true;
      return inferCategory(deal) === nextCategory;
    });

    setSelectedDealId(nextDeal?.id || null);
  }

  return (
    <div className="space-y-5">
      <section className="rounded-[1.75rem] bg-white p-5 shadow-[0_10px_30px_rgba(95,78,55,0.08)] ring-1 ring-[#DDD2C2] dark:bg-[#241f1a] dark:ring-white/10 md:p-6">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-[#6F7D43] dark:text-[#E1E9B8]">
              Food rescue map
            </p>

            <h1 className="mt-2 text-4xl font-black tracking-tight md:text-5xl">
              Find rescue bags near you.
            </h1>

            <p className="mt-3 max-w-2xl text-black/60 dark:text-white/55">
              Browse discounted food by location, pickup time, price, and
              availability.
            </p>
          </div>

          <Link
            href="/deals"
            className="rounded-2xl bg-white px-5 py-3 text-center font-black shadow-[0_10px_30px_rgba(95,78,55,0.08)] ring-1 ring-black/10 hover:bg-[#556235]/[0.02] dark:bg-[#171411] dark:ring-white/10"
          >
            View list
          </Link>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick={() => handleFilterChange(filter.value)}
              className={[
                "rounded-full px-4 py-2 text-sm font-black transition",
                category === filter.value
                  ? "bg-[#6f7d43] text-white dark:bg-[#9baa6a] dark:text-[#2F261F]"
                  : "bg-[#F4EFE6] text-black/60 hover:text-black dark:bg-[#171411] dark:text-white/55 dark:hover:text-white",
              ].join(" ")}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="mt-5 grid grid-cols-2 rounded-2xl bg-[#F4EFE6] p-1 dark:bg-[#171411] md:hidden">
          <button
            type="button"
            onClick={() => setViewMode("map")}
            className={[
              "rounded-xl px-4 py-2 text-sm font-black",
              viewMode === "map"
                ? "bg-white shadow-[0_10px_30px_rgba(95,78,55,0.08)] dark:bg-[#241f1a]"
                : "text-black/50 dark:text-white/40",
            ].join(" ")}
          >
            Map
          </button>

          <button
            type="button"
            onClick={() => setViewMode("list")}
            className={[
              "rounded-xl px-4 py-2 text-sm font-black",
              viewMode === "list"
                ? "bg-white shadow-[0_10px_30px_rgba(95,78,55,0.08)] dark:bg-[#241f1a]"
                : "text-black/50 dark:text-white/40",
            ].join(" ")}
          >
            List
          </button>
        </div>
      </section>

      {filteredDeals.length === 0 ? (
        <div className="rounded-[1.75rem] bg-white p-8 text-center shadow-[0_10px_30px_rgba(95,78,55,0.08)] ring-1 ring-[#DDD2C2] dark:bg-[#241f1a] dark:ring-white/10">
          <p className="text-2xl font-black">No deals match this filter</p>

          <p className="mt-2 text-black/55 dark:text-white/45">
            Try another category or check back later.
          </p>
        </div>
      ) : (
        <section className="grid gap-5 lg:grid-cols-[380px_1fr]">
          <div
            className={[
              "space-y-3",
              viewMode === "map" ? "hidden md:block" : "block",
            ].join(" ")}
          >
            <div className="rounded-[1.75rem] bg-white p-4 shadow-[0_10px_30px_rgba(95,78,55,0.08)] ring-1 ring-[#DDD2C2] dark:bg-[#241f1a] dark:ring-white/10">
              <div className="mb-3 flex items-center justify-between">
                <p className="font-black">
                  {filteredDeals.length} deals available
                </p>

                {selectedDeal && (
                  <p className="text-sm text-black/45 dark:text-white/35">
                    Selected: €{selectedDeal.price.toFixed(2)}
                  </p>
                )}
              </div>

              <div className="max-h-[640px] space-y-3 overflow-y-auto pr-1">
                {filteredDeals.map((deal) => (
                  <DealMapListCard
                    key={deal.id}
                    deal={deal}
                    selected={deal.id === selectedDealId}
                    onSelect={() => {
                      setSelectedDealId(deal.id);
                      setViewMode("map");
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div
            className={[
              viewMode === "list" ? "hidden md:block" : "block",
            ].join(" ")}
          >
            <DealMap
              deals={filteredDeals}
              selectedDealId={selectedDealId}
              onSelectDeal={setSelectedDealId}
              heightClassName="h-[680px]"
            />
          </div>
        </section>
      )}
    </div>
  );
}

function DealMapListCard({
  deal,
  selected,
  onSelect,
}: {
  deal: MapDeal;
  selected: boolean;
  onSelect: () => void;
}) {
  const savingPercent = getSavingPercent(deal);

  return (
    <div
      className={[
        "rounded-[1.5rem] border bg-white p-4 transition dark:bg-[#171411]",
        selected
          ? "border-[#6f7d43] shadow-[0_10px_30px_rgba(95,78,55,0.08)] dark:border-[#9baa6a]"
          : "border-[#DDD2C2] hover:border-black/15 dark:border-white/10 dark:hover:border-white/20",
      ].join(" ")}
    >
      <button
        type="button"
        onClick={onSelect}
        className="block w-full text-left"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-[#6F7D43] dark:text-[#E1E9B8]">
              {inferCategory(deal).replace("_", " ")}
            </p>

            <h2 className="mt-1 text-lg font-black leading-tight">
              {deal.title}
            </h2>

            <p className="mt-1 text-sm text-black/50 dark:text-white/40">
              {deal.businessName}
            </p>
          </div>

          <div className="rounded-full bg-[#EEF1E3] px-3 py-1 text-xs font-black text-[#6F7D43] dark:bg-[#556235] dark:text-[#E1E9B8]">
            {deal.quantityLeft} left
          </div>
        </div>

        <p className="mt-3 line-clamp-2 text-sm leading-6 text-black/60 dark:text-white/50">
          {deal.description || "Good food available for pickup today."}
        </p>

        <div className="mt-4 flex items-end justify-between">
          <div>
            <p className="text-2xl font-black text-[#6F7D43] dark:text-[#E1E9B8]">
              €{deal.price.toFixed(2)}
            </p>

            <div className="flex items-center gap-2">
              <p className="text-xs text-black/40 line-through dark:text-white/35">
                €{deal.originalPrice.toFixed(2)}
              </p>

              {savingPercent > 0 && (
                <p className="text-xs font-black text-[#b76e45]">
                  -{savingPercent}%
                </p>
              )}
            </div>
          </div>

          <div className="text-right text-xs text-black/50 dark:text-white/40">
            <p>Pickup</p>
            <p className="font-black text-black/70 dark:text-white/65">
              {formatTime(deal.pickupStart)}-{formatTime(deal.pickupEnd)}
            </p>
          </div>
        </div>

        <p className="mt-3 truncate text-xs text-black/45 dark:text-white/35">
          {deal.address}, {deal.city}
        </p>
      </button>

      <Link
        href={`/deals/${deal.id}`}
        className="mt-4 block rounded-2xl bg-[#6f7d43] px-4 py-2 text-center text-sm font-black text-white hover:bg-[#5d6d32] dark:bg-[#9baa6a] dark:text-[#2F261F]"
      >
        View deal
      </Link>
    </div>
  );
}
