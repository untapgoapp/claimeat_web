import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  CalendarDays,
  ChevronRight,
  Clock3,
  Container,
  Info,
  MapPin,
  Package,
  ShoppingBag,
  Store,
} from "lucide-react";

import { DealCategoryImage } from "@/components/deals/deal-category-image";
import { DealHeroActions } from "@/components/deals/deal-hero-actions";
import { DealLocationMap } from "@/components/deals/deal-location-map";
import { Shell } from "@/components/layout/shell";
import {
  fetchDealDetail,
  type DealDetail,
} from "@/lib/api/deal-detail";
import { formatMoney } from "@/lib/utils/format";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

type Availability = {
  available: boolean;
  label: string;
  reason: string;
};

function formatTime(
  value: string | null | undefined,
) {
  if (!value) {
    return "TBD";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "TBD";
  }

  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatDate(
  value: string | null | undefined,
) {
  if (!value) {
    return "Today";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Today";
  }

  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(date);
}

function isToday(
  value: string | null | undefined,
) {
  if (!value) {
    return false;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return false;
  }

  const today = new Date();

  return (
    date.getFullYear() ===
      today.getFullYear() &&
    date.getMonth() ===
      today.getMonth() &&
    date.getDate() ===
      today.getDate()
  );
}

function categoryLabel(
  value: string | null | undefined,
) {
  if (!value) {
    return "Surprise bag";
  }

  const labels: Record<string, string> = {
    bakery: "Bakery",
    fruit_veg: "Fruit & veg",
    grocery: "Groceries",
    ready_meal: "Ready meals",
    family_pack: "Family pack",
    mystery_bag: "Surprise bag",
  };

  return (
    labels[value] ||
    value.replaceAll("_", " ")
  );
}

function cleanDemoDescription(
  value: string | null | undefined,
) {
  if (!value) {
    return null;
  }

  return value
    .replace(/^\[DEMO\]\s*/i, "")
    .trim();
}

function getAvailability(
  deal: DealDetail,
): Availability {
  const quantityLeft = Number(
    deal.quantity_left || 0,
  );

  const status = String(
    deal.status || "",
  ).toLowerCase();

  const pickupEnd = deal.pickup_end
    ? new Date(deal.pickup_end)
    : null;

  const expired =
    pickupEnd &&
    !Number.isNaN(pickupEnd.getTime()) &&
    pickupEnd.getTime() <= Date.now();

  if (
    status === "sold_out" ||
    quantityLeft <= 0
  ) {
    return {
      available: false,
      label: "Sold out",
      reason:
        "All rescue bags have already been claimed.",
    };
  }

  if (
    status === "expired" ||
    expired
  ) {
    return {
      available: false,
      label: "Pickup ended",
      reason:
        "The collection window has already ended.",
    };
  }

  if (
    status === "cancelled" ||
    status === "draft"
  ) {
    return {
      available: false,
      label: "Unavailable",
      reason:
        "This offer is not available right now.",
    };
  }

  if (status !== "available") {
    return {
      available: false,
      label: "Unavailable",
      reason:
        "This offer cannot currently be claimed.",
    };
  }

  return {
    available: true,
    label: "Available",
    reason:
      "Ready to claim and collect.",
  };
}

function getInitials(name: string) {
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

  return `${words[0][0]}${words[1][0]}`.toUpperCase();
}

export default async function DealDetailPage({
  params,
}: PageProps) {
  const { id } = await params;

  const deal =
    await fetchDealDetail(id).catch(
      () => null,
    );

  if (!deal) {
    notFound();
  }

  const availability =
    getAvailability(deal);

  const business = deal.business;

  const storeId =
    business?.id ||
    deal.business_id;

  const storeHref =
    `/stores/${storeId}`;

  const businessName =
    business?.name ||
    "Local business";

  const address =
    business?.formatted_address ||
    business?.address ||
    business?.address_text ||
    business?.city ||
    "Pärnu";

  const city =
    business?.city ||
    "Pärnu";

  const fullAddress = [
    address,
    address?.includes(city)
      ? null
      : city,
  ]
    .filter(Boolean)
    .join(", ");

  const latitude =
    business?.latitude;

  const longitude =
    business?.longitude;

  const imageUrl =
    deal.image_url;

  const quantityLeft = Number(
    deal.quantity_left || 0,
  );

  const description =
    cleanDemoDescription(
      deal.description,
    ) ||
    "Save good food and enjoy a surprise selection prepared from what remains at the end of the day.";

  const originalPrice =
    deal.original_price;

  const pickupStart =
    deal.pickup_start;

  const pickupEnd =
    deal.pickup_end;

  const todayPickup =
    isToday(pickupStart);

  const directionsUrl =
    business?.google_maps_url ||
    (
      latitude !== null &&
      longitude !== null
        ? `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`
        : null
    );

  const isDemo =
    deal.description
      ?.trim()
      .startsWith("[DEMO]") ??
    false;

  return (
    <Shell>
      <main className="mx-auto w-full max-w-[780px] pb-40 text-[#292621] dark:text-[#fff7e8]">
        <section className="relative overflow-hidden bg-[#E8D8BE] md:mt-6 md:rounded-t-[2rem]">
          <div className="relative h-[390px] sm:h-[470px]">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={deal.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <DealCategoryImage
                category={deal.category}
                title={deal.title}
                className="h-full w-full rounded-none"
              />
            )}

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/70" />

            <DealHeroActions
              dealId={deal.id}
              title={`${deal.title} at ${businessName}`}
            />

            <div className="absolute bottom-24 left-5 flex flex-wrap gap-2 sm:left-7">
              <span className="rounded-full bg-[#FFF9C7] px-4 py-2 text-sm font-black text-[#685116] shadow-sm">
                {availability.available
                  ? `${quantityLeft} left`
                  : availability.label}
              </span>

              <span className="rounded-full bg-white/95 px-4 py-2 text-sm font-black text-[#18392B] shadow-sm backdrop-blur">
                {categoryLabel(
                  deal.category,
                )}
              </span>
            </div>

            <Link
              href={storeHref}
              className="absolute inset-x-5 bottom-5 flex items-center gap-4 text-white sm:inset-x-7"
            >
              <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-full border-4 border-white bg-[#FFFEFA] text-lg font-black text-[#18392B] shadow-lg">
                {business?.logo_url ? (
                  <img
                    src={business.logo_url}
                    alt={`${businessName} logo`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  getInitials(
                    businessName,
                  )
                )}
              </div>

              <div className="min-w-0">
                <p className="truncate text-2xl font-black tracking-tight drop-shadow-sm">
                  {businessName}
                </p>

                <p className="mt-1 flex items-center gap-1 text-sm font-bold text-white/85">
                  View business
                  <ChevronRight size={16} />
                </p>
              </div>
            </Link>
          </div>
        </section>

        <div className="bg-[#FFFEFA] dark:bg-[#171411] md:rounded-b-[2rem]">
          <section className="border-b border-black/10 px-6 py-7 dark:border-white/10 sm:px-8">
            <div className="flex gap-4">
              <ShoppingBag
                size={26}
                className="mt-1 shrink-0 text-[#18392B] dark:text-[#E1E9B8]"
              />

              <div className="min-w-0">
                <h1 className="text-2xl font-black leading-tight tracking-[-0.025em] text-[#18392B] dark:text-white sm:text-3xl">
                  {deal.title}
                </h1>

                <p className="mt-5 flex flex-wrap items-center gap-2 text-lg">
                  <Clock3
                    size={23}
                    className="shrink-0 text-[#18392B] dark:text-[#E1E9B8]"
                  />

                  <span>
                    Collect:{" "}
                    <strong>
                      {formatTime(
                        pickupStart,
                      )}{" "}
                      –{" "}
                      {formatTime(
                        pickupEnd,
                      )}
                    </strong>
                  </span>

                  <span className="rounded-full border border-black/10 bg-white px-3 py-1 text-sm font-bold text-[#45382F] dark:border-white/10 dark:bg-white/10 dark:text-white">
                    {todayPickup
                      ? "Today"
                      : formatDate(
                          pickupStart,
                        )}
                  </span>
                </p>
              </div>
            </div>
          </section>

          <Link
            href={storeHref}
            className="group flex items-center gap-4 border-b border-black/10 px-6 py-6 transition hover:bg-[#F7F3EB] dark:border-white/10 dark:hover:bg-white/5 sm:px-8"
          >
            <MapPin
              size={28}
              className="shrink-0 text-[#18706A]"
            />

            <div className="min-w-0 flex-1">
              <p className="line-clamp-2 text-lg font-semibold text-[#176862]">
                {fullAddress}
              </p>

              <p className="mt-1 text-sm text-black/50 dark:text-white/45">
                More information about the business
              </p>
            </div>

            <ChevronRight
              size={24}
              className="shrink-0 transition group-hover:translate-x-1"
            />
          </Link>

          <section className="border-b border-black/10 px-6 py-8 dark:border-white/10 sm:px-8">
            <h2 className="text-2xl font-black tracking-tight">
              About this Rescue Bag
            </h2>

            <p className="mt-3 text-lg leading-8 text-black/75 dark:text-white/70">
              {description}
            </p>

            <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-black/15 bg-white px-4 py-2.5 dark:border-white/15 dark:bg-white/5">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-[#EEF1E3] text-[#18392B]">
                <ShoppingBag size={18} />
              </div>

              <span className="font-bold">
                {categoryLabel(
                  deal.category,
                )}
              </span>
            </div>

            <div className="mt-6 flex gap-3 rounded-2xl bg-[#F4EFE6] p-4 text-sm leading-6 text-[#6B6258] dark:bg-white/5 dark:text-white/55">
              <Info
                size={20}
                className="mt-0.5 shrink-0 text-[#18706A]"
              />

              <p>
                The exact contents depend on what remains that day, but the listed original value stays the same.
              </p>
            </div>
          </section>

          <section className="border-b border-black/10 px-6 py-8 dark:border-white/10 sm:px-8">
            <h2 className="text-2xl font-black tracking-tight">
              Directions
            </h2>

            <div className="mt-5 flex items-start gap-4">
              <MapPin
                size={27}
                className="mt-1 shrink-0 text-[#18706A]"
              />

              <p className="text-lg leading-8">
                {fullAddress}
              </p>
            </div>

            {latitude !== null &&
            longitude !== null ? (
              <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-black/10 dark:border-white/10">
                <DealLocationMap
                  latitude={Number(
                    latitude,
                  )}
                  longitude={Number(
                    longitude,
                  )}
                  businessName={
                    businessName
                  }
                />
              </div>
            ) : null}

            {directionsUrl ? (
              <a
                href={directionsUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-full border-2 border-[#18706A] px-6 py-3.5 text-center font-black text-[#18706A] transition hover:bg-[#18706A] hover:text-white"
              >
                Get directions
                <ArrowRight size={18} />
              </a>
            ) : null}
          </section>

          <section className="border-b border-black/10 px-6 py-8 dark:border-white/10 sm:px-8">
            <h2 className="text-2xl font-black tracking-tight">
              Collection instructions
            </h2>

            <p className="mt-4 text-lg leading-8 text-black/75 dark:text-white/70">
              Show your pickup code to a staff member when collecting your rescue bag.
            </p>

            <div className="mt-5 flex gap-3 rounded-2xl bg-[#EEF1E3] p-4 text-[#18392B] dark:bg-white/5 dark:text-[#E1E9B8]">
              <CalendarDays
                size={22}
                className="mt-0.5 shrink-0"
              />

              <p className="text-sm font-semibold leading-6">
                Arrive between{" "}
                {formatTime(
                  pickupStart,
                )}{" "}
                and{" "}
                {formatTime(
                  pickupEnd,
                )}.
              </p>
            </div>
          </section>

          <section className="px-6 py-8 sm:px-8">
            <h2 className="text-2xl font-black tracking-tight">
              Packaging
            </h2>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="rounded-[1.25rem] border border-black/15 p-5 text-center dark:border-white/15">
                <Container
                  size={43}
                  strokeWidth={1.7}
                  className="mx-auto text-[#18706A]"
                />

                <p className="mt-4 text-base font-bold">
                  Container
                </p>

                <p className="mt-1 text-sm text-black/50 dark:text-white/45">
                  May vary
                </p>
              </div>

              <div className="rounded-[1.25rem] border border-black/15 p-5 text-center dark:border-white/15">
                <Package
                  size={43}
                  strokeWidth={1.7}
                  className="mx-auto text-[#18706A]"
                />

                <p className="mt-4 text-base font-bold">
                  Carrier bag
                </p>

                <p className="mt-1 text-sm text-black/50 dark:text-white/45">
                  Bring your own
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-start gap-3 rounded-[1.25rem] bg-[#F1F2EF] p-4 dark:bg-white/5">
              <Info
                size={21}
                className="mt-0.5 shrink-0 text-[#18706A]"
              />

              <p className="text-sm leading-6">
                We recommend bringing your own reusable bag.
              </p>
            </div>

            {isDemo ? (
              <p className="mt-8 text-xs leading-5 text-black/40 dark:text-white/35">
                This offer is illustrative and created for the ClaimEat demo. No partnership with the displayed business is implied.
              </p>
            ) : null}
          </section>
        </div>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-black/10 bg-[#FFFEFA]/95 px-5 py-4 shadow-[0_-12px_38px_rgba(0,0,0,0.10)] backdrop-blur-xl dark:border-white/10 dark:bg-[#171411]/95">
        <div className="mx-auto flex max-w-[780px] items-center justify-between gap-5">
          <div className="shrink-0">
            {originalPrice !== null ? (
              <p className="text-sm font-bold text-black/45 line-through dark:text-white/35">
                {formatMoney(
                  originalPrice,
                )}
              </p>
            ) : null}

            <p className="text-2xl font-black tracking-tight text-[#18392B] dark:text-white">
              {formatMoney(
                deal.price,
              )}
            </p>
          </div>

          {availability.available ? (
            <Link
              href={`/checkout/${deal.id}`}
              className="flex min-h-14 flex-1 items-center justify-center gap-2 rounded-full bg-[#18706A] px-7 py-4 text-center text-lg font-black text-white transition hover:bg-[#115A55] sm:max-w-[320px]"
            >
              Claim this bag
              <ArrowRight size={20} />
            </Link>
          ) : (
            <div className="flex min-h-14 flex-1 cursor-not-allowed items-center justify-center rounded-full bg-[#D8D5CE] px-7 py-4 text-center text-lg font-black text-[#78736B] sm:max-w-[320px]">
              {availability.label}
            </div>
          )}
        </div>
      </div>
    </Shell>
  );
}