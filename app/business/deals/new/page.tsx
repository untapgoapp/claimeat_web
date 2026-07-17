import { Shell } from "@/components/layout/shell";
import { CreateDealForm } from "@/components/dev/create-deal-form";
import { BusinessGate } from "@/components/business/business-gate";

export default function NewDealPage() {
  return (
    <Shell>
      <BusinessGate>
      <div className="mx-auto max-w-2xl rounded-[1.75rem] bg-white p-6 shadow-[0_10px_30px_rgba(95,78,55,0.08)] ring-1 ring-[#DDD2C2] dark:bg-[#241f1a] dark:ring-white/10 md:p-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-[#6F7D43] dark:text-[#E1E9B8]">
          Selver Demo Store
        </p>

        <h1 className="mt-1 text-3xl font-black">Create deal</h1>

        <p className="mt-2 text-black/60 dark:text-white/55">
          Publish an end-of-day rescue pack in under a minute.
        </p>

        <CreateDealForm />
      </div>
      </BusinessGate>
    </Shell>
  );
}
