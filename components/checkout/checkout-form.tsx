"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import { useAuth } from "@/components/auth/auth-provider";
import { createPaymentIntent } from "@/lib/api/checkout";
import { Deal } from "@/lib/types";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

function CheckoutInner({
  deal,
  claimId,
}: {
  deal: Deal;
  claimId: string | null;
}) {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();

  const [isPaying, setIsPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePay() {
    if (!stripe || !elements) return;

    setIsPaying(true);
    setError(null);

    const result = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (result.error) {
      setError(result.error.message || "Payment failed");
      setIsPaying(false);
      return;
    }

    if (claimId) {
      router.push(`/checkout/success?claimId=${claimId}`);
    } else {
      router.push("/my-claims");
    }

    router.refresh();
  }

  return (
    <div className="mt-6 space-y-5">
      <PaymentElement />

      {error ? (
        <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <button
        onClick={handlePay}
        disabled={!stripe || isPaying}
        className="w-full rounded-2xl bg-[#6f7d43] px-6 py-4 font-bold text-white shadow-[0_10px_30px_rgba(95,78,55,0.08)] hover:bg-[#5d6d32] disabled:opacity-60 dark:bg-[#9baa6a] dark:text-[#2F261F]"
      >
        {isPaying ? "Processing..." : `Pay and claim €${deal.price.toFixed(2)}`}
      </button>
    </div>
  );
}


function friendlyCheckoutError(error: unknown) {
  const message =
    error instanceof Error ? error.message : "Could not start checkout.";

  if (message.includes("expired")) {
    return "This deal has expired. Pick another rescue bag.";
  }

  if (message.includes("sold_out") || message.includes("Only 0 left")) {
    return "This deal is sold out. Pick another rescue bag.";
  }

  if (message.includes("not available")) {
    return "This deal is no longer available.";
  }

  if (message.includes("AUTH_REQUIRED")) {
    return "Please log in to continue.";
  }

  return message;
}

export function CheckoutForm({ deal }: { deal: Deal }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const hasLoadedIntent = useRef(false);

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [claimId, setClaimId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function openLoginModal() {
    const redirect = encodeURIComponent(pathname);
    router.replace(`${pathname}?auth=login&redirect=${redirect}`, {
      scroll: false,
    });
  }

  useEffect(() => {
    if (loading) return;

    if (!user) {
      openLoginModal();
      return;
    }

    if (hasLoadedIntent.current) return;
    hasLoadedIntent.current = true;

    async function loadPaymentIntent() {
      try {
        const result = await createPaymentIntent({
          dealId: deal.id,
          quantity: 1,
        });

        setClientSecret(result.client_secret);
        setClaimId(result.claim_id);
      } catch (err) {
        if (err instanceof Error && err.message === "AUTH_REQUIRED") {
          hasLoadedIntent.current = false;
          openLoginModal();
          return;
        }

        setError(err instanceof Error ? err.message : "Could not start checkout");
      }
    }

    loadPaymentIntent();
  }, [deal.id, loading, pathname, router, user]);

  if (loading) {
    return (
      <div className="mt-6 rounded-2xl bg-[#F4EFE6] px-4 py-6 text-center text-sm text-black/60 dark:bg-[#171411] dark:text-white/55">
        Checking account...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mt-6 rounded-2xl bg-[#F4EFE6] px-4 py-6 text-center text-sm text-black/60 dark:bg-[#171411] dark:text-white/55">
        Log in to continue checkout.
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
        {error}
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="mt-6 rounded-2xl bg-[#F4EFE6] px-4 py-6 text-center text-sm text-black/60 dark:bg-[#171411] dark:text-white/55">
        Preparing secure checkout...
      </div>
    );
  }

  return (
    <Elements
      key={clientSecret}
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: "stripe",
          variables: {
            colorPrimary: "#6f7d43",
            borderRadius: "14px",
          },
        },
      }}
    >
      <CheckoutInner deal={deal} claimId={claimId} />
    </Elements>
  );
}
