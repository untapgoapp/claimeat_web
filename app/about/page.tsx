import { Shell } from "@/components/layout/shell";

export default function AboutPage() {
  return (
    <Shell>
      <section className="py-10">
        <p className="text-sm font-bold uppercase tracking-wide text-[#6F7D43] dark:text-[#E1E9B8]">
          About
        </p>

        <h1 className="mt-2 max-w-3xl text-4xl font-black tracking-tight md:text-6xl">
          Good food should not disappear quietly at closing time.
        </h1>

        <div className="mt-8 max-w-3xl space-y-5 text-lg leading-8 text-black/65 dark:text-white/55">
          <p>
            ClaimEat is a food rescue marketplace built for the Baltics. We
            help people discover good food nearby while helping businesses
            recover value from surplus food.
          </p>

          <p>
            Our first focus is simple: pickup-based surplus food from grocery
            stores, cafés, bakeries, and prepared food counters.
          </p>

          <p>
            The goal is to make food rescue practical, local, and easy to
            measure.
          </p>
        </div>
      </section>
    </Shell>
  );
}
