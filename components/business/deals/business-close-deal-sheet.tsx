"use client";

import {
  CircleAlert,
  Lock,
  X,
} from "lucide-react";
import { useEffect } from "react";

import type { ManagedBusinessDeal } from "@/lib/api/business-deals";

export function BusinessCloseDealSheet({
  deal,
  busy,
  onClose,
  onConfirm,
}: {
  deal: ManagedBusinessDeal;
  busy: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
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
    <div className="fixed inset-0 z-[2147483500] flex items-end bg-black/45 sm:items-center sm:justify-center sm:p-5">
      <button
        type="button"
        className="absolute inset-0"
        onClick={onClose}
        disabled={busy}
        aria-label="Cancel closing deal"
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
            <p className="text-[10px] font-black uppercase tracking-[0.1em] text-[#8A3A20]">
              Close deal
            </p>

            <h2 className="mt-2 text-2xl font-black tracking-[-0.04em]">
              Stop new claims?
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-black/[0.06]"
            aria-label="Close"
          >
            <X
              size={18}
              aria-hidden="true"
            />
          </button>
        </header>

        <div className="mt-5 rounded-[1.35rem] border border-black/[0.07] bg-white p-4">
          <h3 className="text-lg font-black">
            {deal.title}
          </h3>

          <p className="mt-2 text-sm text-black/45">
            {deal.quantityLeft} remaining ·{" "}
            {deal.claimCount} existing claim
            {deal.claimCount === 1 ? "" : "s"}
          </p>
        </div>

        <div className="mt-4 flex gap-3 rounded-xl bg-[#FFF0C7] p-4 text-[#715914]">
          {deal.hasClaims ? (
            <Lock
              size={20}
              className="shrink-0"
              aria-hidden="true"
            />
          ) : (
            <CircleAlert
              size={20}
              className="shrink-0"
              aria-hidden="true"
            />
          )}

          <p className="text-sm leading-5">
            Customers will no longer be able
            to claim this offer. Existing
            paid claims remain valid and can
            still be collected.
          </p>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="min-h-12 rounded-xl bg-black/[0.06] text-sm font-black text-black/55 disabled:opacity-40"
          >
            Keep open
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className="min-h-12 rounded-xl bg-[#8A3A20] text-sm font-black text-white disabled:opacity-50"
          >
            {busy
              ? "Closing…"
              : "Close deal"}
          </button>
        </div>
      </section>
    </div>
  );
}
