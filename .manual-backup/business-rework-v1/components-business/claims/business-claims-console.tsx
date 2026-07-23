"use client";

import {
  CheckCircle2,
  Clock3,
  CircleAlert,
  QrCode,
  Search,
  Sparkles,
  TicketCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, type KeyboardEvent, type MouseEvent } from "react";

import {
  redeemClaim,
  type RedeemClaimResult,
} from "@/lib/api/claims";
import {
  fetchBusinessClaims,
  type BusinessClaim,
} from "@/lib/api/business-claims";
import { formatMoney } from "@/lib/utils/format";
import { BusinessQrScannerModal } from "@/components/business/claims/business-qr-scanner-modal";

type ClaimFilter = "all" | "active" | "collected" | "expired";

const filters: { value: ClaimFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "collected", label: "Collected" },
  { value: "expired", label: "Expired" },
];

function extractCodeFromScan(value: string) {
  const trimmed = value.trim();

  if (!trimmed) return "";

  if (trimmed.toUpperCase().startsWith("CLAIMEAT:")) {
    return cleanCode(trimmed.slice("CLAIMEAT:".length));
  }

  try {
    const url = new URL(trimmed);
    const lastPart = url.pathname.split("/").filter(Boolean).pop();

    if (lastPart) {
      return cleanCode(lastPart);
    }
  } catch {
    // not a URL
  }

  return cleanCode(trimmed);
}

function cleanCode(value: string) {
  return value.trim().toUpperCase().replace(/\s+/g, "").replace(/-/g, "");
}

function getDisplayCode(claim: BusinessClaim) {
  return claim.pickup_code || claim.code || claim.qr_code || null;
}

function getRedeemCode(claim: BusinessClaim) {
  return claim.pickup_code || claim.code || claim.qr_code || null;
}

function isCollected(claim: BusinessClaim) {
  return claim.claim_status === "picked_up" || Boolean(claim.picked_up_at);
}

function isExpired(claim: BusinessClaim) {
  if (isCollected(claim)) return false;
  if (claim.claim_status === "expired") return true;
  if (!claim.pickup_end) return false;

  return new Date(claim.pickup_end).getTime() < Date.now();
}

function isActive(claim: BusinessClaim) {
  return !isCollected(claim) && !isExpired(claim);
}

