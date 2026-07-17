import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  ChevronRight,
  ExternalLink,
  Globe2,
  Info,
  MapPin,
  PackageCheck,
  Phone,
  ShoppingBag,
} from "lucide-react";

import { DealLocationMap } from "@/components/deals/deal-location-map";
import { Shell } from "@/components/layout/shell";
import { fetchMapBusinesses } from "@/lib/api/businesses";
import { fetchMapDeals } from "@/lib/api/deals";
import type { MapBusiness, MapDeal } from "@/lib/types";
import {
  categoryImage,
  formatMoney,
  inferMapCategory,
} from "@/lib/utils/format";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

type StoreMapDeal = MapDeal & {
  businessId?: string | null;
  business_id?: string | null;
  imageUrl?: string | null;
  image_url?: string | null;
};

type BusinessView = {
  id: string;
  name: string;
  description: string | null;
  address: string;
  city: string;
  country: string;
  latitude: number | null;
  longitude: number | null;
  logoUrl: string | null;
  verified: boolean;
  phone: string | null;
  websiteUrl: string | null;
  googleMapsUrl: string | null;
};

function toNullableNumber(value: number | string | null | undefined) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function getDealBusinessId(deal: StoreMapDeal) {
  return deal.businessId || deal.business_id || null;
}

function formatTime(value: string | null | undefined) {
  if (!value) return "TBD";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "TBD";

  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatDate(value: string | null | undefined) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(date);
}

function isToday(value: string | null | undefined) {
  if (!value) return false;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return false;

  const now = new Date();

  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

function getInitials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);

  if (words.length === 0) return "CE";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();

  return `${words[0][0]}${words[1][0]}`.toUpperCase();
}

function getDealImage(deal: StoreMapDeal) {
  const directImage = deal.imageUrl || deal.image_url;
  if (directImage) return directImage;

  const category = inferMapCategory(deal);
  return categoryImage[category] || categoryImage.grocery;
}

function isDealSoldOut(deal: StoreMapDeal) {
  const status = String(deal.status || "").toLowerCase();

  return status === "sold_out" || Number(deal.quantityLeft || 0) <= 0;
}

function getPickupLabel(deal: StoreMapDeal) {
  if (isDealSoldOut(deal)) {
    return "Sold out";
  }

  const dateLabel = isToday(deal.pickupStart)
    ? "Today"
    : formatDate(deal.pickupStart);

  return [dateLabel, `${formatTime(deal.pickupStart)} - ${formatTime(deal.pickupEnd)}`]
    .filter(Boolean)
    .join(" · ");
}

function buildFullAddress(business: BusinessView) {
  const parts: string[] = [];

  if (business.address) parts.push(business.address);
  if (business.city && !parts.join(" ").toLowerCase().includes(business.city.toLowerCase())) {
    parts.push(business.city);
  }
  if (
    business.country &&
    !parts.join(" ").toLowerCase().includes(business.country.toLowerCase())
  ) {
    parts.push(business.country);
  }

  return parts.join(", ");
}

function businessToView(business: MapBusiness): BusinessView {
  return {
    id: business.id,
    name: business.name,
    description: business.description || null,
    address: business.address || "",
    city: business.city || "Pärnu",
    country: business.country || "Estonia",
    latitude: toNullableNumber(business.latitude),
    longitude: toNullableNumber(business.longitude),
    logoUrl: business.logoUrl || null,
    verified: Boolean(business.verified),
    phone: business.phone || null,
    websiteUrl: business.websiteUrl || null,
    googleMapsUrl: business.googleMapsUrl || null,
  };
}

function fallbackBusinessFromDeal(id: string, deal: StoreMapDeal): BusinessView {
  return {
    id,
    name: deal.businessName || "Local business",
    description: null,
    address: deal.address || "",
    city: deal.city || "Pärnu",
    country: "Estonia",
    latitude: toNullableNumber(deal.latitude),
    longitude: toNullableNumber(deal.longitude),
    logoUrl: null,
    verified: false,
    phone: null,
    websiteUrl: null,
    googleMapsUrl: null,
  };
}

