import { Shell } from "@/components/layout/shell";

export default function TermsPage() {
  return (
    <Shell>
      <LegalPage title="Terms of Service">
        <Section title="1. What ClaimEat does">
          ClaimEat connects customers with participating businesses offering
          surplus food for pickup.
        </Section>

        <Section title="2. Food provider responsibility">
          Food is prepared, packed, sold, and provided by the participating
          business. ClaimEat does not prepare or handle food.
        </Section>

        <Section title="3. Pickup windows">
          Customers are responsible for collecting orders within the pickup
          window shown at checkout.
        </Section>

        <Section title="4. Payments">
          Payments are processed securely through Stripe. ClaimEat does not store
          full card details.
        </Section>

        <Section title="5. Availability">
          Deals are limited and may sell out, expire, or be cancelled.
        </Section>

        <Section title="6. Account and misuse">
          Users may not abuse, resell, manipulate, or misuse the platform.
        </Section>

        <Section title="7. Changes">
          ClaimEat may update these terms as the service develops.
        </Section>
      </LegalPage>
    </Shell>
  );
}

function LegalPage({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto max-w-3xl py-10">
      <p className="text-sm font-bold uppercase tracking-wide text-[#6F7D43] dark:text-[#E1E9B8]">
        Legal
      </p>

      <h1 className="mt-2 text-4xl font-black tracking-tight md:text-5xl">
        {title}
      </h1>

      <div className="mt-8 space-y-6">{children}</div>
    </section>
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
