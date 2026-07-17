"use client";

import { CheckCircle2, CircleAlert, QrCode } from "lucide-react";
import { useState } from "react";
import { redeemClaim, type RedeemClaimResult } from "@/lib/api/claims";

function cleanCode(value: string) {
  return value.trim().toUpperCase().replace(/\s+/g, "").replace(/-/g, "");
}

export function ClaimRedeemer({ businessId }: { businessId?: string }) {
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<RedeemClaimResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleRedeem(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedCode = cleanCode(code);

    if (!normalizedCode) {
      setError("Enter a claim code.");
      return;
    }

    setBusy(true);
    setError(null);
    setResult(null);

    try {
      const data = await redeemClaim(normalizedCode, businessId);
      setResult(data);
      setCode("");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not redeem claim.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-[1.75rem] bg-white p-5 shadow-[0_10px_30px_rgba(95,78,55,0.08)] ring-1 ring-[#DDD2C2] dark:bg-[#241f1a] dark:ring-white/10 md:p-6">
      <div className="flex items-start gap-4">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#EEF1E3] text-[#6F7D43] dark:bg-[#556235] dark:text-[#E1E9B8]">
          <QrCode size={24} />
        </div>

        <div>
          <h2 className="text-2xl font-black tracking-tight">
            Accept pickup code
          </h2>

          <p className="mt-1 text-sm leading-6 text-black/55 dark:text-white/45">
            Enter the customer’s QR or claim code. Once accepted, the order is
            marked as picked up.
          </p>
        </div>
      </div>

      <form onSubmit={handleRedeem} className="mt-6 flex flex-col gap-3 sm:flex-row">
        <input
          value={code}
          onChange={(event) => setCode(event.target.value)}
          placeholder="Example: A8F31C90"
          autoCapitalize="characters"
          className="min-h-12 flex-1 rounded-2xl border border-black/10 bg-white px-4 text-lg font-black uppercase tracking-[0.18em] outline-none transition focus:border-[#6f7d43] dark:border-white/10 dark:bg-[#171411]"
        />

        <button
          type="submit"
          disabled={busy}
          className="rounded-2xl bg-[#6F7D43] px-6 py-3 font-black text-white transition hover:bg-[#556235] disabled:opacity-60 dark:bg-[#9baa6a] dark:text-[#2F261F]"
        >
          {busy ? "Checking..." : "Accept"}
        </button>
      </form>

      {result ? (
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
                {result.already_picked_up
                  ? "Already picked up"
                  : "Pickup accepted"}
              </p>

              <p className="mt-1 text-sm leading-6 opacity-80">
                {result.claim.deal_title} · {result.claim.business_name}
              </p>

              <p className="mt-1 text-xs font-bold uppercase tracking-wide opacity-60">
                Code {result.claim.code}
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {error ? (
        <div className="mt-5 rounded-[1.5rem] bg-[#fff0ea] p-4 text-[#8a3a20]">
          <div className="flex items-start gap-3">
            <CircleAlert className="mt-0.5 shrink-0" size={22} />

            <div>
              <p className="font-black">Could not accept code</p>
              <p className="mt-1 text-sm leading-6 opacity-80">{error}</p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
