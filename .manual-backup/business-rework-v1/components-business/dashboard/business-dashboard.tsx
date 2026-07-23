"use client";

import Link from "next/link";
import {
  ArrowRight,
  CircleAlert,
  PackageCheck,
  Plus,
  QrCode,
  RefreshCw,
  Store,
  Wallet,
} from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";

import {
  EmptyState,
  MetricCard,
  SectionPanel,
  StatusPill,
} from "@/components/ui";
import {
  fetchBusinessDashboard,
  type BusinessDashboard,
  type BusinessDashboardClaim,
  type BusinessDashboardDeal,
} from "@/lib/api/business-dashboard";
import { formatMoney } from "@/lib/utils/format";

function formatDateTime(value: string | null) {
  if (!value) return "Not set";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not set";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatTime(value: string | null) {
  if (!value) return "TBD";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "TBD";

  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function getPickupWindow(deal: BusinessDashboardDeal) {
  if (!deal.pickup_start || !deal.pickup_end) return "Pickup TBD";
  return `${formatTime(deal.pickup_start)} - ${formatTime(deal.pickup_end)}`;
}

function getClaimCode(claim: BusinessDashboardClaim) {
  return claim.pickup_code || claim.code || claim.qr_code || "—";
}

function isClaimCollected(claim: BusinessDashboardClaim) {
  return (
    claim.claim_status === "picked_up" ||
    claim.claim_status === "collected" ||
    Boolean(claim.picked_up_at || claim.collected_at)
  );
}

export function BusinessDashboardView() {
  const [dashboard, setDashboard] = useState<BusinessDashboard | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const mainBusiness = dashboard?.businesses[0] || null;

  const recentPaidClaims = useMemo(() => {
    return (dashboard?.recent_claims || []).filter(
      (claim) => claim.payment_status === "paid"
    );
  }, [dashboard]);

  async function loadDashboard() {
    setBusy(true);
    setMessage(null);

    try {
      const nextDashboard = await fetchBusinessDashboard();
      setDashboard(nextDashboard);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Could not load dashboard."
      );
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    void loadDashboard();
  }, []);

  if (!dashboard && !message) {
    return (
      <div className="rounded-[1.75rem] bg-white p-8 text-center shadow-[0_10px_30px_rgba(95,78,55,0.08)] ring-1 ring-[#DDD2C2] dark:bg-[#241f1a] dark:ring-white/10">
        <p className="font-black">Loading business dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      <section className="rounded-[2.25rem] bg-[#FBF8F2] p-6 shadow-[0_10px_30px_rgba(95,78,55,0.08)] ring-1 ring-[#DDD2C2] dark:bg-[#241f1a] dark:ring-white/10 md:p-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-[#EEF1E3] px-3 py-1 text-xs font-black uppercase tracking-wide text-[#6F7D43] dark:bg-[#556235] dark:text-[#E1E9B8]">
              <Store size={14} />
              {mainBusiness?.name || "Business dashboard"}
            </p>

            <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-tight text-[#2F261F] dark:text-white md:text-6xl">
              Today’s rescue board
            </h1>

            <p className="mt-3 max-w-2xl text-black/55 dark:text-white/45">
              Live deals, pickups, sales and estimated payouts without the
              spaceship cockpit.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => loadDashboard()}
              disabled={busy}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#F4EFE6] px-5 py-3 font-black text-[#6F7D43] transition hover:bg-[#EEF1E3] disabled:opacity-60 dark:bg-[#171411] dark:text-[#E1E9B8]"
            >
              <RefreshCw size={18} />
              Refresh
            </button>

            <Link
              href="/business/create"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#6F7D43] px-5 py-3 font-black text-white transition hover:bg-[#556235] dark:bg-[#9baa6a] dark:text-[#2F261F]"
            >
              <Plus size={18} />
              Create deal
            </Link>
          </div>
        </div>

        {dashboard ? (
          <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            <MetricCard
              label="Active deals"
              value={String(dashboard.stats.active_deals)}
            />
            <MetricCard
              label="Active pickups"
              value={String(dashboard.stats.active_pickups)}
            />
            <MetricCard
              label="Collected today"
              value={String(dashboard.stats.collected_today)}
            />
            <MetricCard
              label="Revenue today"
              value={formatMoney(dashboard.stats.revenue_today)}
            />
            <MetricCard
              label="Unpaid payout"
              value={formatMoney(dashboard.stats.estimated_unpaid_payout)}
            />
          </div>
        ) : null}
      </section>

      {message ? (
        <div className="rounded-[1.5rem] bg-[#fff0ea] p-4 text-[#8a3a20]">
          <div className="flex gap-3">
            <CircleAlert size={22} className="mt-0.5 shrink-0" />
            <p className="font-semibold">{message}</p>
          </div>
        </div>
      ) : null}

      {dashboard ? (
        <>
          <section className="grid gap-3 md:grid-cols-4">
            <QuickAction
              href="/business/create"
              icon={<Plus size={18} />}
              title="Create deal"
            />
            <QuickAction
              href="/business/deals"
              icon={<PackageCheck size={18} />}
              title="Manage deals"
            />
            <QuickAction
              href="/business/claims"
              icon={<QrCode size={18} />}
              title="Scan pickup"
            />
            <QuickAction
              href="/deals"
              icon={<ArrowRight size={18} />}
              title="Customer view"
            />
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <SectionPanel
              kicker="Live"
              title="Active deals"
              actionHref="/business/deals"
              actionLabel="View all"
            >
              {dashboard.active_deals.length === 0 ? (
                <EmptyState
                  title="No active deals"
                  text="Create a deal to start rescuing food today."
                />
              ) : (
                <div className="divide-y divide-[#DDD2C2] dark:divide-white/10">
                  {dashboard.active_deals.map((deal) => (
                    <ActiveDealRow key={deal.id} deal={deal} />
                  ))}
                </div>
              )}
            </SectionPanel>

            <SectionPanel
              kicker="Orders"
              title="Recent claims"
              actionHref="/business/claims"
              actionLabel="Pickups"
            >
              {recentPaidClaims.length === 0 ? (
                <EmptyState
                  title="No paid claims yet"
                  text="Paid customer orders will appear here."
                />
              ) : (
                <div className="divide-y divide-[#DDD2C2] dark:divide-white/10">
                  {recentPaidClaims.slice(0, 6).map((claim) => (
                    <RecentClaimRow key={claim.id} claim={claim} />
                  ))}
                </div>
              )}
            </SectionPanel>
          </section>

          <section className="rounded-[1.75rem] bg-white p-5 shadow-[0_10px_30px_rgba(95,78,55,0.08)] ring-1 ring-[#DDD2C2] dark:bg-[#241f1a] dark:ring-white/10 md:p-6">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
              <div>
                <p className="text-sm font-black uppercase tracking-wide text-[#6F7D43] dark:text-[#E1E9B8]">
                  Money
                </p>

                <h2 className="mt-1 text-3xl font-black tracking-tight">
                  Payout snapshot
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-black/50 dark:text-white/40">
                  Payouts are not automated yet. This is the estimated amount
                  owed to the business based on collected paid claims.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3 md:min-w-[520px]">
                <MoneyMini
                  label="Business today"
                  value={formatMoney(dashboard.stats.business_amount_today)}
                />
                <MoneyMini
                  label="Platform fees"
                  value={formatMoney(dashboard.stats.platform_fees_today)}
                />
                <MoneyMini
                  label="Paid orders"
                  value={String(dashboard.stats.total_paid_orders)}
                />
              </div>
            </div>
          </section>
        </>
      ) : null}
    </div>
  );
}

function QuickAction({
  href,
  icon,
  title,
}: {
  href: string;
  icon: ReactNode;
  title: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between rounded-full bg-white px-5 py-4 font-black shadow-[0_10px_30px_rgba(95,78,55,0.08)] ring-1 ring-[#DDD2C2] transition hover:-translate-y-0.5 hover:bg-[#F4EFE6] dark:bg-[#241f1a] dark:ring-white/10 dark:hover:bg-[#171411]"
    >
      <span className="inline-flex items-center gap-3">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-[#EEF1E3] text-[#6F7D43] dark:bg-[#556235] dark:text-[#E1E9B8]">
          {icon}
        </span>
        {title}
      </span>

      <ArrowRight
        size={16}
        className="text-black/25 transition group-hover:translate-x-0.5 group-hover:text-[#6F7D43] dark:text-white/25"
      />
    </Link>
  );
}

function ActiveDealRow({ deal }: { deal: BusinessDashboardDeal }) {
  const sold = Math.max(
    0,
    Number(deal.quantity_total) - Number(deal.quantity_left)
  );

  return (
    <Link
      href={`/deals/${deal.id}`}
      className="block py-4 transition first:pt-0 last:pb-0 hover:translate-x-1"
    >
      <div className="grid gap-3 md:grid-cols-[1fr_110px_90px_90px] md:items-center">
        <div className="min-w-0">
          <div className="flex flex-wrap gap-2">
            <StatusPill tone="good">{deal.status}</StatusPill>
            <StatusPill>{deal.category || "deal"}</StatusPill>
          </div>

          <h3 className="mt-2 truncate text-lg font-black tracking-tight">
            {deal.title}
          </h3>

          <p className="mt-1 text-sm text-black/45 dark:text-white/40">
            {deal.business_name} · {getPickupWindow(deal)}
          </p>
        </div>

        <RowStat label="Left" value={String(deal.quantity_left)} />
        <RowStat label="Sold" value={String(sold)} />
        <RowStat label="Price" value={formatMoney(deal.price)} />
      </div>
    </Link>
  );
}

function RecentClaimRow({ claim }: { claim: BusinessDashboardClaim }) {
  const collected = isClaimCollected(claim);

  return (
    <Link
      href={`/deals/${claim.deal_id}`}
      className="block py-4 transition first:pt-0 last:pb-0 hover:translate-x-1"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap gap-2">
            <StatusPill tone={collected ? "good" : "warning"}>
              {collected ? "Collected" : "Active"}
            </StatusPill>

            <StatusPill>{claim.payment_status}</StatusPill>
          </div>

          <h3 className="mt-2 truncate text-base font-black tracking-tight">
            {claim.deal_title || "Claim"}
          </h3>

          <p className="mt-1 text-sm text-black/45 dark:text-white/40">
            Code {getClaimCode(claim)} · {formatDateTime(claim.created_at)}
          </p>
        </div>

        <p className="shrink-0 pt-1 text-sm font-black text-[#6F7D43] dark:text-[#E1E9B8]">
          {formatMoney(claim.business_amount)}
        </p>
      </div>
    </Link>
  );
}

function RowStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="md:text-right">
      <p className="text-[10px] font-black uppercase tracking-wide text-black/30 dark:text-white/25">
        {label}
      </p>
      <p className="mt-1 font-black">{value}</p>
    </div>
  );
}

function MoneyMini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.5rem] bg-[#F4EFE6] p-4 dark:bg-[#171411]">
      <div className="grid h-8 w-8 place-items-center rounded-full bg-[#EEF1E3] text-[#6F7D43] dark:bg-[#556235] dark:text-[#E1E9B8]">
        <Wallet size={16} />
      </div>

      <p className="mt-3 text-[10px] font-black uppercase tracking-wide text-black/35 dark:text-white/30">
        {label}
      </p>
      <p className="mt-1 text-2xl font-black">{value}</p>
    </div>
  );
}
