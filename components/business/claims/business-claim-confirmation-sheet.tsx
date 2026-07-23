"use client";

import {
  CheckCircle2,
  CircleAlert,
  QrCode,
  ShoppingBag,
  X,
} from "lucide-react";
import { useEffect } from "react";

import type { LookupClaimResult } from "@/lib/api/claims";

export function BusinessClaimConfirmationSheet({
  claim,
  code,
  busy,
  onClose,
  onConfirm,
}: {
  claim: LookupClaimResult;
  code: string;
  busy: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const normalizedStatus =
    claim.claim_status
      .trim()
      .toLowerCase();

  const normalizedPayment =
    claim.payment_status
      .trim()
      .toLowerCase();

  const alreadyCollected = [
    "picked_up",
    "collected",
  ].includes(normalizedStatus);

  const paymentComplete =
    normalizedPayment === "paid";

  const canCollect =
    paymentComplete &&
    !alreadyCollected;

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
    <div className="fixed inset-0 z-[2147483550] flex items-end bg-black/45 sm:items-center sm:justify-center sm:p-5">
      <button
        type="button"
        className="absolute inset-0"
        onClick={onClose}
        disabled={busy}
        aria-label="Close claim confirmation"
      />

      <section
        className="relative z-10 w-full rounded-t-[1.8rem] bg-[#F5F2EB] px-5 pt-4 shadow-[0_-20px_60px_rgba(0,0,0,0.22)] sm:max-w-md sm:rounded-[1.8rem]"
        style={{
          paddingBottom:
            "max(18px, env(safe-area-inset-bottom))",
        }}
      >
        <div className="mx-auto h-1.5 w-10 rounded-full bg-black/15 sm:hidden" />

        <header className="mt-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.12em] text-[#6F7D43]">
              Confirm collection
            </p>

            <h2 className="mt-2 text-2xl font-black tracking-[-0.04em]">
              Check the order
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-black/[0.06] disabled:opacity-40"
            aria-label="Close"
          >
            <X
              size={18}
              aria-hidden="true"
            />
          </button>
        </header>

        <div className="mt-5 rounded-[1.4rem] border border-black/[0.07] bg-white p-4">
          <div className="flex items-start gap-3">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#E9EDDD] text-[#18392B]">
              <ShoppingBag
                size={22}
                aria-hidden="true"
              />
            </span>

            <div className="min-w-0">
              <h3 className="line-clamp-2 text-lg font-black leading-5">
                {claim.deal_title}
              </h3>

              <p className="mt-1 text-sm text-black/45">
                {claim.business_name}
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-xl bg-[#F3F0E8] px-3 py-3">
            <p className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.1em] text-black/35">
              <QrCode
                size={12}
                aria-hidden="true"
              />

              Pickup code
            </p>

            <p className="mt-1 break-all font-mono text-xl font-black tracking-[0.1em] text-[#18392B] [overflow-wrap:anywhere]">
              {code}
            </p>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <StatusTile
              label="Payment"
              value={
                paymentComplete
                  ? "Paid"
                  : claim.payment_status
              }
              good={paymentComplete}
            />

            <StatusTile
              label="Claim"
              value={
                alreadyCollected
                  ? "Collected"
                  : claim.claim_status
              }
              good={!alreadyCollected}
            />
          </div>
        </div>

        {!paymentComplete ? (
          <div className="mt-4 flex gap-3 rounded-xl bg-[#FFF0EA] p-4 text-[#8A3A20]">
            <CircleAlert
              size={20}
              className="shrink-0"
              aria-hidden="true"
            />

            <div>
              <p className="font-black">
                Payment not confirmed
              </p>

              <p className="mt-1 text-sm leading-5 opacity-80">
                Do not hand over the food
                until the claim is paid.
              </p>
            </div>
          </div>
        ) : null}

        {alreadyCollected ? (
          <div className="mt-4 flex gap-3 rounded-xl bg-[#E9EDDD] p-4 text-[#36562B]">
            <CheckCircle2
              size={20}
              className="shrink-0"
              aria-hidden="true"
            />

            <div>
              <p className="font-black">
                Already collected
              </p>

              <p className="mt-1 text-sm leading-5 opacity-80">
                This code has already been
                redeemed.
              </p>
            </div>
          </div>
        ) : null}

        <div className="mt-5 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="min-h-12 rounded-xl bg-black/[0.06] text-sm font-black text-black/55 disabled:opacity-40"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={busy || !canCollect}
            className="min-h-12 rounded-xl bg-[#18392B] px-3 text-sm font-black text-white disabled:bg-black/[0.08] disabled:text-black/30"
          >
            {busy
              ? "Collecting…"
              : alreadyCollected
                ? "Already collected"
                : !paymentComplete
                  ? "Payment required"
                  : "Confirm collection"}
          </button>
        </div>
      </section>
    </div>
  );
}

function StatusTile({
  label,
  value,
  good,
}: {
  label: string;
  value: string;
  good: boolean;
}) {
  return (
    <div
      className={[
        "rounded-xl px-3 py-2.5",
        good
          ? "bg-[#E9EDDD] text-[#36562B]"
          : "bg-[#FFF0EA] text-[#8A3A20]",
      ].join(" ")}
    >
      <p className="text-[9px] font-black uppercase tracking-[0.08em] opacity-55">
        {label}
      </p>

      <p className="mt-1 truncate text-sm font-black capitalize">
        {value.replaceAll("_", " ")}
      </p>
    </div>
  );
}
