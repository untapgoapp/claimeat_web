"use client";

import Link from "next/link";
import {
  ArrowRight,
  CircleAlert,
  Clock3,
  PackageCheck,
  Plus,
  QrCode,
  RefreshCw,
  ShoppingBag,
  Store,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  fetchBusinessDashboard,
  type BusinessDashboard,
  type BusinessDashboardClaim,
  type BusinessDashboardDeal,
} from "@/lib/api/business-dashboard";
import { formatMoney } from "@/lib/utils/format";

function formatDateTime(
  value: string | null,
) {
  if (!value) {
    return "Date unavailable";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat(
    "en-GB",
    {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    },
  ).format(date);
}

function formatTime(
  value: string | null,
) {
  if (!value) {
    return "TBD";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "TBD";
  }

  return new Intl.DateTimeFormat(
    "en-GB",
    {
      hour: "2-digit",
      minute: "2-digit",
    },
  ).format(date);
}

function getPickupWindow(
  deal: BusinessDashboardDeal,
) {
  if (
    !deal.pickup_start ||
    !deal.pickup_end
  ) {
    return "Pickup time TBD";
  }

  return `${formatTime(
    deal.pickup_start,
  )}–${formatTime(deal.pickup_end)}`;
}

function getClaimCode(
  claim: BusinessDashboardClaim,
) {
  return (
    claim.pickup_code ||
    claim.code ||
    claim.qr_code ||
    "—"
  );
}

function isClaimCollected(
  claim: BusinessDashboardClaim,
) {
  return (
    claim.claim_status === "picked_up" ||
    claim.claim_status === "collected" ||
    Boolean(
      claim.picked_up_at ||
        claim.collected_at,
    )
  );
}

function formatLabel(value: string) {
  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase(),
    );
}

