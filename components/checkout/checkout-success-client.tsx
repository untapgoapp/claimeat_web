"use client";

import Link from "next/link";
import { CheckCircle2, Clock3, QrCode } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";

import { fetchMyClaims, type MyClaim } from "@/lib/api/my-claims";
import { formatMoney } from "@/lib/utils/format";

function getPickupCode(claim: MyClaim) {
  return claim.pickup_code || claim.code || claim.qr_code || "";
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

function formatPickupWindow(claim: MyClaim) {
  if (!claim.pickup_start || !claim.pickup_end) return "Pickup TBD";

  return `${formatTime(claim.pickup_start)} - ${formatTime(claim.pickup_end)}`;
}

export function CheckoutSuccessClient() {
  const searchParams = useSearchParams();
  const claimId = searchParams.get("claimId");

  const [claim, setClaim] = useState<MyClaim | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("Confirming your pickup code...");

  useEffect(() => {
    let cancelled = false;

    async function loadClaim() {
      setLoading(true);

      for (let attempt = 0; attempt < 8; attempt += 1) {
        try {
          const claims = await fetchMyClaims();
          const foundClaim = claimId
            ? claims.find((item) => item.id === claimId)
            : claims[0];

          if (foundClaim) {
            if (!cancelled) {
              setClaim(foundClaim);
              setLoading(false);
            }
            return;
          }

          if (!cancelled) {
            setMessage("Still preparing your pickup ticket...");
          }
        } catch (error) {
          if (!cancelled) {
            setMessage(
              error instanceof Error
                ? error.message
                : "Could not load your pickup ticket."
            );
          }
        }

        await new Promise((resolve) => setTimeout(resolve, 1200));
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
      <main className="mx-auto flex min-h-[60vh] w-full max-w-3xl items-center justify-center px-4 py-12">
        <div className="w-full rounded-[2.25rem] bg-white p-8 text-center shadow-[0_10px_30px_rgba(95,78,55,0.08)] ring-1 ring-[#DDD2C2] dark:bg-[#241f1a] dark:ring-white/10">
          <div className="mx-auto grid h-16 w-16 animate-pulse place-items-center rounded-full bg-[#EEF1E3] text-[#6F7D43] dark:bg-[#556235] dark:text-[#E1E9B8]">
            <Clock3 size={28} />
          </div>

          <p className="mt-6 text-sm font-black uppercase tracking-wide text-[#6F7D43] dark:text-[#E1E9B8]">
            Payment received
          </p>

          <h1 className="mt-2 text-4xl font-black tracking-tight">
            {message}
          </h1>

          <p className="mt-3 text-black/50 dark:text-white/40">
            This usually takes a second.
          </p>
        </div>
      </main>
    );
  }

  if (!claim) {
    return (
      <main className="mx-auto flex min-h-[60vh] w-full max-w-3xl items-center justify-center px-4 py-12">
        <div className="w-full rounded-[2.25rem] bg-white p-8 text-center shadow-[0_10px_30px_rgba(95,78,55,0.08)] ring-1 ring-[#DDD2C2] dark:bg-[#241f1a] dark:ring-white/10">
          <p className="text-sm font-black uppercase tracking-wide text-[#6F7D43] dark:text-[#E1E9B8]">
            Payment received
          </p>

          <h1 className="mt-2 text-4xl font-black tracking-tight">
            Your order is being prepared
          </h1>

          <p className="mt-3 text-black/55 dark:text-white/45">
            The payment went through, but the ticket did not load here yet.
          </p>

          <Link
            href="/my-claims"
            className="mt-6 inline-flex rounded-full bg-[#6F7D43] px-6 py-3 font-black text-white transition hover:bg-[#556235] dark:bg-[#9baa6a] dark:text-[#2F261F]"
          >
            Go to My orders
          </Link>
        </div>
      </main>
    );
  }

  const pickupCode = getPickupCode(claim);

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10">
      <section className="overflow-hidden rounded-[2.25rem] bg-white shadow-[0_24px_80px_rgba(63,45,22,0.1)] ring-1 ring-[#DDD2C2] dark:bg-[#241f1a] dark:ring-white/10">
        <div className="bg-[#6F7D43] p-8 text-center text-white">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#EEF1E3] text-[#6F7D43]">
            <CheckCircle2 size={32} />
          </div>

          <p className="mt-5 text-sm font-black uppercase tracking-wide text-[#dfe8b6]">
            Payment successful
          </p>

          <h1 className="mt-2 text-4xl font-black tracking-tight">
            Your pickup code is ready
          </h1>

          <p className="mt-3 text-white/60">
            Show this code or QR at the store.
          </p>
        </div>

        <div className="grid gap-0 lg:grid-cols-[360px_1fr]">
          <div className="bg-[#F4EFE6] p-7 text-center dark:bg-[#171411]">
            <div className="mx-auto grid h-64 w-64 place-items-center rounded-[1.75rem] bg-white p-5 shadow-[0_10px_30px_rgba(95,78,55,0.08)]">
              {pickupCode ? (
                <QRCodeSVG value={pickupCode} size={210} level="M" />
              ) : (
                <QrCode size={72} className="text-black/20" />
              )}
            </div>

            <p className="mt-5 text-xs font-black uppercase tracking-[0.22em] text-black/35 dark:text-white/30">
              Pickup code
            </p>

            <p className="mt-2 text-4xl font-black tracking-[0.16em]">
              {pickupCode || "—"}
            </p>
          </div>

          <div className="p-7">
            <h2 className="text-3xl font-black tracking-tight">
              {claim.deal_title}
            </h2>

            <p className="mt-2 text-black/50 dark:text-white/40">
              {claim.business_name} · {claim.business_address || claim.business_city}
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <InfoTile label="Pickup" value={formatPickupWindow(claim)} />
              <InfoTile label="Total" value={formatMoney(claim.total_price)} />
              <InfoTile label="Quantity" value={String(claim.quantity)} />
              <InfoTile label="Status" value={claim.payment_status} />
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/my-claims"
                className="inline-flex flex-1 justify-center rounded-2xl bg-[#6F7D43] px-6 py-4 font-black text-white transition hover:bg-[#556235] dark:bg-[#9baa6a] dark:text-[#2F261F]"
              >
                Go to My orders
              </Link>

              <Link
                href={`/deals/${claim.deal_id}`}
                className="inline-flex justify-center rounded-2xl bg-[#F4EFE6] px-6 py-4 font-black text-[#6F7D43] transition hover:bg-[#EEF1E3] dark:bg-[#171411] dark:text-[#E1E9B8]"
              >
                View deal
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.25rem] bg-[#F4EFE6] p-4 dark:bg-[#171411]">
      <p className="text-xs font-black uppercase tracking-wide text-black/35 dark:text-white/30">
        {label}
      </p>
      <p className="mt-1 font-black capitalize">{value}</p>
    </div>
  );
}
