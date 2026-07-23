"use client";

import Link from "next/link";
import {
  Check,
  CheckCircle2,
  Clock3,
  MapPin,
  PackageCheck,
  ShoppingBag,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { ClaimQr } from "@/components/claim-qr";
import {
  fetchMyClaims,
  type MyClaim,
} from "@/lib/api/my-claims";
import { formatMoney } from "@/lib/utils/format";

function getPickupCode(claim: MyClaim) {
  return (
    claim.pickup_code ||
    claim.code ||
    claim.qr_code ||
    ""
  );
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

function formatPickupDate(
  value: string | null,
) {
  if (!value) {
    return "Date to be confirmed";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date to be confirmed";
  }

  return new Intl.DateTimeFormat(
    "en-GB",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
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
    return "Pickup time to be confirmed";
  }

  return `${formatTime(
    claim.pickup_start,
  )}–${formatTime(claim.pickup_end)}`;
}

function formatStatus(
  value: string | null | undefined,
) {
  if (!value) {
    return "Confirmed";
  }

  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase(),
    );
}

export function CheckoutSuccessClient() {
  const searchParams = useSearchParams();

  const claimId =
    searchParams.get("claimId");

  const [claim, setClaim] =
    useState<MyClaim | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [message, setMessage] =
    useState(
      "Confirming your pickup ticket…",
    );

  useEffect(() => {
    let cancelled = false;

    async function loadClaim() {
      setLoading(true);

      for (
        let attempt = 0;
        attempt < 8;
        attempt += 1
      ) {
        try {
          const claims =
            await fetchMyClaims();

          const foundClaim = claimId
            ? claims.find(
                (item) =>
                  item.id === claimId,
              )
            : claims[0];

          if (foundClaim) {
            if (!cancelled) {
              setClaim(foundClaim);
              setLoading(false);
            }

            return;
          }

          if (!cancelled) {
            setMessage(
              "Preparing your pickup ticket…",
            );
          }
        } catch (error) {
          if (!cancelled) {
            setMessage(
              error instanceof Error
                ? error.message
                : "Could not load your pickup ticket.",
            );
          }
        }

        await new Promise((resolve) =>
          setTimeout(resolve, 1200),
        );
      }

      if (!cancelled) {
        setLoading(false);
      }
    }

    void loadClaim();

    return () => {
      cancelled = true;
    };
  }, [claimId]);

  if (loading) {
    return (
      <main className="grid min-h-[100dvh] place-items-center bg-[#F5F2EB] px-4 py-8">
        <section className="w-full max-w-md text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#E9EDDD] text-[#18392B]">
            <Clock3
              size={28}
              className="animate-pulse"
              aria-hidden="true"
            />
          </span>

          <p className="mt-5 text-[11px] font-black uppercase tracking-[0.12em] text-[#6F7D43]">
            Payment received
          </p>

          <h1 className="mx-auto mt-2 max-w-sm text-2xl font-black leading-8 tracking-[-0.04em] text-[#23271F]">
            {message}
          </h1>

          <p className="mt-3 text-sm text-black/45">
            This usually takes just a
            moment.
          </p>

          <div className="mt-7 overflow-hidden rounded-full bg-black/[0.06]">
            <div className="h-1.5 w-1/2 animate-pulse rounded-full bg-[#6F7D43]" />
          </div>
        </section>
      </main>
    );
  }

  if (!claim) {
    return (
      <main className="grid min-h-[100dvh] place-items-center bg-[#F5F2EB] px-4 py-8">
        <section className="w-full max-w-md rounded-[1.75rem] border border-black/[0.07] bg-white p-6 text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#E9EDDD] text-[#18392B]">
            <PackageCheck
              size={29}
              aria-hidden="true"
            />
          </span>

          <p className="mt-5 text-[11px] font-black uppercase tracking-[0.12em] text-[#6F7D43]">
            Payment received
          </p>

          <h1 className="mt-2 text-2xl font-black tracking-[-0.04em]">
            Your order is being prepared
          </h1>

          <p className="mt-3 text-sm leading-6 text-black/50">
            Your payment was successful,
            but the pickup ticket has not
            appeared here yet.
          </p>

          <Link
            href="/my-claims"
            className="mt-6 flex min-h-12 w-full items-center justify-center rounded-xl bg-[#18392B] px-5 text-sm font-black text-white"
          >
            Open My orders
          </Link>

          <Link
            href="/deals"
            className="mt-2 flex min-h-12 w-full items-center justify-center rounded-xl bg-black/[0.05] px-5 text-sm font-black text-black/55"
          >
            Back to deals
          </Link>
        </section>
      </main>
    );
  }

  const pickupCode =
    getPickupCode(claim);

  const displayCode =
    formatCodeForDisplay(
      pickupCode,
    );

  const location =
    claim.business_address ||
    claim.business_city ||
    "Store address not available";

  return (
    <main
      className="min-h-[100dvh] bg-[#F5F2EB] px-4"
      style={{
        paddingTop:
          "max(24px, env(safe-area-inset-top))",
        paddingBottom:
          "max(28px, env(safe-area-inset-bottom))",
      }}
    >
      <div className="mx-auto w-full max-w-md">
        <header className="text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#18392B] text-white shadow-[0_12px_30px_rgba(24,57,43,0.2)]">
            <CheckCircle2
              size={31}
              aria-hidden="true"
            />
          </span>

          <p className="mt-5 text-[11px] font-black uppercase tracking-[0.13em] text-[#6F7D43]">
            Payment successful
          </p>

          <h1 className="mt-2 text-[2rem] font-black leading-9 tracking-[-0.05em] text-[#23271F]">
            Your order is confirmed
          </h1>

          <p className="mt-2 text-sm leading-5 text-black/45">
            Show this ticket when you
            collect your food.
          </p>
        </header>

        <section className="mt-6 overflow-hidden rounded-[1.75rem] border border-black/[0.07] bg-white shadow-[0_14px_40px_rgba(35,39,31,0.08)]">
          <div className="p-5">
            <div className="flex items-start gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#E9EDDD] text-[#18392B]">
                <ShoppingBag
                  size={21}
                  aria-hidden="true"
                />
              </span>

              <div className="min-w-0">
                <h2 className="line-clamp-2 text-lg font-black leading-5 tracking-[-0.025em]">
                  {claim.deal_title}
                </h2>

                <p className="mt-1 truncate text-sm text-black/45">
                  {claim.business_name}
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-[1.5rem] bg-[#F3F0E8] p-4">
              {pickupCode ? (
                <ClaimQr
                  value={pickupCode}
                />
              ) : (
                <div className="mx-auto grid aspect-square w-full max-w-[260px] place-items-center rounded-[1.5rem] bg-white text-center">
                  <p className="text-sm font-black text-black/40">
                    QR code unavailable
                  </p>
                </div>
              )}

              <p className="mt-5 text-center text-[10px] font-black uppercase tracking-[0.12em] text-black/35">
                Pickup code
              </p>

              <p className="mx-auto mt-2 max-w-full break-all text-center font-mono text-[clamp(1.35rem,7vw,2rem)] font-black leading-tight tracking-[0.08em] text-[#18392B] [overflow-wrap:anywhere]">
                {displayCode || "—"}
              </p>
            </div>

            <div className="mt-5 rounded-xl bg-[#E9EDDD] px-4 py-3">
              <p className="flex items-start gap-2 text-sm font-semibold leading-5 text-[#36562B]">
                <Check
                  size={17}
                  className="mt-0.5 shrink-0"
                  aria-hidden="true"
                />

                Keep this screen available
                and show it to the store
                when collecting.
              </p>
            </div>
          </div>

          <div className="border-t border-black/[0.07] px-5 py-4">
            <InfoRow
              icon={Clock3}
              label={formatPickupDate(
                claim.pickup_start,
              )}
              value={formatPickupWindow(
                claim,
              )}
            />

            <InfoRow
              icon={MapPin}
              label={claim.business_name}
              value={location}
            />

            <InfoRow
              icon={PackageCheck}
              label={`${claim.quantity} ${
                claim.quantity === 1
                  ? "item"
                  : "items"
              }`}
              value={`${formatMoney(
                claim.total_price,
              )} · ${formatStatus(
                claim.payment_status,
              )}`}
              last
            />
          </div>
        </section>

        <div className="mt-4 space-y-2">
          <Link
            href="/my-claims"
            className="flex min-h-13 w-full items-center justify-center rounded-xl bg-[#18392B] px-5 text-sm font-black text-white shadow-[0_8px_22px_rgba(24,57,43,0.16)]"
          >
            View My orders
          </Link>

          <Link
            href={`/deals/${claim.deal_id}`}
            className="flex min-h-12 w-full items-center justify-center rounded-xl bg-white px-5 text-sm font-black text-[#18392B]"
          >
            View deal
          </Link>

          <Link
            href="/deals"
            className="flex min-h-11 w-full items-center justify-center text-sm font-black text-black/45"
          >
            Continue browsing
          </Link>
        </div>
      </div>
    </main>
  );
}

type InfoIcon = typeof Clock3;

function InfoRow({
  icon: Icon,
  label,
  value,
  last = false,
}: {
  icon: InfoIcon;
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <div
      className={[
        "flex items-start gap-3 py-3",
        last
          ? ""
          : "border-b border-black/[0.07]",
      ].join(" ")}
    >
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#F3F0E8] text-[#6F7D43]">
        <Icon
          size={17}
          aria-hidden="true"
        />
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-black">
          {label}
        </p>

        <p className="mt-0.5 break-words text-xs leading-5 text-black/45 [overflow-wrap:anywhere]">
          {value}
        </p>
      </div>
    </div>
  );
}
