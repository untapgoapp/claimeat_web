"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { expireReservations } from "@/lib/api/admin";

export function ExpireReservationsButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleClick() {
    setBusy(true);
    setMessage(null);

    try {
      const result = await expireReservations();
      setMessage(`Expired reservations cleaned: ${result.expired}`);
      router.refresh();
    } catch {
      setMessage("Could not clean reservations");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-2">
      <button
        onClick={handleClick}
        disabled={busy}
        className="w-full rounded-2xl bg-white px-5 py-3 text-center font-semibold shadow-[0_10px_30px_rgba(95,78,55,0.08)] ring-1 ring-black/10 hover:bg-[#556235]/[0.02] disabled:opacity-60 dark:bg-[#171411] dark:ring-white/10"
      >
        {busy ? "Cleaning..." : "Clean expired reservations"}
      </button>

      {message && (
        <p className="text-center text-sm text-black/55 dark:text-white/45">
          {message}
        </p>
      )}
    </div>
  );
}
