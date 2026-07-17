import { Shell } from "@/components/layout/shell";

export default function PrivacyPage() {
  return (
    <Shell>
      <section className="mx-auto max-w-3xl py-10">
        <p className="text-sm font-bold uppercase tracking-wide text-[#6F7D43] dark:text-[#E1E9B8]">
          Legal
        </p>

        <h1 className="mt-2 text-4xl font-black tracking-tight md:text-5xl">
          Privacy Policy
        </h1>

        <div className="mt-8 space-y-6">
          <Section title="1. Data we collect">
            ClaimEat may collect basic account information, claim history,
            payment metadata, pickup activity, and app usage.
          </Section>

          <Section title="2. Payments">
            Payments are handled by Stripe. ClaimEat does not store full card
            details.
          </Section>

          <Section title="3. App data">
            ClaimEat uses Supabase to store application data such as deals,
            claims, businesses, and pickup status.
          </Section>

          <Section title="4. Maps">
            ClaimEat may use Mapbox to display map-based deal discovery.
          </Section>

          <Section title="5. How we use data">
            We use data to operate the marketplace, process claims, prevent
            abuse, improve the product, and support businesses.
          </Section>

          <Section title="6. Contact">
            For privacy questions, contact privacy@claimeat.com.
          </Section>
        </div>
      </section>
    </Shell>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-[0_10px_30px_rgba(95,78,55,0.08)] ring-1 ring-[#DDD2C2] dark:bg-[#241f1a] dark:ring-white/10">
      <h2 className="text-xl font-black">{title}</h2>
      <p className="mt-3 leading-7 text-black/60 dark:text-white/55">
        {children}
      </p>
    </div>
  );
}
