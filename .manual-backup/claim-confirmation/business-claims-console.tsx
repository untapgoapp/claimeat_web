"use client";

import Link from "next/link";
import {
  CheckCircle2,
  CircleAlert,
  Clock3,
  QrCode,
  RefreshCw,
  Search,
  Store,
  TicketCheck,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";

import { BusinessQrScannerModal } from "@/components/business/claims/business-qr-scanner-modal";
import {
  fetchBusinessClaims,
  type BusinessClaim,
} from "@/lib/api/business-claims";
import {
  redeemClaim,
  type RedeemClaimResult,
} from "@/lib/api/claims";
import { formatMoney } from "@/lib/utils/format";

type ClaimFilter =
  | "all"
  | "active"
  | "collected"
  | "expired";

const filters: {
  value: ClaimFilter;
  label: string;
}[] = [
  { value: "active", label: "Active" },
  { value: "collected", label: "Collected" },
  { value: "expired", label: "Expired" },
  { value: "all", label: "All" },
];

function cleanCode(value: string) {
  return value
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "")
    .replace(/-/g, "");
}

function extractCodeFromScan(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return "";
  }

  if (
    trimmed
      .toUpperCase()
      .startsWith("CLAIMEAT:")
  ) {
    return cleanCode(
      trimmed.slice("CLAIMEAT:".length),
    );
  }

  try {
    const url = new URL(trimmed);

    const lastPart = url.pathname
      .split("/")
      .filter(Boolean)
      .pop();

    if (lastPart) {
      return cleanCode(lastPart);
    }
  } catch {
    // The QR content is not a URL.
  }

  return cleanCode(trimmed);
}

function getDisplayCode(
  claim: BusinessClaim,
) {
  return (
    claim.pickup_code ||
    claim.code ||
    claim.qr_code ||
    null
  );
}