export function BusinessDashboardView() {
  const [dashboard, setDashboard] =
    useState<BusinessDashboard | null>(
      null,
    );

  const [busy, setBusy] =
    useState(false);

  const [message, setMessage] =
    useState<string | null>(null);

  const mainBusiness =
    dashboard?.businesses[0] || null;

  const recentPaidClaims =
    useMemo(() => {
      return (
        dashboard?.recent_claims || []
      ).filter(
        (claim) =>
          claim.payment_status === "paid",
      );
    }, [dashboard]);

  async function loadDashboard() {
    setBusy(true);
    setMessage(null);

    try {
      const nextDashboard =
        await fetchBusinessDashboard();

      setDashboard(nextDashboard);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Could not load dashboard.",
      );
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    void loadDashboard();
  }, []);

  if (!dashboard && !message) {
    return <DashboardLoading />;
  }

  if (!dashboard && message) {
    return (
      <section className="business-mobile-page">
        <div className="rounded-[1.5rem] border border-[#D99579]/35 bg-[#FFF0EA] p-5 text-[#8A3A20]">
          <CircleAlert
            size={25}
            aria-hidden="true"
          />

          <h1 className="mt-4 text-xl font-black">
            Could not load dashboard
          </h1>

          <p className="mt-2 text-sm leading-6">
            {message}
          </p>

          <button
            type="button"
            onClick={() =>
              void loadDashboard()
            }
            className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#8A3A20] px-5 text-sm font-black text-white"
          >
            <RefreshCw
              size={17}
              aria-hidden="true"
            />

            Try again
          </button>
        </div>
      </section>
    );
  }

  if (!dashboard) {
    return null;
  }

  return (
    <section className="business-mobile-page">
      <header className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.12em] text-[#6F7D43]">
            <Store
              size={14}
              aria-hidden="true"
            />

            Today at
          </p>

          <h1 className="mt-2 truncate text-[2rem] font-black leading-none tracking-[-0.045em]">
            {mainBusiness?.name ||
              "Your business"}
          </h1>

          <p className="mt-2 text-sm text-black/45">
            Here is what needs your
            attention today.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            void loadDashboard()
          }
          disabled={busy}
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-black/[0.07] bg-white text-[#18392B] shadow-sm disabled:opacity-50"
          aria-label="Refresh dashboard"
        >
          <RefreshCw
            size={19}
            className={
              busy ? "animate-spin" : ""
            }
            aria-hidden="true"
          />
        </button>
      </header>

      {message ? (
        <div className="mt-5 flex gap-3 rounded-[1.25rem] bg-[#FFF0EA] p-4 text-sm text-[#8A3A20]">
          <CircleAlert
            size={20}
            className="mt-0.5 shrink-0"
            aria-hidden="true"
          />

          <p>{message}</p>
        </div>
      ) : null}

      <div className="mt-6 grid grid-cols-2 gap-3">
        <DashboardMetric
          icon={PackageCheck}
          label="Active deals"
          value={String(
            dashboard.stats.active_deals,
          )}
        />

        <DashboardMetric
          icon={ShoppingBag}
          label="To collect"
          value={String(
            dashboard.stats.active_pickups,
          )}
        />

        <DashboardMetric
          icon={QrCode}
          label="Collected"
          value={String(
            dashboard.stats.collected_today,
          )}
        />

        <DashboardMetric
          icon={Wallet}
          label="Revenue"
          value={formatMoney(
            dashboard.stats.revenue_today,
          )}
        />
      </div>

      <Link
        href="/business/deals/new"
        className="mt-4 flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-[#18392B] px-6 text-base font-black text-white shadow-[0_10px_26px_rgba(24,57,43,0.2)]"
      >
        <Plus
          size={20}
          strokeWidth={2.8}
          aria-hidden="true"
        />

        Create a new deal
      </Link>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <QuickAction
          href="/business/deals"
          icon={PackageCheck}
          label="Manage deals"
        />

        <QuickAction
          href="/business/claims"
          icon={QrCode}
          label="Scan pickup"
        />
      </div>

      <DashboardSection
        title="Active deals"
        href="/business/deals"
        action="View all"
      >
        {dashboard.active_deals.length ===
        0 ? (
          <CompactEmptyState
            title="No active deals"
            text="Publish a deal to start selling surplus food."
          />
        ) : (
          <div className="divide-y divide-black/[0.07]">
            {dashboard.active_deals
              .slice(0, 4)
              .map((deal) => (
                <ActiveDealRow
                  key={deal.id}
                  deal={deal}
                />
              ))}
          </div>
        )}
      </DashboardSection>

      <DashboardSection
        title="Recent claims"
        href="/business/claims"
        action="View pickups"
      >
        {recentPaidClaims.length === 0 ? (
          <CompactEmptyState
            title="No paid claims yet"
            text="Customer orders will appear here after payment."
          />
        ) : (
          <div className="divide-y divide-black/[0.07]">
            {recentPaidClaims
              .slice(0, 4)
              .map((claim) => (
                <RecentClaimRow
                  key={claim.id}
                  claim={claim}
                />
              ))}
          </div>
        )}
      </DashboardSection>

      <section className="mt-6 rounded-[1.5rem] bg-[#18392B] p-5 text-white">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.12em] text-white/55">
              Estimated unpaid payout
            </p>

            <p className="mt-2 text-3xl font-black tracking-[-0.04em]">
              {formatMoney(
                dashboard.stats
                  .estimated_unpaid_payout,
              )}
            </p>
          </div>

          <span className="grid h-11 w-11 place-items-center rounded-full bg-white/10">
            <Wallet
              size={21}
              aria-hidden="true"
            />
          </span>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2 border-t border-white/10 pt-4">
          <MoneyStat
            label="Business"
            value={formatMoney(
              dashboard.stats
                .business_amount_today,
            )}
          />

          <MoneyStat
            label="Fees"
            value={formatMoney(
              dashboard.stats
                .platform_fees_today,
            )}
          />

          <MoneyStat
            label="Paid"
            value={String(
              dashboard.stats
                .total_paid_orders,
            )}
          />
        </div>

        <p className="mt-4 text-xs leading-5 text-white/45">
          Estimated from collected,
          paid claims. Automated payouts
          are not active yet.
        </p>
      </section>
    </section>
  );
}

function DashboardLoading() {
  return (
    <section className="business-mobile-page">
      <div className="animate-pulse">
        <div className="h-3 w-24 rounded-full bg-black/10" />
        <div className="mt-3 h-9 w-56 rounded-xl bg-black/10" />
        <div className="mt-3 h-4 w-64 rounded-full bg-black/10" />

        <div className="mt-7 grid grid-cols-2 gap-3">
          {Array.from({
            length: 4,
          }).map((_, index) => (
            <div
              key={index}
              className="h-28 rounded-[1.4rem] bg-black/[0.07]"
            />
          ))}
        </div>

        <div className="mt-5 h-14 rounded-full bg-black/[0.08]" />

        <div className="mt-7 h-64 rounded-[1.5rem] bg-black/[0.07]" />
      </div>
    </section>
  );
}

function DashboardMetric({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <article className="min-h-[112px] rounded-[1.4rem] border border-black/[0.07] bg-white p-4 shadow-[0_5px_18px_rgba(35,39,31,0.04)]">
      <div className="flex items-start justify-between gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#E9EDDD] text-[#18392B]">
          <Icon
            size={18}
            aria-hidden="true"
          />
        </span>

        <span className="text-2xl font-black tracking-[-0.04em]">
          {value}
        </span>
      </div>

      <p className="mt-4 text-xs font-bold text-black/45">
        {label}
      </p>
    </article>
  );
}

