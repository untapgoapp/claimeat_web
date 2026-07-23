"use client";

import Link from "next/link";
import {
  Clock3,
  ExternalLink,
  PackageCheck,
  QrCode,
  RefreshCw,
  TicketCheck,
  TimerOff,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { ClaimQr } from "@/components/claim-qr";
import {
  useEffect,
  useMemo,
  useState,
  type KeyboardEvent,
  type MouseEvent,
} from "react";

import { useAuth } from "@/components/auth/auth-provider";
import {
  EmptyState,
  InfoTile,
  MetricCard,
  StatusPill,
} from "@/components/ui";
import { fetchMyClaims, type MyClaim } from "@/lib/api/my-claims";
import { formatMoney } from "@/lib/utils/format";

type ClaimFilter = "active" | "collected" | "expired" | "all";
type ClaimState = "active" | "collected" | "expired";

const filters: { value: ClaimFilter; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "collected", label: "Collected" },
  { value: "expired", label: "Expired" },
  { value: "all", label: "All" },
];

function getPickupCode(claim: MyClaim) {
  return claim.pickup_code || claim.code || claim.qr_code || "";
}

function isCollected(claim: MyClaim) {
  return (
    claim.claim_status === "picked_up" ||
    claim.claim_status === "collected" ||
    Boolean(claim.picked_up_at || claim.collected_at)
  );
}

function isExpired(claim: MyClaim) {
  if (isCollected(claim)) return false;
  if (claim.claim_status === "expired") return true;
  if (!claim.pickup_end) return false;

  const pickupEnd = new Date(claim.pickup_end);

  if (Number.isNaN(pickupEnd.getTime())) return false;

  return pickupEnd.getTime() < Date.now();
}

