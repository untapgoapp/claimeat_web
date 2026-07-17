import { Suspense } from "react";

import { CheckoutSuccessClient } from "@/components/checkout/checkout-success-client";
import { Shell } from "@/components/layout/shell";

export default function CheckoutSuccessPage() {
  return (
    <Shell>
      <main className="mx-auto max-w-5xl px-4 py-10 md:px-6">
        <Suspense
          fallback={
            <div className="rounded-[1.75rem] bg-white p-8 text-center shadow-[0_10px_30px_rgba(95,78,55,0.08)] ring-1 ring-[#DDD2C2] dark:bg-[#241f1a] dark:ring-white/10">
              <p className="font-black">Loading your pickup ticket...</p>
            </div>
          }
        >
          <CheckoutSuccessClient />
        </Suspense>
      </main>
    </Shell>
  );
}