function QuickAction({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: LucideIcon;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex min-h-14 items-center justify-between gap-2 rounded-[1.15rem] border border-black/[0.07] bg-white px-4 text-sm font-black"
    >
      <span className="flex min-w-0 items-center gap-2">
        <Icon
          size={18}
          className="shrink-0 text-[#6F7D43]"
          aria-hidden="true"
        />

        <span className="truncate">
          {label}
        </span>
      </span>

      <ArrowRight
        size={16}
        className="shrink-0 text-black/25"
        aria-hidden="true"
      />
    </Link>
  );
}

function DashboardSection({
  title,
  href,
  action,
  children,
}: {
  title: string;
  href: string;
  action: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-6 overflow-hidden rounded-[1.5rem] border border-black/[0.07] bg-white">
      <header className="flex min-h-14 items-center justify-between gap-4 border-b border-black/[0.07] px-4">
        <h2 className="text-lg font-black tracking-[-0.025em]">
          {title}
        </h2>

        <Link
          href={href}
          className="text-xs font-black text-[#6F7D43]"
        >
          {action}
        </Link>
      </header>

      <div className="px-4">
        {children}
      </div>
    </section>
  );
}

function ActiveDealRow({
  deal,
}: {
  deal: BusinessDashboardDeal;
}) {
  const sold = Math.max(
    0,
    Number(deal.quantity_total) -
      Number(deal.quantity_left),
  );

  return (
    <Link
      href={`/deals/${deal.id}`}
      className="block py-4"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[#E4EAD7] px-2 py-1 text-[10px] font-black uppercase text-[#18392B]">
              {formatLabel(deal.status)}
            </span>

            <span className="truncate text-[11px] font-bold text-black/35">
              {formatLabel(
                deal.category || "deal",
              )}
            </span>
          </div>

          <h3 className="mt-2 truncate text-base font-black">
            {deal.title}
          </h3>

          <p className="mt-1 flex items-center gap-1.5 text-xs text-black/45">
            <Clock3
              size={13}
              className="shrink-0 text-[#6F7D43]"
              aria-hidden="true"
            />

            {getPickupWindow(deal)}
          </p>
        </div>

        <div className="shrink-0 text-right">
          <p className="text-lg font-black text-[#18392B]">
            {formatMoney(deal.price)}
          </p>

          <p className="mt-1 text-[11px] font-bold text-black/40">
            {deal.quantity_left} left ·{" "}
            {sold} sold
          </p>
        </div>
      </div>
    </Link>
  );
}

function RecentClaimRow({
  claim,
}: {
  claim: BusinessDashboardClaim;
}) {
  const collected =
    isClaimCollected(claim);

  return (
    <Link
      href="/business/claims"
      className="block py-4"
    >
      <div className="flex items-center gap-3">
        <span
          className={[
            "grid h-11 w-11 shrink-0 place-items-center rounded-xl font-mono text-xs font-black",
            collected
              ? "bg-[#E4EAD7] text-[#18392B]"
              : "bg-[#FFF0C7] text-[#715914]",
          ].join(" ")}
        >
          {getClaimCode(claim)
            .slice(-4)
            .toUpperCase()}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-sm font-black">
              {claim.deal_title ||
                "Rescue claim"}
            </h3>

            <span className="shrink-0 text-[10px] font-black uppercase text-[#6F7D43]">
              {collected
                ? "Collected"
                : "Active"}
            </span>
          </div>

          <p className="mt-1 truncate text-xs text-black/40">
            Code {getClaimCode(claim)} ·{" "}
            {formatDateTime(
              claim.created_at,
            )}
          </p>
        </div>

        <p className="shrink-0 text-sm font-black text-[#18392B]">
          {formatMoney(
            claim.business_amount,
          )}
        </p>
      </div>
    </Link>
  );
}

function CompactEmptyState({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="py-8 text-center">
      <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#E9EDDD] text-[#18392B]">
        <ShoppingBag
          size={21}
          aria-hidden="true"
        />
      </span>

      <h3 className="mt-4 text-base font-black">
        {title}
      </h3>

      <p className="mx-auto mt-2 max-w-xs text-sm leading-5 text-black/45">
        {text}
      </p>
    </div>
  );
}

function MoneyStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-[10px] font-black uppercase tracking-wide text-white/40">
        {label}
      </p>

      <p className="mt-1 truncate text-base font-black">
        {value}
      </p>
    </div>
  );
}
