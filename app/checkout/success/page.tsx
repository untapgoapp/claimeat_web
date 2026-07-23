import { Suspense } from "react";

import { CheckoutSuccessClient } from "@/components/checkout/checkout-success-client";

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<SuccessPageLoading />}>
      <CheckoutSuccessClient />
    </Suspense>
  );
}

function SuccessPageLoading() {
  return (
    <main className="grid min-h-[100dvh] place-items-center bg-[#F5F2EB] px-4 py-8">
      <div className="w-full max-w-md animate-pulse">
        <div className="mx-auto h-14 w-14 rounded-full bg-black/[0.07]" />
        <div className="mx-auto mt-5 h-4 w-32 rounded-full bg-black/[0.07]" />
        <div className="mx-auto mt-3 h-8 w-64 max-w-full rounded-full bg-black/[0.07]" />

        <div className="mt-7 rounded-[1.75rem] bg-white p-5">
          <div className="mx-auto aspect-square w-full max-w-[250px] rounded-[1.5rem] bg-black/[0.06]" />
          <div className="mx-auto mt-5 h-8 w-44 rounded-full bg-black/[0.06]" />
        </div>
      </div>
    </main>
  );
}
