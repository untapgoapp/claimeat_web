"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { collectClaim } from "@/lib/api/admin";

export function CollectClaimButton({ claimId }: { claimId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function handleCollect() {
    setBusy(true);

    try {
      await collectClaim(claimId);
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      onClick={handleCollect}
      disabled={busy}
      className="rounded-2xl bg-[#6f7d43] px-4 py-2 text-sm font-bold text-white disabled:opacity-60 dark:bg-[#9baa6a] dark:text-[#2F261F]"
    >
      {busy ? "Collecting..." : "Mark collected"}
    </button>
  );
}
