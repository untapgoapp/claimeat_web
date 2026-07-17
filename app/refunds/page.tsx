import { Shell } from "@/components/layout/shell";

export default function RefundsPage() {
  return (
    <Shell>
      <section className="mx-auto max-w-3xl py-10">
        <p className="text-sm font-bold uppercase tracking-wide text-[#6F7D43] dark:text-[#E1E9B8]">
          Legal
        </p>

        <h1 className="mt-2 text-4xl font-black tracking-tight md:text-5xl">
          Refund Policy
        </h1>

        <div className="mt-8 rounded-[1.75rem] bg-white p-6 shadow-[0_10px_30px_rgba(95,78,55,0.08)] ring-1 ring-[#DDD2C2] dark:bg-[#241f1a] dark:ring-white/10 md:p-8">
          <p className="leading-7 text-black/60 dark:text-white/55">
            Refunds may be reviewed case by case. Food rescue deals are limited
            and tied to specific pickup windows.
          </p>

          <h2 className="mt-8 text-xl font-black">Eligible refund examples</h2>

          <ul className="mt-4 list-disc space-y-2 pl-5 text-black/60 dark:text-white/55">
            <li>The business cannot provide the claimed food.</li>
            <li>The store is closed during the pickup window.</li>
            <li>The order was incorrectly marked available.</li>
          </ul>

          <h2 className="mt-8 text-xl font-black">Usually not refundable</h2>

          <ul className="mt-4 list-disc space-y-2 pl-5 text-black/60 dark:text-white/55">
            <li>The customer misses the pickup window.</li>
            <li>The customer changes their mind after payment.</li>
            <li>The customer does not collect the order in time.</li>
          </ul>

          <p className="mt-8 leading-7 text-black/60 dark:text-white/55">
            For refund help, contact support@claimeat.com with your pickup code
            and claim details.
          </p>
        </div>
      </section>
    </Shell>
  );
}
