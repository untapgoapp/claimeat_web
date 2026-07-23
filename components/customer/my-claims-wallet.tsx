"use client";

import Link from "next/link";
import {
  CheckCircle2,
  Clock3,
  ExternalLink,
  PackageCheck,
  QrCode,
  RefreshCw,
  ShoppingBag,
  TicketCheck,
  TimerOff,
  X,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useAuth } from "@/components/auth/auth-provider";
import { ClaimQr } from "@/components/claim-qr";
import {
  fetchMyClaims,
  type MyClaim,
} from "@/lib/api/my-claims";
import { formatMoney } from "@/lib/utils/format";

type ClaimFilter =
  | "active"
  | "collected"
  | "expired"
  | "all";

type ClaimState =
  | "active"
  | "collected"
  | "expired";

const filters: {
  value: ClaimFilter;
  label: string;
}[] = [
  {
    value: "active",
    label: "Active",
  },
  {
    value: "collected",
    label: "Collected",
  },
  {
    value: "expired",
    label: "Expired",
  },
  {
    value: "all",
    label: "All",
  },
];

function getPickupCode(
  claim: MyClaim,
) {
  return (
    claim.pickup_code ||
    claim.code ||
    claim.qr_code ||
    ""
  );
}

function isCollected(
  claim: MyClaim,
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

function isExpired(claim: MyClaim) {
  if (isCollected(claim)) {
    return false;
  }

  if (
    claim.claim_status === "expired"
  ) {
    return true;
  }

  if (!claim.pickup_end) {
    return false;
  }

  const pickupEnd = new Date(
    claim.pickup_end,
  );

  if (
    Number.isNaN(
      pickupEnd.getTime(),
    )
  ) {
    return false;
  }

  return (
    pickupEnd.getTime() < Date.now()
  );
}

function getClaimState(
  claim: MyClaim,
): ClaimState {
  if (isCollected(claim)) {
    return "collected";
  }

  if (isExpired(claim)) {
    return "expired";
  }

  return "active";
}

function formatTime(
  value: string | null,
) {
  if (!value) {
    return "TBD";
  }

  const date = new Date(value);

  if (
    Number.isNaN(date.getTime())
  ) {
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

function formatDate(
  value: string | null,
) {
  if (!value) {
    return "Date TBD";
  }

  const date = new Date(value);

  if (
    Number.isNaN(date.getTime())
  ) {
    return "Date TBD";
  }

  return new Intl.DateTimeFormat(
    "en-GB",
    {
      weekday: "short",
      day: "numeric",
      month: "short",
    },
  ).format(date);
}

function formatDateTime(
  value: string | null,
) {
  if (!value) {
    return "Not recorded";
  }

  const date = new Date(value);

  if (
    Number.isNaN(date.getTime())
  ) {
    return "Not recorded";
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

function formatPickupWindow(
  claim: MyClaim,
) {
  if (
    !claim.pickup_start ||
    !claim.pickup_end
  ) {
    return "Pickup time TBD";
  }

  return `${formatTime(
    claim.pickup_start,
  )}–${formatTime(claim.pickup_end)}`;
}

function formatCodeForDisplay(
  value: string,
) {
  const normalized = value
    .replace(/\s+/g, "")
    .replace(/-/g, "")
    .toUpperCase();

  return (
    normalized
      .match(/.{1,4}/g)
      ?.join("-") || value
  );
}

export function MyClaimsWallet() {
  const {
    user,
    loading: authLoading,
  } = useAuth();

  const [claims, setClaims] =
    useState<MyClaim[]>([]);

  const [filter, setFilter] =
    useState<ClaimFilter>("active");

  const [
    selectedClaimId,
    setSelectedClaimId,
  ] = useState<string | null>(null);

  const [ticketOpen, setTicketOpen] =
    useState(false);

  const [busy, setBusy] =
    useState(false);

  const [message, setMessage] =
    useState<string | null>(null);

  const selectedClaim = useMemo(
    () =>
      claims.find(
        (claim) =>
          claim.id === selectedClaimId,
      ) || null,
    [claims, selectedClaimId],
  );

  const visibleClaims = useMemo(() => {
    if (filter === "all") {
      return claims;
    }

    return claims.filter(
      (claim) =>
        getClaimState(claim) === filter,
    );
  }, [claims, filter]);

  const stats = useMemo(
    () => ({
      active: claims.filter(
        (claim) =>
          getClaimState(claim) ===
          "active",
      ).length,

      collected: claims.filter(
        (claim) =>
          getClaimState(claim) ===
          "collected",
      ).length,

      expired: claims.filter(
        (claim) =>
          getClaimState(claim) ===
          "expired",
      ).length,

      total: claims.length,
    }),
    [claims],
  );

  async function loadClaims() {
    if (!user) {
      return;
    }

    setBusy(true);
    setMessage(null);

    try {
      const nextClaims =
        await fetchMyClaims();

      setClaims(nextClaims);

      setSelectedClaimId(
        (currentId) => {
          const currentStillExists =
            nextClaims.some(
              (claim) =>
                claim.id === currentId,
            );

          if (currentStillExists) {
            return currentId;
          }

          const firstActive =
            nextClaims.find(
              (claim) =>
                getClaimState(claim) ===
                "active",
            );

          return (
            firstActive?.id ||
            nextClaims[0]?.id ||
            null
          );
        },
      );
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Could not load your orders.",
      );
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    if (!authLoading && user) {
      void loadClaims();
    }
  }, [authLoading, user]);

  function showTicket(
    claimId: string,
  ) {
    setSelectedClaimId(claimId);
    setTicketOpen(true);
  }

  if (authLoading) {
    return <WalletLoading />;
  }

  if (!user) {
    return (
      <main className="grid min-h-[70dvh] place-items-center px-4 py-10">
        <section className="w-full max-w-sm rounded-[1.6rem] border border-black/[0.07] bg-white p-6 text-center">
          <QrCode
            size={30}
            className="mx-auto text-[#6F7D43]"
            aria-hidden="true"
          />

          <h1 className="mt-4 text-2xl font-black tracking-[-0.04em]">
            Log in to see your orders
          </h1>

          <p className="mt-3 text-sm leading-6 text-black/45">
            Your pickup tickets will appear
            here after checkout.
          </p>

          <Link
            href="/login?next=/my-claims"
            className="mt-6 flex min-h-12 w-full items-center justify-center rounded-xl bg-[#18392B] text-sm font-black text-white"
          >
            Log in
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main
      className="mx-auto w-full max-w-[1120px] px-3 pt-4 sm:px-5 lg:px-6"
      style={{
        paddingBottom:
          "calc(118px + env(safe-area-inset-bottom))",
      }}
    >
      <header className="rounded-[1.6rem] bg-[#18392B] p-5 text-white sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-[0.12em] text-white/50">
              ClaimEat wallet
            </p>

            <h1 className="mt-2 text-[2rem] font-black leading-none tracking-[-0.05em] sm:text-4xl">
              My orders
            </h1>

            <p className="mt-2 max-w-lg text-sm leading-5 text-white/55">
              Open a ticket when you arrive
              at the store.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              void loadClaims()
            }
            disabled={busy}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/10 text-white disabled:opacity-40"
            aria-label="Refresh orders"
          >
            <RefreshCw
              size={19}
              className={
                busy ? "animate-spin" : ""
              }
              aria-hidden="true"
            />
          </button>
        </div>

        <div className="mt-5 grid grid-cols-4 gap-2">
          <Metric
            label="Active"
            value={stats.active}
          />

          <Metric
            label="Collected"
            value={stats.collected}
          />

          <Metric
            label="Expired"
            value={stats.expired}
          />

          <Metric
            label="Total"
            value={stats.total}
          />
        </div>
      </header>

      {message ? (
        <div className="mt-4 rounded-xl bg-[#FFF0EA] p-4 text-sm font-semibold text-[#8A3A20]">
          {message}
        </div>
      ) : null}

      {claims.length === 0 &&
      !busy ? (
        <section className="mt-5 rounded-[1.6rem] border border-black/[0.07] bg-white px-5 py-12 text-center">
          <PackageCheck
            size={31}
            className="mx-auto text-[#6F7D43]"
            aria-hidden="true"
          />

          <h2 className="mt-4 text-xl font-black">
            No orders yet
          </h2>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-black/45">
            Claim your first rescue deal
            and its pickup ticket will
            appear here.
          </p>

          <Link
            href="/deals"
            className="mx-auto mt-6 flex min-h-12 w-full max-w-xs items-center justify-center rounded-xl bg-[#18392B] text-sm font-black text-white"
          >
            Browse deals
          </Link>
        </section>
      ) : (
        <>
          <section className="mt-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.1em] text-[#6F7D43]">
                Pickup history
              </p>

              <h2 className="mt-1 text-2xl font-black tracking-[-0.04em]">
                Your orders
              </h2>
            </div>

            <span className="shrink-0 text-xs font-bold text-black/35">
              {visibleClaims.length} shown
            </span>
          </section>

          <div className="-mx-3 mt-3 flex gap-2 overflow-x-auto px-3 pb-1 [scrollbar-width:none] sm:-mx-5 sm:px-5 lg:-mx-6 lg:px-6 [&::-webkit-scrollbar]:hidden">
            {filters.map((item) => {
              const active =
                filter === item.value;

              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() =>
                    setFilter(item.value)
                  }
                  className={[
                    "min-h-9 shrink-0 rounded-full px-4 text-xs font-black",
                    active
                      ? "bg-[#18392B] text-white"
                      : "border border-black/[0.07] bg-white text-black/50",
                  ].join(" ")}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          {busy &&
          claims.length === 0 ? (
            <ClaimsGridLoading />
          ) : visibleClaims.length === 0 ? (
            <section className="mt-4 rounded-[1.5rem] border border-black/[0.07] bg-white px-5 py-10 text-center">
              <p className="font-black">
                Nothing here
              </p>

              <p className="mt-2 text-sm text-black/45">
                Try another filter.
              </p>
            </section>
          ) : (
            <section className="mt-4 grid min-w-0 gap-3 md:grid-cols-2 xl:grid-cols-3">
              {visibleClaims.map(
                (claim) => (
                  <ClaimCard
                    key={claim.id}
                    claim={claim}
                    onShowTicket={() =>
                      showTicket(claim.id)
                    }
                  />
                ),
              )}
            </section>
          )}
        </>
      )}

      {ticketOpen &&
      selectedClaim ? (
        <ClaimTicketModal
          claim={selectedClaim}
          onClose={() =>
            setTicketOpen(false)
          }
        />
      ) : null}
    </main>
  );
}

function Metric({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="min-w-0 rounded-xl bg-white/10 px-2 py-3 text-center">
      <p className="truncate text-[8px] font-black uppercase tracking-[0.05em] text-white/45 sm:text-[10px]">
        {label}
      </p>

      <p className="mt-1 text-lg font-black sm:text-xl">
        {value}
      </p>
    </div>
  );
}

function ClaimCard({
  claim,
  onShowTicket,
}: {
  claim: MyClaim;
  onShowTicket: () => void;
}) {
  const state = getClaimState(claim);

  const code =
    getPickupCode(claim);

  const location =
    claim.business_address ||
    claim.business_city ||
    "Location unavailable";

  return (
    <article className="min-w-0 overflow-hidden rounded-[1.45rem] border border-black/[0.07] bg-white">
      <div className="p-4">
        <div className="flex min-w-0 items-start justify-between gap-3">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <ClaimStatus state={state} />

            <span className="rounded-full bg-black/[0.05] px-2.5 py-1 text-[9px] font-black uppercase text-black/40">
              {claim.payment_status}
            </span>
          </div>

          <div className="min-w-0 shrink-0 text-right">
            <p className="text-[8px] font-black uppercase tracking-[0.08em] text-black/30">
              Code
            </p>

            <p className="mt-1 max-w-[110px] break-all font-mono text-xs font-black tracking-[0.08em] text-[#6F7D43] [overflow-wrap:anywhere]">
              {code || "—"}
            </p>
          </div>
        </div>

        <h3 className="mt-4 line-clamp-2 text-lg font-black leading-5 tracking-[-0.025em]">
          {claim.deal_title}
        </h3>

        <p className="mt-1.5 truncate text-sm font-semibold text-black/50">
          {claim.business_name}
        </p>

        <p className="mt-1 line-clamp-2 text-xs leading-5 text-black/40">
          {location}
        </p>

        <div className="mt-4 rounded-xl bg-[#F3F0E8] p-3">
          <p className="flex items-center gap-2 text-xs font-semibold text-black/55">
            <Clock3
              size={14}
              className="shrink-0 text-[#6F7D43]"
              aria-hidden="true"
            />

            {formatDate(
              claim.pickup_start,
            )}{" "}
            · {formatPickupWindow(claim)}
          </p>
        </div>

        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.08em] text-black/30">
              Total
            </p>

            <p className="mt-1 text-lg font-black text-[#18392B]">
              {formatMoney(
                claim.total_price,
              )}
            </p>
          </div>

          <p className="text-xs font-semibold text-black/40">
            Qty {claim.quantity}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 border-t border-black/[0.07] p-3">
        <Link
          href={`/deals/${claim.deal_id}`}
          className="flex min-h-11 items-center justify-center gap-1.5 rounded-xl bg-black/[0.05] px-3 text-xs font-black text-black/55"
        >
          Deal
          <ExternalLink
            size={14}
            aria-hidden="true"
          />
        </Link>

        <button
          type="button"
          onClick={onShowTicket}
          className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#18392B] px-3 text-xs font-black text-white"
        >
          <QrCode
            size={15}
            aria-hidden="true"
          />

          {state === "active"
            ? "Show ticket"
            : "View receipt"}
        </button>
      </div>
    </article>
  );
}

function ClaimTicketModal({
  claim,
  onClose,
}: {
  claim: MyClaim;
  onClose: () => void;
}) {
  const state = getClaimState(claim);

  const code =
    getPickupCode(claim);

  const displayCode =
    formatCodeForDisplay(code);

  const location =
    claim.business_address ||
    claim.business_city ||
    "Location unavailable";

  useEffect(() => {
    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    return () => {
      document.body.style.overflow =
        previousOverflow;
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[2147483550] overflow-y-auto bg-[#F5F2EB] sm:bg-black/45 sm:p-5"
      role="dialog"
      aria-modal="true"
      aria-label="Pickup ticket"
    >
      <div className="mx-auto flex min-h-[100dvh] w-full max-w-lg flex-col bg-[#F5F2EB] sm:min-h-0 sm:rounded-[1.8rem] sm:shadow-[0_25px_80px_rgba(0,0,0,0.28)]">
        <header
          className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-black/[0.07] bg-[#F5F2EB]/95 px-4 py-3 backdrop-blur"
          style={{
            paddingTop:
              "max(12px, env(safe-area-inset-top))",
          }}
        >
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.1em] text-[#6F7D43]">
              ClaimEat ticket
            </p>

            <h1 className="mt-1 text-xl font-black tracking-[-0.035em]">
              {state === "active"
                ? "Pickup ticket"
                : "Order receipt"}
            </h1>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-black/[0.06]"
            aria-label="Close ticket"
          >
            <X
              size={19}
              aria-hidden="true"
            />
          </button>
        </header>

        <div
          className="flex-1 px-4 py-5"
          style={{
            paddingBottom:
              "max(24px, env(safe-area-inset-bottom))",
          }}
        >
          <section className="overflow-hidden rounded-[1.6rem] border border-black/[0.07] bg-white">
            <div className="p-5">
              <div className="flex items-start gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#E9EDDD] text-[#18392B]">
                  <ShoppingBag
                    size={21}
                    aria-hidden="true"
                  />
                </span>

                <div className="min-w-0 flex-1">
                  <h2 className="line-clamp-2 text-lg font-black leading-5">
                    {claim.deal_title}
                  </h2>

                  <p className="mt-1 truncate text-sm text-black/45">
                    {claim.business_name}
                  </p>
                </div>

                <ClaimStatus
                  state={state}
                />
              </div>

              <div
                className={[
                  "mt-5 rounded-[1.5rem] p-4 text-center",
                  state === "expired"
                    ? "bg-[#FFF0EA]"
                    : "bg-[#F3F0E8]",
                ].join(" ")}
              >
                {state === "active" &&
                code ? (
                  <ClaimQr
                    value={code}
                  />
                ) : state ===
                  "collected" ? (
                  <div className="mx-auto grid aspect-square w-full max-w-[240px] place-items-center rounded-[1.5rem] bg-[#E9EDDD] text-[#36562B]">
                    <div>
                      <CheckCircle2
                        size={58}
                        className="mx-auto"
                        aria-hidden="true"
                      />

                      <p className="mt-3 font-black">
                        Collected
                      </p>
                    </div>
                  </div>
                ) : state ===
                  "expired" ? (
                  <div className="mx-auto grid aspect-square w-full max-w-[240px] place-items-center rounded-[1.5rem] bg-white text-[#8A3A20]">
                    <div>
                      <TimerOff
                        size={58}
                        className="mx-auto"
                        aria-hidden="true"
                      />

                      <p className="mt-3 font-black">
                        Pickup expired
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="mx-auto grid aspect-square w-full max-w-[240px] place-items-center rounded-[1.5rem] bg-white text-black/35">
                    QR unavailable
                  </div>
                )}

                <p className="mt-5 text-[9px] font-black uppercase tracking-[0.12em] text-black/35">
                  Pickup code
                </p>

                <p className="mx-auto mt-2 max-w-full break-all font-mono text-[clamp(1.3rem,7vw,2rem)] font-black leading-tight tracking-[0.08em] text-[#18392B] [overflow-wrap:anywhere]">
                  {displayCode || "—"}
                </p>
              </div>

              {state === "active" ? (
                <p className="mt-4 rounded-xl bg-[#E9EDDD] p-3 text-sm font-semibold leading-5 text-[#36562B]">
                  Show this screen to the
                  store during pickup.
                </p>
              ) : null}
            </div>

            <div className="border-t border-black/[0.07] px-5 py-2">
              <TicketInfoRow
                label="Pickup"
                value={`${formatDate(
                  claim.pickup_start,
                )} · ${formatPickupWindow(
                  claim,
                )}`}
              />

              <TicketInfoRow
                label="Location"
                value={location}
              />

              <TicketInfoRow
                label="Order"
                value={`${claim.quantity} × ${claim.deal_title}`}
              />

              <TicketInfoRow
                label="Total"
                value={formatMoney(
                  claim.total_price,
                )}
              />

              <TicketInfoRow
                label="Status"
                value={
                  state === "collected"
                    ? `Collected ${formatDateTime(
                        claim.picked_up_at ||
                          claim.collected_at,
                      )}`
                    : state
                }
                last
              />
            </div>
          </section>

          <Link
            href={`/deals/${claim.deal_id}`}
            onClick={onClose}
            className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#18392B] px-5 text-sm font-black text-white"
          >
            View deal
            <ExternalLink
              size={16}
              aria-hidden="true"
            />
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="mt-2 min-h-11 w-full text-sm font-black text-black/45"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function ClaimStatus({
  state,
}: {
  state: ClaimState;
}) {
  const config = {
    active: {
      label: "Active",
      icon: Clock3,
      className:
        "bg-[#E4EAD7] text-[#36562B]",
    },

    collected: {
      label: "Collected",
      icon: TicketCheck,
      className:
        "bg-[#E4EAD7] text-[#36562B]",
    },

    expired: {
      label: "Expired",
      icon: TimerOff,
      className:
        "bg-[#FFF0EA] text-[#8A3A20]",
    },
  }[state];

  const Icon = config.icon;

  return (
    <span
      className={[
        "inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[9px] font-black uppercase",
        config.className,
      ].join(" ")}
    >
      <Icon
        size={11}
        aria-hidden="true"
      />

      {config.label}
    </span>
  );
}

function TicketInfoRow({
  label,
  value,
  last = false,
}: {
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <div
      className={[
        "flex min-w-0 items-start justify-between gap-4 py-3",
        last
          ? ""
          : "border-b border-black/[0.07]",
      ].join(" ")}
    >
      <span className="shrink-0 text-[9px] font-black uppercase tracking-[0.08em] text-black/35">
        {label}
      </span>

      <span className="min-w-0 break-words text-right text-sm font-semibold capitalize [overflow-wrap:anywhere]">
        {value}
      </span>
    </div>
  );
}

function WalletLoading() {
  return (
    <main className="mx-auto w-full max-w-[1120px] px-3 pt-4 sm:px-5">
      <div className="h-44 animate-pulse rounded-[1.6rem] bg-black/[0.07]" />

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({
          length: 3,
        }).map((_, index) => (
          <div
            key={index}
            className="h-64 animate-pulse rounded-[1.45rem] bg-black/[0.06]"
          />
        ))}
      </div>
    </main>
  );
}

function ClaimsGridLoading() {
  return (
    <section className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({
        length: 3,
      }).map((_, index) => (
        <div
          key={index}
          className="h-64 animate-pulse rounded-[1.45rem] bg-black/[0.06]"
        />
      ))}
    </section>
  );
}
