"use client";

import Link from "next/link";
import {
  BadgeCheck,
  ChevronRight,
  Map as MapIcon,
  MapPin,
  Store,
} from "lucide-react";
import { useMemo, useState } from "react";

import { DealCard } from "@/components/deals/deal-card";
import type {
  Deal,
  MapBusiness,
  MapDeal,
} from "@/lib/types";

type TabMode = "offers" | "businesses";

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

function getBusinessInitials(name: string) {
  const words = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 0) {
    return "CE";
  }

  if (words.length === 1) {
    return words[0]
      .slice(0, 2)
      .toUpperCase();
  }

  return `${words[0][0]}${words[1][0]}`
    .toUpperCase();
}

export function DealsExplorer({
  deals,
  businesses,
}: {
  deals: Deal[];
  mapDeals: MapDeal[];
  businesses: MapBusiness[];
  initialView?: "list";
}) {
  const [tab, setTab] =
    useState<TabMode>("offers");

  const [category, setCategory] =
    useState<CategoryFilter>("all");

  const filteredDeals = useMemo(() => {
    return deals.filter((deal) =>
      dealMatchesCategory(
        deal,
        category,
      ),
    );
  }, [category, deals]);

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-6 md:px-6 md:py-8">
      <div className="overflow-hidden rounded-[2rem] bg-[#FFFEFA] shadow-[0_18px_50px_rgba(95,78,55,0.08)] ring-1 ring-black/5 dark:bg-[#171411] dark:ring-white/10">
        <header className="border-b border-black/8 px-5 py-7 dark:border-white/10 md:px-8 md:py-8">
          <div className="flex items-start justify-between gap-5">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#6A8A5E] dark:text-[#E1E9B8]">
                Pärnu
              </p>

              <h1 className="mt-2 text-3xl font-black tracking-[-0.035em] text-[#18392B] dark:text-white sm:text-4xl">
                Food near you
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-black/55 dark:text-white/45 sm:text-base">
                Rescue good food from local businesses before it goes to waste.
              </p>
            </div>

            <Link
              href="/deals?view=map"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#18392B] px-4 py-2.5 text-sm font-black text-white transition hover:bg-[#10271D]"
            >
              <MapIcon size={17} />
              Map
            </Link>
          </div>

          <div className="mt-6 grid grid-cols-2 rounded-full bg-[#F1EEE7] p-1 dark:bg-white/5">
            <button
              type="button"
              onClick={() =>
                setTab("offers")
              }
              className={[
                "rounded-full px-5 py-2.5 text-sm font-black transition",
                tab === "offers"
                  ? "bg-[#18392B] text-white shadow-sm"
                  : "text-black/45 hover:text-[#18392B] dark:text-white/40 dark:hover:text-white",
              ].join(" ")}
            >
              Offers
            </button>

            <button
              type="button"
              onClick={() =>
                setTab("businesses")
              }
              className={[
                "rounded-full px-5 py-2.5 text-sm font-black transition",
                tab === "businesses"
                  ? "bg-[#18392B] text-white shadow-sm"
                  : "text-black/45 hover:text-[#18392B] dark:text-white/40 dark:hover:text-white",
              ].join(" ")}
            >
              Businesses
            </button>
          </div>

          {tab === "offers" ? (
            <div className="-mx-1 mt-5 flex gap-2 overflow-x-auto px-1 pb-1">
              {filters.map((filter) => (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() =>
                    setCategory(
                      filter.value,
                    )
                  }
                  className={[
                    "shrink-0 rounded-full border px-4 py-2 text-sm font-black transition",
                    category ===
                    filter.value
                      ? "border-[#6A8A5E] bg-[#6A8A5E] text-white"
                      : "border-black/10 bg-white text-black/55 hover:border-[#6A8A5E]/40 hover:text-[#18392B] dark:border-white/10 dark:bg-white/5 dark:text-white/45",
                  ].join(" ")}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          ) : null}
        </header>

        <section className="px-5 py-6 md:px-8 md:py-8">
          {tab === "offers" ? (
            <>
              <div className="mb-5 flex items-end justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black tracking-tight text-[#292621] dark:text-white">
                    Available today
                  </h2>

                  <p className="mt-1 text-sm text-black/45 dark:text-white/40">
                    {filteredDeals.length}{" "}
                    {filteredDeals.length ===
                    1
                      ? "rescue offer"
                      : "rescue offers"}
                  </p>
                </div>
              </div>

              {filteredDeals.length ===
              0 ? (
                <EmptyState title="No offers match this filter" />
              ) : (
                <div className="grid gap-5 md:grid-cols-2">
                  {filteredDeals.map(
                    (deal) => (
                      <DealCard
                        key={deal.id}
                        deal={deal}
                      />
                    ),
                  )}
                </div>
              )}
            </>
          ) : (
            <>
              <div className="mb-5">
                <h2 className="text-2xl font-black tracking-tight text-[#292621] dark:text-white">
                  Local businesses
                </h2>

                <p className="mt-1 text-sm text-black/45 dark:text-white/40">
                  {businesses.length} places
                  around Pärnu
                </p>
              </div>

              {businesses.length === 0 ? (
                <EmptyState title="No businesses are available" />
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {businesses.map(
                    (business) => (
                      <BusinessCard
                        key={business.id}
                        business={
                          business
                        }
                      />
                    ),
                  )}
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </main>
  );
}

function BusinessCard({
  business,
}: {
  business: MapBusiness;
}) {
  const address = [
    business.address,
    business.city,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <Link
      href={`/stores/${business.id}`}
      className="group flex min-h-[150px] items-center gap-4 rounded-[1.5rem] bg-[#FCFAF5] p-4 ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-[0_14px_36px_rgba(95,78,55,0.10)] dark:bg-white/[0.03] dark:ring-white/10"
    >
      <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-full border border-black/10 bg-white text-xl font-black text-[#18392B] shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-white">
        {business.logoUrl ? (
          <img
            src={business.logoUrl}
            alt={`${business.name} logo`}
            className="h-full w-full object-cover"
          />
        ) : (
          getBusinessInitials(
            business.name,
          )
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate text-xl font-black text-[#18392B] dark:text-white">
            {business.name}
          </h3>

          {business.verified ? (
            <BadgeCheck
              size={18}
              className="shrink-0 text-[#6A8A5E]"
            />
          ) : null}
        </div>

        {address ? (
          <p className="mt-2 flex gap-2 text-sm leading-5 text-black/50 dark:text-white/40">
            <MapPin
              size={15}
              className="mt-0.5 shrink-0 text-[#176862]"
            />

            <span className="line-clamp-2">
              {address}
            </span>
          </p>
        ) : null}

        <p className="mt-3 line-clamp-1 text-sm text-black/45 dark:text-white/35">
          {business.description ||
            "Local food business in the Pärnu area."}
        </p>
      </div>

      <ChevronRight
        size={22}
        className="shrink-0 text-[#176862] transition group-hover:translate-x-1"
      />
    </Link>
  );
}

function EmptyState({
  title,
}: {
  title: string;
}) {
  return (
    <div className="rounded-[1.5rem] bg-[#F4EFE6] px-6 py-8 text-center dark:bg-white/5">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#E4EAD7] text-[#18392B]">
        <Store size={22} />
      </div>

      <p className="mt-4 text-xl font-black text-[#18392B] dark:text-white">
        {title}
      </p>

      <p className="mt-2 text-sm leading-6 text-black/50 dark:text-white/40">
        Try another category or check back later.
      </p>
    </div>
  );
}