export default async function StorePage({ params }: PageProps) {
  const { id } = await params;
  const storeId = decodeURIComponent(id);

  const [businessesResult, dealsResult] = await Promise.all([
    fetchMapBusinesses().catch(() => []),
    fetchMapDeals().catch(() => []),
  ]);

  const allDeals = dealsResult as StoreMapDeal[];

  const storeDeals = allDeals
    .filter((deal) => getDealBusinessId(deal) === storeId)
    .filter((deal) => {
      const status = String(deal.status || "").toLowerCase();
      return status !== "draft" && status !== "cancelled";
    })
    .sort((a, b) => {
      const aSoldOut = isDealSoldOut(a);
      const bSoldOut = isDealSoldOut(b);

      if (aSoldOut !== bSoldOut) {
        return aSoldOut ? 1 : -1;
      }

      return new Date(a.pickupStart || 0).getTime() - new Date(b.pickupStart || 0).getTime();
    });

  const matchedBusiness = businessesResult.find((business) => business.id === storeId);
  const firstDeal = storeDeals[0] || null;

  if (!matchedBusiness && !firstDeal) {
    notFound();
  }

  const business = matchedBusiness
    ? businessToView(matchedBusiness)
    : fallbackBusinessFromDeal(storeId, firstDeal!);

  const availableDeals = storeDeals.filter((deal) => !isDealSoldOut(deal));

  const totalBagsAvailable = availableDeals.reduce((sum, deal) => {
    return sum + Math.max(0, Number(deal.quantityLeft || 0));
  }, 0);

  const fullAddress = buildFullAddress(business);

  const hasCoordinates =
    business.latitude !== null && business.longitude !== null;

  const directionsUrl =
    business.googleMapsUrl ||
    (hasCoordinates
      ? `https://www.google.com/maps/dir/?api=1&destination=${business.latitude},${business.longitude}`
      : null);

  return (
    <Shell>
      <main className="mx-auto w-full max-w-4xl px-4 py-6 md:px-6 md:py-8">
        <div className="overflow-hidden rounded-[2rem] bg-[#FFFEFA] shadow-[0_18px_50px_rgba(95,78,55,0.08)] ring-1 ring-black/5 dark:bg-[#171411] dark:ring-white/10">
          <header className="relative flex h-16 items-center justify-center border-b border-black/8 px-4 dark:border-white/10">
            <Link
              href="/deals"
              className="absolute left-4 inline-flex h-10 w-10 items-center justify-center rounded-full text-[#18392B] transition hover:bg-black/5 dark:text-white dark:hover:bg-white/10"
              aria-label="Back to deals"
            >
              <ArrowLeft size={22} />
            </Link>

            <p className="max-w-[70%] truncate text-lg font-black tracking-tight text-[#18392B] dark:text-white">
              {business.name}
            </p>
          </header>

          <section className="px-5 py-6 md:px-8 md:py-8">
            <div className="flex items-start gap-4">
              <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-full border border-black/10 bg-white text-2xl font-black text-[#18392B] shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-white">
                {business.logoUrl ? (
                  <img
                    src={business.logoUrl}
                    alt={`${business.name} logo`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  getInitials(business.name)
                )}
              </div>

              <div className="min-w-0 flex-1 pt-1">
                <div className="flex items-center gap-2">
                  <h1 className="truncate text-3xl font-black tracking-tight text-[#18392B] dark:text-white">
                    {business.name}
                  </h1>

                  {business.verified ? (
                    <BadgeCheck size={20} className="shrink-0 text-[#6A8A5E]" />
                  ) : null}
                </div>

                <p className="mt-1 text-lg text-black/60 dark:text-white/55">
                  {business.city}
                </p>

                {business.description ? (
                  <p className="mt-4 max-w-2xl text-base leading-7 text-black/65 dark:text-white/55">
                    {business.description}
                  </p>
                ) : null}
              </div>
            </div>
          </section>

          {fullAddress ? (
            directionsUrl ? (
              <a
                href={directionsUrl}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-4 border-t border-b border-black/8 px-5 py-5 transition hover:bg-[#F8F5EE] dark:border-white/10 dark:hover:bg-white/5 md:px-8"
              >
                <MapPin size={24} className="shrink-0 text-[#176862]" />

                <div className="min-w-0 flex-1">
                  <p className="text-xl font-semibold leading-8 text-[#176862]">
                    {fullAddress}
                  </p>
                  <p className="mt-1 text-sm text-black/45 dark:text-white/40">
                    Click to open map
                  </p>
                </div>

                <ChevronRight
                  size={24}
                  className="shrink-0 text-[#176862] transition group-hover:translate-x-1"
                />
              </a>
            ) : (
              <div className="flex items-center gap-4 border-t border-b border-black/8 px-5 py-5 dark:border-white/10 md:px-8">
                <MapPin size={24} className="shrink-0 text-[#176862]" />
                <div className="min-w-0 flex-1">
                  <p className="text-xl font-semibold leading-8 text-[#176862]">
                    {fullAddress}
                  </p>
                </div>
              </div>
            )
          ) : null}

          <section className="px-5 py-7 md:px-8">
            <div className="mb-5 flex items-center justify-between gap-4">
              <h2 className="text-2xl font-black tracking-tight text-[#292621] dark:text-white">
                Rescue offers from this business
              </h2>

              {availableDeals.length > 0 ? (
                <span className="rounded-full bg-[#EEF1E3] px-3 py-1 text-sm font-black text-[#18392B]">
                  {availableDeals.length} active
                </span>
              ) : null}
            </div>

            {storeDeals.length > 0 ? (
              <div className="divide-y divide-black/8 rounded-[1.5rem] bg-[#FCFAF5] ring-1 ring-black/5 dark:divide-white/10 dark:bg-white/[0.03] dark:ring-white/10">
                {storeDeals.map((deal) => (
                  <StoreDealRow key={deal.id} deal={deal} />
                ))}
              </div>
            ) : (
              <div className="rounded-[1.5rem] bg-[#F4EFE6] px-5 py-5 dark:bg-white/5">
                <p className="font-black text-[#18392B] dark:text-white">
                  No rescue offers right now
                </p>
                <p className="mt-2 text-sm leading-6 text-black/55 dark:text-white/45">
                  This business is still visible on ClaimEat. New offers will appear here
                  when food becomes available.
                </p>
              </div>
            )}
          </section>

          <section className="border-t border-black/8 px-5 py-7 dark:border-white/10 md:px-8">
            <h2 className="text-2xl font-black tracking-tight text-[#292621] dark:text-white">
              About
            </h2>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <BusinessStatCard
                icon={<ShoppingBag size={24} />}
                value={String(availableDeals.length)}
                label={availableDeals.length === 1 ? "Offer today" : "Offers today"}
              />
              <BusinessStatCard
                icon={<PackageCheck size={24} />}
                value={String(totalBagsAvailable)}
                label={totalBagsAvailable === 1 ? "Bag available" : "Bags available"}
              />
            </div>
          </section>

          {hasCoordinates ? (
            <section className="border-t border-black/8 px-5 py-7 dark:border-white/10 md:px-8">
              <div className="overflow-hidden rounded-[1.5rem] ring-1 ring-black/5 dark:ring-white/10">
                <a
                  href={directionsUrl || "#"}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Open directions to ${business.name}`}
                  className="block"
                >
                  <DealLocationMap
                    latitude={business.latitude!}
                    longitude={business.longitude!}
                    businessName={business.name}
                  />
                </a>
              </div>
            </section>
          ) : null}

          <section className="border-t border-black/8 px-5 py-7 dark:border-white/10 md:px-8">
            <h2 className="text-2xl font-black tracking-tight text-[#292621] dark:text-white">
              More info
            </h2>

            <div className="mt-4 overflow-hidden rounded-[1.5rem] bg-[#FCFAF5] ring-1 ring-black/5 dark:bg-white/[0.03] dark:ring-white/10">
              {business.phone ? (
                <a
                  href={`tel:${business.phone}`}
                  className="flex items-center gap-4 px-5 py-4 transition hover:bg-black/[0.02] dark:hover:bg-white/[0.03]"
                >
                  <Phone size={22} className="shrink-0 text-[#176862]" />
                  <span className="min-w-0 flex-1 text-lg">{business.phone}</span>
                  <ChevronRight size={20} className="shrink-0 text-black/35 dark:text-white/35" />
                </a>
              ) : null}

              {business.websiteUrl ? (
                <a
                  href={business.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-4 border-t border-black/8 px-5 py-4 transition hover:bg-black/[0.02] dark:border-white/10 dark:hover:bg-white/[0.03]"
                >
                  <Globe2 size={22} className="shrink-0 text-[#176862]" />
                  <span className="min-w-0 flex-1 text-lg">Visit website</span>
                  <ExternalLink size={18} className="shrink-0 text-black/35 dark:text-white/35" />
                </a>
              ) : null}

              <div className="flex items-start gap-4 border-t border-black/8 px-5 py-4 dark:border-white/10">
                <Info size={22} className="mt-0.5 shrink-0 text-[#176862]" />
                <div className="min-w-0 flex-1">
                  <p className="text-lg font-medium">
                    {business.verified ? "Verified business information" : "Business information"}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-black/45 dark:text-white/40">
                    Details are provided for this ClaimEat demo.
                  </p>
                </div>
              </div>
            </div>

            <p className="mt-6 text-xs leading-5 text-black/35 dark:text-white/30">
              Demo listings and offers are illustrative. No partnership with the displayed
              business is implied.
            </p>
          </section>
        </div>
      </main>
    </Shell>
  );
}

function StoreDealRow({ deal }: { deal: StoreMapDeal }) {
  const soldOut = isDealSoldOut(deal);
  const quantityLeft = Math.max(0, Number(deal.quantityLeft || 0));
  const image = getDealImage(deal);

  return (
    <Link
      href={`/deals/${deal.id}`}
      className={[
        "group flex items-center gap-4 px-4 py-4 transition md:px-5",
        soldOut
          ? "opacity-55"
          : "hover:bg-black/[0.02] dark:hover:bg-white/[0.03]",
      ].join(" ")}
    >
      <div className="relative h-[76px] w-[76px] shrink-0">
        <img
          src={image}
          alt=""
          className="h-full w-full rounded-full border border-black/10 object-cover dark:border-white/10"
        />

        <span
          className={[
            "absolute -bottom-1 -right-1 grid h-8 min-w-8 place-items-center rounded-full border-2 border-white px-2 text-sm font-black shadow-sm dark:border-[#171411]",
            soldOut
              ? "bg-[#ECEDE9] text-[#747874]"
              : "bg-[#FFF2A8] text-[#18392B]",
          ].join(" ")}
        >
          {soldOut ? "–" : quantityLeft}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="truncate text-xl font-black text-[#292621] dark:text-white">
          {deal.title}
        </h3>

        <p className="mt-1 truncate text-base text-black/65 dark:text-white/55">
          {getPickupLabel(deal)}
        </p>

        <p
          className={[
            "mt-1 text-2xl font-black",
            soldOut
              ? "text-black/40 dark:text-white/35 line-through"
              : "text-[#176862]",
          ].join(" ")}
        >
          {formatMoney(deal.price)}
        </p>
      </div>

      <ChevronRight
        size={22}
        className="shrink-0 text-[#176862] transition group-hover:translate-x-1"
      />
    </Link>
  );
}

function BusinessStatCard({
  icon,
  value,
  label,
}: {
  icon: ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-[1.5rem] bg-[#FCFAF5] p-5 ring-1 ring-black/5 dark:bg-white/[0.03] dark:ring-white/10">
      <div className="flex items-center gap-4">
        <div className="grid h-12 w-12 place-items-center rounded-full bg-[#DCEDE8] text-[#176862]">
          {icon}
        </div>

        <div>
          <p className="text-2xl font-black text-[#292621] dark:text-white">
            {value}
          </p>
          <p className="text-sm font-semibold text-black/55 dark:text-white/45">
            {label}
          </p>
        </div>
      </div>
    </div>
  );
}