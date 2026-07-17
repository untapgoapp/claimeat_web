import Link from "next/link";
import { Shell } from "@/components/layout/shell";
import {
  Eyebrow,
  FeatureCard,
  MetricRow,
  SectionIntro,
  StatCard,
  StepCard,
} from "@/components/marketing";

export default function ForBusinessesPage() {
  return (
    <Shell>
      <section className="grid gap-10 py-10 md:grid-cols-[1.05fr_0.95fr] md:items-center md:py-16">
        <div>
          <Eyebrow>For businesses</Eyebrow>

          <h1 className="mt-2 max-w-4xl text-5xl font-black tracking-tight md:text-7xl">
            Turn surplus food into paid pickup orders.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-black/65 dark:text-white/60">
            ClaimEat gives grocery stores, cafés, bakeries, and prepared food
            counters a simple way to sell end-of-day surplus before it becomes
            waste.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/business"
              className="rounded-2xl bg-[#6f7d43] px-6 py-3 text-center font-bold text-white hover:bg-[#5d6d32] dark:bg-[#9baa6a] dark:text-[#2F261F]"
            >
              Open dashboard
            </Link>

            <Link
              href="/contact"
              className="rounded-2xl bg-white px-6 py-3 text-center font-bold shadow-[0_10px_30px_rgba(95,78,55,0.08)] ring-1 ring-black/10 hover:bg-[#556235]/[0.02] dark:bg-[#241f1a] dark:ring-white/10"
            >
              Discuss a pilot
            </Link>
          </div>
        </div>

        <div className="rounded-[1.75rem] bg-white p-6 shadow-[0_10px_30px_rgba(95,78,55,0.08)] ring-1 ring-[#DDD2C2] dark:bg-[#241f1a] dark:ring-white/10 md:p-8">
          <p className="text-sm font-bold uppercase tracking-wide text-[#6F7D43] dark:text-[#E1E9B8]">
            Store example
          </p>

          <h2 className="mt-2 text-3xl font-black">Selver Pärnu Keskus</h2>

          <p className="mt-3 leading-7 text-black/60 dark:text-white/55">
            A store posts a few limited rescue bags before closing. Customers
            pay online and collect during the pickup window.
          </p>

          <div className="mt-6 grid gap-3">
            <MetricRow label="Rescue bags per day" value="6" />
            <MetricRow label="Average bag price" value="€4.99" />
            <MetricRow label="Monthly orders" value="156" />
            <MetricRow label="Monthly recovered value" value="~€778" />
          </div>
        </div>
      </section>

      <section className="py-10">
        <SectionIntro
          eyebrow="Why businesses use it"
          title="A focused surplus channel, not another delivery operation."
          text="ClaimEat is built around pickup, limited availability, and simple store verification."
          align="center"
        />

        <div className="mt-8 grid gap-5 md:grid-cols-4">
          <FeatureCard
            icon="💶"
            title="Recover value"
            text="Sell food that would otherwise be heavily discounted, wasted, or handled manually."
          />

          <FeatureCard
            icon="🧾"
            title="Paid upfront"
            text="Customers claim and pay online. The store sees pickup claims already paid."
          />

          <FeatureCard
            icon="🚶"
            title="No delivery"
            text="Customers collect directly from the store during a defined pickup window."
          />

          <FeatureCard
            icon="📊"
            title="Track impact"
            text="See orders, collections, recovered value, and estimated meals rescued."
          />
        </div>
      </section>

      <section className="py-10">
        <SectionIntro
          eyebrow="Store workflow"
          title="Designed for end-of-day operations."
          text="The business flow is intentionally small: create the offer, let customers claim it, verify pickup."
        />

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <StepCard
            number="1"
            title="Create a rescue deal"
            text="Add title, description, price, quantity, and pickup window. The deal appears in the customer feed and map."
          />

          <StepCard
            number="2"
            title="Customers claim and pay"
            text="ClaimEat reserves stock, Stripe processes payment, and the claim becomes active after webhook confirmation."
          />

          <StepCard
            number="3"
            title="Verify collection"
            text="The store checks the pickup code or QR and marks the order as collected."
          />
        </div>
      </section>

      <section className="my-10 grid gap-6 md:grid-cols-[0.9fr_1.1fr] md:items-center">
        <div className="rounded-[1.75rem] bg-white p-6 shadow-[0_10px_30px_rgba(95,78,55,0.08)] ring-1 ring-[#DDD2C2] dark:bg-[#241f1a] dark:ring-white/10 md:p-8">
          <Eyebrow>50-store pilot</Eyebrow>

          <h2 className="mt-2 text-3xl font-black">Small daily volume adds up.</h2>

          <p className="mt-3 leading-7 text-black/60 dark:text-white/55">
            A pilot does not need huge basket values. It needs consistent store
            participation and daily customer pickup behavior.
          </p>

          <div className="mt-6 grid gap-3">
            <MetricRow label="Active stores" value="50" />
            <MetricRow label="Bags per store per day" value="6" />
            <MetricRow label="Monthly orders" value="7,800" />
            <MetricRow label="Monthly GMV recovered" value="~€39k" />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <StatCard
            label="Average rescue bag"
            value="€4.99"
            note="Simple low-cost customer entry point."
          />

          <StatCard
            label="Platform take rate"
            value="20%"
            note="Enough margin to support payments and operations."
          />

          <StatCard
            label="Merchant payout"
            value="~80%"
            note="The business recovers value from surplus."
          />

          <StatCard
            label="Pickup model"
            value="0 delivery"
            note="No courier layer needed for the MVP."
          />
        </div>
      </section>

      <section className="py-10">
        <SectionIntro
          eyebrow="What the business gets"
          title="A dashboard for today’s surplus."
          text="For a pilot, stores need clarity: what is live, what has been paid, what still needs to be collected."
          align="center"
        />

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <DashboardCard
            title="Active deals"
            text="See available rescue bags, stock left, pickup windows, and current status."
          />

          <DashboardCard
            title="Pickup claims"
            text="Verify customer pickup codes and mark paid orders as collected."
          />

          <DashboardCard
            title="Pilot metrics"
            text="Track claims, collection rate, recovered value, and estimated meals rescued."
          />
        </div>
      </section>

      <section className="my-10 rounded-[1.75rem] bg-[#6F7D43] p-6 text-white shadow-[0_10px_30px_rgba(95,78,55,0.08)] md:p-8">
        <div className="grid gap-6 md:grid-cols-[1fr_0.8fr] md:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-[#E1E9B8]">
              Built for Baltic pilots
            </p>

            <h2 className="mt-2 text-3xl font-black tracking-tight md:text-5xl">
              Start with a few stores. Prove repeat pickup behavior.
            </h2>

            <p className="mt-4 max-w-2xl text-lg leading-8 text-white/65">
              ClaimEat can start with grocery stores, bakeries, cafés, and
              prepared food counters, then expand once local liquidity is
              working.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row md:justify-end">
            <Link
              href="/contact"
              className="rounded-2xl bg-white px-6 py-3 text-center font-bold text-[#2F261F]"
            >
              Contact us
            </Link>

            <Link
              href="/business"
              className="rounded-2xl bg-[#9baa6a] px-6 py-3 text-center font-bold text-[#171411]"
            >
              View dashboard
            </Link>
          </div>
        </div>
      </section>
    </Shell>
  );
}

function DashboardCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-[0_10px_30px_rgba(95,78,55,0.08)] ring-1 ring-[#DDD2C2] dark:bg-[#241f1a] dark:ring-white/10">
      <div className="mb-5 h-28 rounded-2xl bg-[#F4EFE6] p-4 dark:bg-[#171411]">
        <div className="mb-3 h-3 w-24 rounded-full bg-black/10 dark:bg-white/10" />
        <div className="mb-2 h-3 w-full rounded-full bg-black/10 dark:bg-white/10" />
        <div className="mb-2 h-3 w-2/3 rounded-full bg-black/10 dark:bg-white/10" />
        <div className="h-8 w-24 rounded-2xl bg-[#6f7d43] dark:bg-[#9baa6a]" />
      </div>

      <h3 className="text-xl font-black">{title}</h3>

      <p className="mt-3 text-sm leading-6 text-black/60 dark:text-white/50">
        {text}
      </p>
    </div>
  );
}
