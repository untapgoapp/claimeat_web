"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { resetDemoData } from "@/lib/api/admin";

export function ResetDemoDataButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleClick() {
    setBusy(true);
    setMessage(null);

    try {
      const result = await resetDemoData();

      setMessage(
        `Reset complete: ${result.deals_inserted} deals, ${result.businesses} businesses`
      );

      router.refresh();
    } catch {
      setMessage("Could not reset demo data");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-2">
      <button
        onClick={handleClick}
        disabled={busy}
        className="w-full rounded-2xl bg-[#6F7D43] px-5 py-3 text-center font-black text-white shadow-[0_10px_30px_rgba(95,78,55,0.08)] hover:bg-[#556235] disabled:opacity-60 dark:bg-[#9baa6a] dark:text-[#2F261F]"
      >
        {busy ? "Resetting..." : "Reset demo data"}
      </button>

      {message && (
        <p className="text-center text-sm text-black/55 dark:text-white/45">
          {message}
        </p>
      )}
    </div>
  );
}
