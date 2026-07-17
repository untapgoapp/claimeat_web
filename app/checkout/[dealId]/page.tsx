import { notFound } from "next/navigation";
import { Shell } from "@/components/layout/shell";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { fetchDeal } from "@/lib/api/deals";

function formatTime(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ dealId: string }>;
}) {
  const { dealId } = await params;

  let deal;

  try {
    deal = await fetchDeal(dealId);
  } catch {
    notFound();
  }

  return (
    <Shell>
      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1fr_420px]">
        <section className="rounded-[1.75rem] bg-white p-6 shadow-[0_10px_30px_rgba(95,78,55,0.08)] ring-1 ring-[#DDD2C2] dark:bg-[#241f1a] dark:ring-white/10 md:p-8">
          <p className="text-sm font-black uppercase tracking-wide text-[#6F7D43] dark:text-[#E1E9B8]">
            Secure checkout
          </p>

          <h1 className="mt-2 text-4xl font-black tracking-tight">
            Pay and claim
          </h1>

          <p className="mt-3 max-w-xl text-black/60 dark:text-white/55">
            Your payment is handled securely by Stripe. Once payment is
            confirmed, ClaimEat will generate your pickup code and QR.
          </p>

          <CheckoutForm deal={deal} />
        </section>

        <aside className="h-fit rounded-[1.75rem] bg-white p-6 shadow-[0_10px_30px_rgba(95,78,55,0.08)] ring-1 ring-[#DDD2C2] dark:bg-[#241f1a] dark:ring-white/10 md:p-8">
          <p className="text-sm font-black uppercase tracking-wide text-[#6F7D43] dark:text-[#E1E9B8]">
            Order summary
          </p>

          <h2 className="mt-2 text-2xl font-black">{deal.title}</h2>

          <p className="mt-1 text-sm text-black/50 dark:text-white/40">
            {deal.businessName}
          </p>

          <div className="mt-6 grid gap-3">
            <Row label="Pickup" value={`${formatTime(deal.pickupStart)}-${formatTime(deal.pickupEnd)}`} />
            <Row label="Address" value={deal.address} />
            <Row label="Quantity" value="1 bag" />
            <Row label="Total" value={`€${deal.price.toFixed(2)}`} strong />
          </div>

          <div className="mt-6 rounded-2xl bg-[#F4EFE6] p-4 text-sm leading-6 text-black/55 dark:bg-[#171411] dark:text-white/45">
            Please collect during the pickup window. Exact contents may vary
            depending on daily surplus.
          </div>
        </aside>
      </div>
    </Shell>
  );
}

function Row({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-[#DDD2C2] pb-3 dark:border-white/10">
      <span className="text-sm text-black/50 dark:text-white/40">{label}</span>
      <span className={`text-right ${strong ? "text-xl font-black" : "font-bold"}`}>
        {value}
      </span>
    </div>
  );
}