function isCollected(
  claim: BusinessClaim,
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

function isExpired(claim: BusinessClaim) {
  if (isCollected(claim)) {
    return false;
  }

  if (claim.claim_status === "expired") {
    return true;
  }

  if (!claim.pickup_end) {
    return false;
  }

  const pickupEnd = new Date(
    claim.pickup_end,
  );

  return (
    !Number.isNaN(pickupEnd.getTime()) &&
    pickupEnd.getTime() < Date.now()
  );
}

function getClaimState(
  claim: BusinessClaim,
): Exclude<ClaimFilter, "all"> {
  if (isCollected(claim)) {
    return "collected";
  }

  if (isExpired(claim)) {
    return "expired";
  }

  return "active";
}

function formatTime(value: string | null) {
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

function formatPickupWindow(
  claim: BusinessClaim,
) {
  if (
    !claim.pickup_start ||
    !claim.pickup_end
  ) {
    return "Pickup TBD";
  }

  return `${formatTime(
    claim.pickup_start,
  )}–${formatTime(claim.pickup_end)}`;
}

function formatDateTime(
  value: string | null,
) {
  if (!value) {
    return "Not recorded";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
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

export function BusinessClaimsConsole({
  initialClaims,
}: {
  initialClaims: BusinessClaim[];
}) {
  const [claims, setClaims] =
    useState(initialClaims);

  const [code, setCode] =
    useState("");

  const [filter, setFilter] =
    useState<ClaimFilter>("active");

  const [search, setSearch] =
    useState("");

  const [busy, setBusy] =
    useState(false);

  const [loading, setLoading] =
    useState(initialClaims.length === 0);

  const [scannerOpen, setScannerOpen] =
    useState(false);

  const [result, setResult] =
    useState<RedeemClaimResult | null>(
      null,
    );

  const [error, setError] =
    useState<string | null>(null);

  const businessName =
    claims.find(
      (claim) => claim.business_name,
    )?.business_name || "Your store";

  const stats = useMemo(() => {
    const active = claims.filter(
      (claim) =>
        getClaimState(claim) === "active",
    );

    const collected = claims.filter(
      (claim) =>
        getClaimState(claim) ===
        "collected",
    );

    const expired = claims.filter(
      (claim) =>
        getClaimState(claim) ===
        "expired",
    );

    const recovered = collected.reduce(
      (total, claim) =>
        total +
        Number(claim.deal_price || 0) *
          Number(claim.quantity || 1),
      0,
    );

    return {
      active: active.length,
      collected: collected.length,
      expired: expired.length,
      recovered,
    };
  }, [claims]);

  const visibleClaims = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    return claims.filter((claim) => {
      const state = getClaimState(claim);

      if (
        filter !== "all" &&
        state !== filter
      ) {
        return false;
      }

      if (!query) {
        return true;
      }

      return [
        claim.code,
        claim.pickup_code,
        claim.qr_code,
        claim.deal_title,
        claim.business_name,
        claim.payment_status,
        claim.claim_status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(query);
    });
  }, [claims, filter, search]);

  async function refreshClaims() {
    setLoading(true);

    try {
      const nextClaims =
        await fetchBusinessClaims();

      setClaims(nextClaims);
    } catch (refreshError) {
      setError(
        refreshError instanceof Error
          ? refreshError.message
          : "Could not refresh claims.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refreshClaims();
  }, []);

  async function redeemCode(
    rawCode: string,
  ) {
    const normalizedCode =
      cleanCode(rawCode);

    if (!normalizedCode) {
      setError("Enter a pickup code.");
      return;
    }

    setBusy(true);
    setError(null);
    setResult(null);

    try {
      const nextResult =
        await redeemClaim(normalizedCode);

      setResult(nextResult);
      setCode("");

      await refreshClaims();

      setFilter("collected");
    } catch (redeemError) {
      setError(
        redeemError instanceof Error
          ? redeemError.message
          : "Could not collect claim.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    await redeemCode(code);
  }

  async function handleScannedCode(
    rawCode: string,
  ) {
    setScannerOpen(false);

    const scannedCode =
      extractCodeFromScan(rawCode);

    if (!scannedCode) {
      setError("Could not read QR code.");
      return;
    }

    await redeemCode(scannedCode);
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

            {businessName}
          </p>

          <h1 className="mt-2 text-[2rem] font-black leading-none tracking-[-0.045em]">
            Claims
          </h1>

          <p className="mt-2 text-sm leading-5 text-black/45">
            Scan or enter a customer code
            before handing over the food.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            void refreshClaims()
          }
          disabled={loading || busy}
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-black/[0.07] bg-white text-[#18392B] shadow-sm disabled:opacity-50"
          aria-label="Refresh claims"
        >
          <RefreshCw
            size={19}
            className={
              loading ? "animate-spin" : ""
            }
            aria-hidden="true"
          />
        </button>
      </header>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <StatCard
          label="Active"
          value={String(stats.active)}
        />

        <StatCard
          label="Collected"
          value={String(stats.collected)}
        />

        <StatCard
          label="Expired"
          value={String(stats.expired)}
        />

        <StatCard
          label="Recovered"
          value={formatMoney(
            stats.recovered,
          )}
        />
      </div>

      <section className="mt-5 rounded-[1.5rem] border border-black/[0.07] bg-white p-4 shadow-[0_5px_18px_rgba(35,39,31,0.04)]">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#E9EDDD] text-[#18392B]">
            <QrCode
              size={21}
              aria-hidden="true"
            />
          </span>

          <div>
            <h2 className="text-lg font-black">
              Collect a claim
            </h2>

            <p className="mt-0.5 text-xs leading-5 text-black/45">
              Scan the QR or enter the
              pickup code manually.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-4"
        >
          <input
            value={code}
            onChange={(event) =>
              setCode(event.target.value)
            }
            placeholder="A8F31C90"
            autoCapitalize="characters"
            autoCorrect="off"
            spellCheck={false}
            inputMode="text"
            className="min-h-13 w-full min-w-0 rounded-xl border border-black/10 bg-[#F7F4ED] px-3 text-center text-lg font-black uppercase tracking-[0.12em] outline-none placeholder:text-black/20 focus:border-[#6F7D43]"
          />

          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              type="submit"
              disabled={busy}
              className="min-h-12 rounded-xl bg-[#18392B] px-3 text-sm font-black text-white disabled:opacity-50"
            >
              {busy
                ? "Checking…"
                : "Collect"}
            </button>

            <button
              type="button"
              onClick={() =>
                setScannerOpen(true)
              }
              disabled={busy}
              className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#E9EDDD] px-3 text-sm font-black text-[#18392B] disabled:opacity-50"
            >
              <QrCode
                size={18}
                aria-hidden="true"
              />
              Scan QR
            </button>
          </div>
        </form>

        {result ? (
          <SuccessBox result={result} />
        ) : null}

        {error ? (
          <ErrorBox message={error} />
        ) : null}
      </section>

      <section className="mt-6">
        <div className="relative">
          <Search
            size={17}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/35"
            aria-hidden="true"
          />

          <input
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search code or deal"
            className="min-h-11 w-full rounded-full border border-black/[0.08] bg-white pl-10 pr-4 text-sm font-semibold outline-none focus:border-[#6F7D43]"
          />
        </div>

        <div className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
      </section>

      <section className="mt-4 space-y-3">
        {loading && claims.length === 0 ? (
          <ClaimsLoading />
        ) : visibleClaims.length === 0 ? (
          <div className="rounded-[1.5rem] border border-black/[0.06] bg-white px-5 py-10 text-center">
            <TicketCheck
              size={28}
              className="mx-auto text-[#6F7D43]"
              aria-hidden="true"
            />

            <h2 className="mt-4 text-lg font-black">
              No claims here
            </h2>

            <p className="mt-2 text-sm text-black/45">
              Try another filter or search.
            </p>
          </div>
        ) : (
          visibleClaims.map((claim) => (
            <ClaimCard
              key={claim.id}
              claim={claim}
              busy={busy}
              onRedeem={() =>
                void redeemCode(
                  getDisplayCode(claim) || "",
                )
              }
            />
          ))
        )}
      </section>

      {scannerOpen ? (
        <BusinessQrScannerModal
          busy={busy}
          onClose={() =>
            setScannerOpen(false)
          }
          onCode={handleScannedCode}
        />
      ) : null}
    </section>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <article className="min-h-[86px] rounded-[1.25rem] border border-black/[0.07] bg-white p-3.5">
      <p className="text-[10px] font-black uppercase tracking-[0.08em] text-black/35">
        {label}
      </p>

      <p className="mt-2 truncate text-xl font-black tracking-[-0.035em] text-[#18392B]">
        {value}
      </p>
    </article>
  );
}

function ClaimCard({
  claim,
  busy,
  onRedeem,
}: {
  claim: BusinessClaim;
  busy: boolean;
  onRedeem: () => void;
}) {
  const state = getClaimState(claim);

  const displayCode =
    getDisplayCode(claim);

  const value =
    Number(claim.deal_price || 0) *
    Number(claim.quantity || 1);

  return (
    <article className="overflow-hidden rounded-[1.4rem] border border-black/[0.07] bg-white">
      <div className="p-4">
        <div className="flex flex-wrap items-center gap-2">
          <StateBadge state={state} />

          <span className="rounded-full bg-black/[0.05] px-2.5 py-1 text-[10px] font-black uppercase text-black/40">
            {claim.payment_status}
          </span>
        </div>

        <div className="mt-3 flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h2 className="line-clamp-2 text-base font-black leading-5">
              {claim.deal_title}
            </h2>

            <p className="mt-1.5 flex items-center gap-1.5 text-xs text-black/45">
              <Clock3
                size={13}
                className="shrink-0 text-[#6F7D43]"
                aria-hidden="true"
              />

              {formatPickupWindow(claim)}
            </p>
          </div>

          <p className="shrink-0 text-base font-black text-[#18392B]">
            {formatMoney(value)}
          </p>
        </div>

        <div className="mt-3 rounded-xl bg-[#F3F0E8] px-3 py-2.5">
          <p className="text-[9px] font-black uppercase tracking-[0.1em] text-black/35">
            Pickup code
          </p>

          <p className="mt-1 min-w-0 break-all font-mono text-base font-black tracking-[0.1em] text-[#18392B] [overflow-wrap:anywhere]">
            {displayCode || "Missing code"}
          </p>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3 text-xs text-black/45">
          <span>
            Quantity:{" "}
            <strong className="text-black/70">
              {claim.quantity}
            </strong>
          </span>

          {state === "collected" ? (
            <span className="text-right font-semibold text-[#55733D]">
              {formatDateTime(
                claim.picked_up_at ||
                  claim.collected_at,
              )}
            </span>
          ) : (
            <Link
              href={`/deals/${claim.deal_id}`}
              className="font-black text-[#6F7D43]"
            >
              Open deal
            </Link>
          )}
        </div>
      </div>

      {state === "active" ? (
        <button
          type="button"
          onClick={onRedeem}
          disabled={busy || !displayCode}
          className="min-h-12 w-full border-t border-black/[0.07] bg-[#18392B] px-4 text-sm font-black text-white disabled:bg-black/15 disabled:text-black/35"
        >
          Mark as collected
        </button>
      ) : null}
    </article>
  );
}

function StateBadge({
  state,
}: {
  state:
    | "active"
    | "collected"
    | "expired";
}) {
  const styles = {
    active:
      "bg-[#FFF0C7] text-[#715914]",
    collected:
      "bg-[#E4EAD7] text-[#36562B]",
    expired:
      "bg-[#F2E4DE] text-[#8A3A20]",
  };

  return (
    <span
      className={[
        "rounded-full px-2.5 py-1 text-[10px] font-black uppercase",
        styles[state],
      ].join(" ")}
    >
      {state}
    </span>
  );
}

function SuccessBox({
  result,
}: {
  result: RedeemClaimResult;
}) {
  return (
    <div className="mt-3 flex gap-3 rounded-xl bg-[#EAF4E3] p-3 text-[#36562B]">
      <CheckCircle2
        size={20}
        className="shrink-0"
        aria-hidden="true"
      />

      <div className="min-w-0">
        <p className="font-black">
          {result.already_picked_up
            ? "Already collected"
            : "Pickup collected"}
        </p>

        <p className="mt-1 truncate text-xs opacity-75">
          {result.claim.deal_title}
        </p>

        <p className="mt-1 break-all font-mono text-xs font-bold [overflow-wrap:anywhere]">
          {result.claim.pickup_code ||
            result.claim.code ||
            "No code"}
        </p>
      </div>
    </div>
  );
}

function ErrorBox({
  message,
}: {
  message: string;
}) {
  return (
    <div className="mt-3 flex gap-3 rounded-xl bg-[#FFF0EA] p-3 text-[#8A3A20]">
      <CircleAlert
        size={20}
        className="shrink-0"
        aria-hidden="true"
      />

      <div>
        <p className="font-black">
          Could not collect
        </p>

        <p className="mt-1 text-xs leading-5 opacity-80">
          {message}
        </p>
      </div>
    </div>
  );
}

function ClaimsLoading() {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({
        length: 3,
      }).map((_, index) => (
        <div
          key={index}
          className="h-48 rounded-[1.4rem] bg-black/[0.06]"
        />
      ))}
    </div>
  );
}