function getClaimState(claim: BusinessClaim) {
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

function formatPickupWindow(claim: BusinessClaim) {
  if (!claim.pickup_start || !claim.pickup_end) return "Pickup TBD";

  return `${formatTime(claim.pickup_start)} - ${formatTime(claim.pickup_end)}`;
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

export function BusinessClaimsConsole({
  initialClaims,
}: {
  initialClaims: BusinessClaim[];
}) {
  const router = useRouter();

  const [claims, setClaims] = useState(initialClaims);
  const [code, setCode] = useState("");
  const [filter, setFilter] = useState<ClaimFilter>("active");
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [result, setResult] = useState<RedeemClaimResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const businessName =
    claims.find((claim) => claim.business_name)?.business_name ||
    "ClaimEat business";

  const stats = useMemo(() => {
    const active = claims.filter(isActive);
    const collected = claims.filter(isCollected);
    const expired = claims.filter(isExpired);

    const recoveryValue = collected.reduce((sum, claim) => {
      return sum + Number(claim.deal_price || 0) * Number(claim.quantity || 1);
    }, 0);

    return {
      active: active.length,
      collected: collected.length,
      expired: expired.length,
      recoveryValue,
    };
  }, [claims]);

  const visibleClaims = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return claims.filter((claim) => {
      const state = getClaimState(claim);

      if (filter !== "all" && state !== filter) return false;

      if (!normalizedSearch) return true;

      const haystack = [
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
        .toLowerCase();

      return haystack.includes(normalizedSearch);
    });
  }, [claims, filter, search]);

  function openDealPage(dealId: string) {
    router.push(`/deals/${dealId}`);
  }

  async function refreshClaims() {
    const nextClaims = await fetchBusinessClaims();
    setClaims(nextClaims);
  }

  useEffect(() => {
    void refreshClaims();
  }, []);

  async function handleRedeem(event?: React.FormEvent<HTMLFormElement>) {
    event?.preventDefault();

    const normalizedCode = cleanCode(code);

    if (!normalizedCode) {
      setError("Enter a claim code.");
      return;
    }

    setBusy(true);
    setError(null);
    setResult(null);

    try {
      const data = await redeemClaim(normalizedCode);
      setResult(data);
      setCode("");
      await refreshClaims();
      setFilter("collected");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not redeem claim.");
    } finally {
      setBusy(false);
    }
  }

  async function handleRedeemExisting(claimCode: string | null) {
    if (!claimCode) return;

    setCode(claimCode);
    setBusy(true);
    setError(null);
    setResult(null);

    try {
      const data = await redeemClaim(claimCode);
      setResult(data);
      await refreshClaims();
      setFilter("collected");
      setCode("");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not redeem claim.");
    } finally {
      setBusy(false);
    }
  }

  async function handleScannedCode(rawCode: string) {
    const normalizedCode = extractCodeFromScan(rawCode);

    if (!normalizedCode) {
      setError("Could not read QR code.");
      return;
    }

    setScannerOpen(false);
    setCode(normalizedCode);
    setBusy(true);
    setError(null);
    setResult(null);

    try {
      const data = await redeemClaim(normalizedCode);
      setResult(data);
      await refreshClaims();
      setFilter("collected");
      setCode("");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not redeem claim.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-7 pb-16">
      <section className="relative overflow-hidden rounded-[2.25rem] bg-[#6F7D43] p-6 text-white shadow-[0_24px_70px_rgba(95,78,55,0.14)] md:p-8">
        <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[#9baa6a]/30 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-32 w-72 rounded-full bg-[#b76e45]/20 blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-wide text-[#dfe8b6]">
              <Sparkles size={14} />
              {businessName}
            </div>

            <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-tight md:text-6xl">
              Pickup operations
            </h1>

            <p className="mt-3 max-w-2xl text-white/62">
              Verify customer codes, track active pickups and mark orders as
              collected in one place.
            </p>
          </div>

          <div className="rounded-[1.5rem] bg-white/10 px-5 py-4 backdrop-blur">
            <p className="text-xs font-black uppercase tracking-wide text-white/45">
              Today
            </p>
            <p className="mt-1 text-2xl font-black">
              {new Intl.DateTimeFormat("en-GB", {
                weekday: "short",
                day: "2-digit",
                month: "short",
              }).format(new Date())}
            </p>
          </div>
        </div>

        <div className="relative z-10 mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Active pickups" value={String(stats.active)} />
          <StatCard label="Collected" value={String(stats.collected)} />
          <StatCard label="Expired" value={String(stats.expired)} />
          <StatCard label="Recovered" value={formatMoney(stats.recoveryValue)} />
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[420px_1fr]">
        <div className="space-y-5">
          <div className="rounded-[1.75rem] bg-white p-5 shadow-[0_10px_30px_rgba(95,78,55,0.08)] ring-1 ring-[#DDD2C2] dark:bg-[#241f1a] dark:ring-white/10 md:p-6">
            <div className="flex items-start gap-4">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#EEF1E3] text-[#6F7D43] dark:bg-[#556235] dark:text-[#E1E9B8]">
                <QrCode size={24} />
              </div>

              <div>
                <h2 className="text-2xl font-black tracking-tight">
                  Verify pickup code
                </h2>

                <p className="mt-1 text-sm leading-6 text-black/55 dark:text-white/45">
                  Enter the customer code from their ClaimEat receipt or QR.
                </p>
              </div>
            </div>

            <form onSubmit={handleRedeem} className="mt-6 space-y-3">
              <input
                value={code}
                onChange={(event) => setCode(event.target.value)}
                placeholder="A8F31C90"
                autoCapitalize="characters"
                className="min-h-14 w-full rounded-2xl border border-black/10 bg-[#FBF8F2] px-4 text-center text-2xl font-black uppercase tracking-[0.22em] outline-none transition placeholder:text-black/20 focus:border-[#6f7d43] dark:border-white/10 dark:bg-[#171411]"
              />

              <button
                type="submit"
                disabled={busy}
                className="w-full rounded-2xl bg-[#6F7D43] px-6 py-4 font-black text-white transition hover:bg-[#556235] disabled:opacity-60 dark:bg-[#9baa6a] dark:text-[#2F261F]"
              >
                {busy ? "Checking..." : "Mark as collected"}
              </button>

              <button
                type="button"
                onClick={() => setScannerOpen(true)}
                disabled={busy}
                className="w-full rounded-2xl bg-[#F4EFE6] px-6 py-4 font-black text-[#6F7D43] transition hover:bg-[#EEF1E3] disabled:opacity-60 dark:bg-[#171411] dark:text-[#E1E9B8]"
              >
                Scan QR
              </button>
            </form>

            {result ? <SuccessBox result={result} /> : null}
            {error ? <ErrorBox message={error} /> : null}
          </div>

          <div className="rounded-[1.75rem] bg-white p-5 shadow-[0_10px_30px_rgba(95,78,55,0.08)] ring-1 ring-[#DDD2C2] dark:bg-[#241f1a] dark:ring-white/10 md:p-6">
            <h3 className="text-lg font-black">Quick guide</h3>

            <div className="mt-4 space-y-3 text-sm leading-6 text-black/55 dark:text-white/45">
              <GuideRow number="1" text="Ask the customer to show their ClaimEat code." />
              <GuideRow number="2" text="Enter the code or scan the QR once scanner is enabled." />
              <GuideRow number="3" text="Only hand over food after the green confirmation." />
            </div>
          </div>
        </div>

        <div className="rounded-[1.75rem] bg-white p-5 shadow-[0_10px_30px_rgba(95,78,55,0.08)] ring-1 ring-[#DDD2C2] dark:bg-[#241f1a] dark:ring-white/10 md:p-6">
          <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-wide text-[#6F7D43] dark:text-[#E1E9B8]">
                Claims
              </p>

              <h2 className="mt-1 text-3xl font-black tracking-tight">
                Pickup queue
              </h2>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-black/35 dark:text-white/30"
                />

                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search code or deal"
                  className="min-h-11 w-full rounded-full border border-black/10 bg-[#FBF8F2] pl-11 pr-4 text-sm font-semibold outline-none focus:border-[#6f7d43] dark:border-white/10 dark:bg-[#171411] sm:w-56"
                />
              </div>

              <div className="flex gap-2 overflow-x-auto">
                {filters.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setFilter(item.value)}
                    className={[
                      "shrink-0 rounded-full px-4 py-2 text-sm font-black transition",
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
          </div>

          <div className="mt-6 space-y-3">
            {visibleClaims.length === 0 ? (
              <div className="rounded-[1.5rem] bg-[#F4EFE6] p-8 text-center dark:bg-[#171411]">
                <p className="text-xl font-black">No claims here</p>
                <p className="mt-2 text-sm text-black/50 dark:text-white/40">
                  Try another filter or search code.
                </p>
              </div>
            ) : (
              visibleClaims.map((claim) => (
                <ClaimCard
                  key={claim.id}
                  claim={claim}
                  busy={busy}
                  onOpenDeal={() => openDealPage(claim.deal_id)}
                  onRedeem={() => handleRedeemExisting(getRedeemCode(claim))}
                />
              ))
            )}
          </div>
        </div>
      </section>

      {scannerOpen ? (
        <BusinessQrScannerModal
          busy={busy}
          onClose={() => setScannerOpen(false)}
          onCode={handleScannedCode}
        />
      ) : null}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.5rem] bg-white/10 p-4 backdrop-blur">
      <p className="text-xs font-black uppercase tracking-wide text-white/42">
        {label}
      </p>
      <p className="mt-2 text-3xl font-black">{value}</p>
    </div>
  );
}

function GuideRow({ number, text }: { number: string; text: string }) {
  return (
    <div className="flex gap-3">
      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#EEF1E3] text-xs font-black text-[#6F7D43] dark:bg-[#556235] dark:text-[#E1E9B8]">
        {number}
      </span>
      <p>{text}</p>
    </div>
  );
}

function SuccessBox({ result }: { result: RedeemClaimResult }) {
  return (
    <div
      className={[
        "mt-5 rounded-[1.5rem] p-4",
        result.already_picked_up
          ? "bg-[#fff6df] text-[#74501f]"
          : "bg-[#eef8e6] text-[#40591f]",
      ].join(" ")}
    >
      <div className="flex items-start gap-3">
        <CheckCircle2 className="mt-0.5 shrink-0" size={22} />

        <div>
          <p className="font-black">
            {result.already_picked_up ? "Already collected" : "Pickup collected"}
          </p>

          <p className="mt-1 text-sm leading-6 opacity-80">
            {result.claim.deal_title} · {result.claim.business_name}
          </p>

          <p className="mt-1 text-xs font-bold uppercase tracking-wide opacity-60">
            Code {result.claim.pickup_code || result.claim.code}
          </p>
        </div>
      </div>
    </div>
  );
}

function ErrorBox({ message }: { message: string }) {
  return (
    <div className="mt-5 rounded-[1.5rem] bg-[#fff0ea] p-4 text-[#8a3a20]">
      <div className="flex items-start gap-3">
        <CircleAlert className="mt-0.5 shrink-0" size={22} />

        <div>
          <p className="font-black">Could not collect code</p>
          <p className="mt-1 text-sm leading-6 opacity-80">{message}</p>
        </div>
      </div>
    </div>
  );
}

function ClaimCard({
  claim,
  busy,
  onRedeem,
  onOpenDeal,
}: {
  claim: BusinessClaim;
  busy: boolean;
  onRedeem: () => void;
  onOpenDeal: () => void;
}) {
  const state = getClaimState(claim);
  const displayCode = getDisplayCode(claim);

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
      title="Open deal page"
      className="group cursor-pointer rounded-[1.5rem] border border-[#DDD2C2] bg-[#FBF8F2] p-4 transition hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#9baa6a] dark:border-white/10 dark:bg-[#171411]"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <StateBadge state={state} />

            <span className="rounded-full bg-black/[0.055] px-3 py-1 text-xs font-black uppercase tracking-wide text-black/45 dark:bg-white/10 dark:text-white/35">
              {claim.payment_status}
            </span>

            <span className="rounded-full bg-[#F4EFE6] px-3 py-1 text-xs font-black uppercase tracking-wide text-black/35 transition group-hover:text-[#6F7D43] dark:bg-[#241f1a] dark:text-white/30 dark:group-hover:text-[#E1E9B8]">
              Open deal
            </span>
          </div>

          <h3 className="mt-3 truncate text-xl font-black tracking-tight transition group-hover:text-[#6F7D43] dark:group-hover:text-[#E1E9B8]">
            {claim.deal_title}
          </h3>

          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-black/50 dark:text-white/40">
            <span>
              Code:{" "}
              <strong className="text-black dark:text-white">
                {displayCode || "Missing"}
              </strong>
            </span>
            <span>Qty: {claim.quantity}</span>
            <span>Pickup: {formatPickupWindow(claim)}</span>
          </div>

          {state === "collected" ? (
            <p className="mt-2 text-sm font-semibold text-[#6F7D43] dark:text-[#E1E9B8]">
              Collected {formatDateTime(claim.picked_up_at)}
            </p>
          ) : null}
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <div className="hidden text-right md:block">
            <p className="text-xs font-black uppercase tracking-wide text-black/35 dark:text-white/30">
              Value
            </p>
            <p className="text-lg font-black text-[#6F7D43] dark:text-[#E1E9B8]">
              {formatMoney(Number(claim.deal_price || 0) * Number(claim.quantity || 1))}
            </p>
          </div>

          {state === "active" ? (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onRedeem();
              }}
              disabled={busy || !displayCode}
              className="rounded-full bg-[#6f7d43] px-5 py-3 text-sm font-black text-white transition hover:bg-[#5d6d32] disabled:opacity-60"
            >
              Mark collected
            </button>
          ) : (
            <div className="grid h-11 w-11 place-items-center rounded-full bg-[#EEF1E3] text-[#6F7D43] dark:bg-[#556235] dark:text-[#E1E9B8]">
              {state === "collected" ? <TicketCheck size={20} /> : <Clock3 size={20} />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StateBadge({ state }: { state: "active" | "collected" | "expired" }) {
  const label = {
    active: "Active",
    collected: "Collected",
    expired: "Expired",
  }[state];

  const className = {
    active: "bg-[#EEF1E3] text-[#6F7D43]",
    collected: "bg-[#e8f6e3] text-[#3f6a2c]",
    expired: "bg-[#fff0ea] text-[#8a3a20]",
  }[state];

  return (
    <span
      className={[
        "rounded-full px-3 py-1 text-xs font-black uppercase tracking-wide",
        className,
      ].join(" ")}
    >
      {label}
    </span>
  );
}