function getClaimState(claim: MyClaim): ClaimState {
  if (isCollected(claim)) return "collected";
  if (isExpired(claim)) return "expired";
  return "active";
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

function formatDateTime(value: string | null) {
  if (!value) return "Not yet";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Not yet";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatPickupWindow(claim: MyClaim) {
  if (!claim.pickup_start || !claim.pickup_end) return "Pickup TBD";

  return `${formatTime(claim.pickup_start)} - ${formatTime(claim.pickup_end)}`;
}

function getStatusTone(state: ClaimState) {
  if (state === "collected") return "good" as const;
  if (state === "expired") return "danger" as const;
  return "good" as const;
}

function getStatusIcon(state: ClaimState) {
  if (state === "collected") return <TicketCheck size={13} />;
  if (state === "expired") return <TimerOff size={13} />;
  return <Clock3 size={13} />;
}

export function MyClaimsWallet() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [claims, setClaims] = useState<MyClaim[]>([]);
  const [filter, setFilter] = useState<ClaimFilter>("active");
  const [selectedClaimId, setSelectedClaimId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const selectedClaim =
    claims.find((claim) => claim.id === selectedClaimId) || claims[0] || null;

  const visibleClaims = useMemo(() => {
    if (filter === "all") return claims;

    return claims.filter((claim) => getClaimState(claim) === filter);
  }, [claims, filter]);

  const stats = useMemo(() => {
    return {
      active: claims.filter((claim) => getClaimState(claim) === "active").length,
      collected: claims.filter((claim) => getClaimState(claim) === "collected").length,
      expired: claims.filter((claim) => getClaimState(claim) === "expired").length,
      total: claims.length,
    };
  }, [claims]);

  function openDealPage(dealId: string) {
    router.push(`/deals/${dealId}`);
  }

  async function loadClaims() {
    if (!user) return;

    setBusy(true);
    setMessage(null);

    try {
      const nextClaims = await fetchMyClaims();
      setClaims(nextClaims);

      if (!selectedClaimId && nextClaims[0]) {
        setSelectedClaimId(nextClaims[0].id);
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not load claims.");
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    if (!loading && user) {
      void loadClaims();
    }
  }, [loading, user]);

  if (loading) {
    return (
      <div className="rounded-[1.75rem] bg-white p-8 text-center shadow-[0_10px_30px_rgba(95,78,55,0.08)] ring-1 ring-[#DDD2C2] dark:bg-[#241f1a] dark:ring-white/10">
        <p className="font-black">Loading your wallet...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-xl rounded-[1.75rem] bg-white p-8 text-center shadow-[0_10px_30px_rgba(95,78,55,0.08)] ring-1 ring-[#DDD2C2] dark:bg-[#241f1a] dark:ring-white/10">
        <p className="text-3xl font-black tracking-tight">
          Log in to see your claims
        </p>

        <p className="mt-3 text-black/55 dark:text-white/45">
          Your pickup codes and QR tickets live here after checkout.
        </p>

        <Link
          href="?auth=login"
          className="mt-6 inline-flex rounded-full bg-[#6F7D43] px-6 py-3 font-black text-white dark:bg-[#9baa6a] dark:text-[#2F261F]"
        >
          Log in
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-7 pb-16">
      <section className="relative overflow-hidden rounded-[2.25rem] bg-[#6F7D43] p-6 text-white shadow-[0_24px_70px_rgba(95,78,55,0.14)] md:p-8">
        <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[#9baa6a]/30 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-32 w-72 rounded-full bg-[#b76e45]/20 blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-wide text-[#dfe8b6]">
              ClaimEat wallet
            </p>

            <h1 className="mt-4 text-4xl font-black tracking-tight md:text-6xl">
              Your pickup codes
            </h1>

            <p className="mt-3 max-w-2xl text-white/62">
              Show the QR or code at the store during the pickup window.
            </p>
          </div>

          <button
            type="button"
            onClick={() => loadClaims()}
            disabled={busy}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 font-black text-[#2F261F] shadow-[0_10px_30px_rgba(95,78,55,0.08)] transition hover:bg-[#F4EFE6] disabled:opacity-60"
          >
            <RefreshCw size={18} />
            Refresh
          </button>
        </div>

        <div className="relative z-10 mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard label="Active" value={String(stats.active)} dark />
          <MetricCard label="Collected" value={String(stats.collected)} dark />
          <MetricCard label="Expired" value={String(stats.expired)} dark />
          <MetricCard label="Total" value={String(stats.total)} dark />
        </div>
      </section>

      {message ? (
        <div className="rounded-[1.5rem] bg-[#fff0ea] p-4 text-[#8a3a20]">
          <p className="font-semibold">{message}</p>
        </div>
      ) : null}

      {claims.length === 0 ? (
        <EmptyState
          icon={<PackageCheck size={28} />}
          title="No claims yet"
          text="Claim your first rescue bag and your pickup code will appear here."
          action={
            <Link
              href="/deals"
              className="inline-flex rounded-full bg-[#6F7D43] px-6 py-3 font-black text-white dark:bg-[#9baa6a] dark:text-[#2F261F]"
            >
              Browse deals
            </Link>
          }
        />
      ) : (
        <section className="grid gap-5 lg:grid-cols-[420px_1fr]">
          <div className="space-y-5">
            <div className="rounded-[1.75rem] bg-white p-5 shadow-[0_10px_30px_rgba(95,78,55,0.08)] ring-1 ring-[#DDD2C2] dark:bg-[#241f1a] dark:ring-white/10 md:p-6">
              <div className="flex items-start gap-4">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#EEF1E3] text-[#6F7D43] dark:bg-[#556235] dark:text-[#E1E9B8]">
                  <QrCode size={24} />
                </div>

                <div>
                  <h2 className="text-2xl font-black tracking-tight">
                    Pickup ticket
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-black/55 dark:text-white/45">
                    Show this at the counter if the order is still active.
                  </p>
                </div>
              </div>

              {selectedClaim ? (
                <BigQrTicket
                  claim={selectedClaim}
                  onOpenDeal={() => openDealPage(selectedClaim.deal_id)}
                />
              ) : null}
            </div>
          </div>

          <div className="rounded-[1.75rem] bg-white p-5 shadow-[0_10px_30px_rgba(95,78,55,0.08)] ring-1 ring-[#DDD2C2] dark:bg-[#241f1a] dark:ring-white/10 md:p-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <p className="text-sm font-black uppercase tracking-wide text-[#6F7D43] dark:text-[#E1E9B8]">
                  Claims
                </p>

                <h2 className="mt-1 text-3xl font-black tracking-tight">
                  Your orders
                </h2>
              </div>

              <div className="flex flex-wrap gap-2">
                {filters.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setFilter(item.value)}
                    className={[
                      "rounded-full px-4 py-2 text-sm font-black transition",
                      filter === item.value
                        ? "bg-[#6F7D43] text-white dark:bg-[#9baa6a] dark:text-[#2F261F]"
                        : "bg-[#F4EFE6] text-black/50 hover:text-black dark:bg-[#171411] dark:text-white/45 dark:hover:text-white",
                    ].join(" ")}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {visibleClaims.length === 0 ? (
                <EmptyState title="Nothing here" text="Try another filter." />
              ) : (
                visibleClaims.map((claim) => (
                  <ClaimWalletCard
                    key={claim.id}
                    claim={claim}
                    selected={selectedClaim?.id === claim.id}
                    onShowTicket={() => setSelectedClaimId(claim.id)}
                    onOpenDeal={() => openDealPage(claim.deal_id)}
                  />
                ))
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function BigQrTicket({
  claim,
  onOpenDeal,
}: {
  claim: MyClaim;
  onOpenDeal: () => void;
}) {
  const code = getPickupCode(claim);
  const state = getClaimState(claim);

  return (
    <div className="mt-6">
      <div
        className={[
          "rounded-[1.75rem] p-5 text-center dark:bg-[#171411]",
          state === "expired" ? "bg-[#fff0ea]" : "bg-[#F4EFE6]",
        ].join(" ")}
      >
        <div className="mx-auto grid aspect-square w-full max-w-[260px] place-items-center rounded-[1.75rem] bg-white p-3 shadow-[0_10px_30px_rgba(95,78,55,0.08)]">
          {state === "expired" ? (
            <div className="text-center text-[#8a3a20]">
              <TimerOff className="mx-auto" size={72} />
              <p className="mt-3 text-sm font-black">Expired</p>
            </div>
          ) : code ? (
            <ClaimQr value={code} />
          ) : (
            <p className="text-sm font-black text-black/40">Missing code</p>
          )}
        </div>

        <p className="mt-5 text-xs font-black uppercase tracking-[0.22em] text-black/35 dark:text-white/30">
          {state === "expired" ? "Expired code" : "Pickup code"}
        </p>

        <p className="mx-auto mt-2 max-w-full break-all font-mono text-[clamp(1.35rem,7vw,2rem)] font-black leading-tight tracking-[0.08em] text-[#2F261F] [overflow-wrap:anywhere] dark:text-white">
          {code || "—"}
        </p>

        {state === "expired" ? (
          <p className="mt-3 text-sm font-bold text-[#8a3a20]">
            This pickup window has passed.
          </p>
        ) : null}
      </div>

      <div className="mt-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-2xl font-black tracking-tight">
              {claim.deal_title}
            </h3>

            <p className="mt-1 text-sm text-black/50 dark:text-white/40">
              {claim.business_name} · {claim.business_address || claim.business_city}
            </p>
          </div>

          <ClaimStatusPill state={state} />
        </div>

        <button
          type="button"
          onClick={onOpenDeal}
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#6F7D43] px-4 py-2 text-sm font-black text-white transition hover:bg-[#556235] dark:bg-[#9baa6a] dark:text-[#2F261F]"
        >
          View deal
          <ExternalLink size={15} />
        </button>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <InfoTile label="Pickup" value={formatPickupWindow(claim)} />
          <InfoTile label="Total" value={formatMoney(claim.total_price)} />
          <InfoTile label="Quantity" value={String(claim.quantity)} />
          <InfoTile
            label="Status"
            value={
              state === "collected"
                ? formatDateTime(claim.picked_up_at || claim.collected_at)
                : state
            }
          />
        </div>
      </div>
    </div>
  );
}

function ClaimWalletCard({
  claim,
  selected,
  onShowTicket,
  onOpenDeal,
}: {
  claim: MyClaim;
  selected: boolean;
  onShowTicket: () => void;
  onOpenDeal: () => void;
}) {
  const code = getPickupCode(claim);
  const state = getClaimState(claim);

  function handleCardClick(event: MouseEvent<HTMLDivElement>) {
    const target = event.target as HTMLElement | null;

    if (
      target?.closest("button") ||
      target?.closest("a") ||
      target?.closest("input") ||
      target?.closest("select") ||
      target?.closest("textarea")
    ) {
      return;
    }

    onOpenDeal();
  }

  function handleCardKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "Enter" && event.key !== " ") return;

    event.preventDefault();
    onOpenDeal();
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={handleCardKeyDown}
      title="Open deal"
      className={[
        "w-full cursor-pointer rounded-[1.5rem] border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#9baa6a]",
        selected
          ? "border-[#6f7d43] bg-[#EEF1E3] dark:border-[#9baa6a] dark:bg-[#556235]"
          : "border-[#DDD2C2] bg-[#FBF8F2] dark:border-white/10 dark:bg-[#171411]",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <ClaimStatusPill state={state} />

            <StatusPill>{claim.payment_status}</StatusPill>

            <StatusPill>
              Open deal
              <ExternalLink size={12} />
            </StatusPill>
          </div>

          <h3 className="mt-3 truncate text-xl font-black tracking-tight">
            {claim.deal_title}
          </h3>

          <p className="mt-1 truncate text-sm text-black/50 dark:text-white/40">
            {claim.business_name} · {formatPickupWindow(claim)}
          </p>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onShowTicket();
            }}
            className="mt-3 rounded-full bg-[#6F7D43] px-4 py-2 text-xs font-black text-white transition hover:bg-[#556235] dark:bg-[#9baa6a] dark:text-[#2F261F]"
          >
            Show ticket
          </button>
        </div>

        <div className="shrink-0 text-right">
          <p className="text-xs font-black uppercase tracking-wide text-black/35 dark:text-white/30">
            Code
          </p>

          <p className="mt-1 font-black tracking-[0.12em] text-[#6F7D43] dark:text-[#E1E9B8]">
            {code || "—"}
          </p>
        </div>
      </div>
    </div>
  );
}

function ClaimStatusPill({ state }: { state: ClaimState }) {
  return (
    <StatusPill tone={getStatusTone(state)} icon={getStatusIcon(state)}>
      {state === "collected" ? "Collected" : state === "expired" ? "Expired" : "Active"}
    </StatusPill>
  );
}
