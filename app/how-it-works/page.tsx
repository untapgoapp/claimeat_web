import { Shell } from "@/components/layout/shell";

export default function HowItWorksPage() {
  return (
    <Shell>
      <PageIntro
        eyebrow="How it works"
        title="A simple pickup marketplace for surplus food."
        text="Businesses post surplus food, customers claim and pay, and pickup happens directly at the store."
      />

      <div className="grid gap-6 py-8 md:grid-cols-2">
        <FlowCard
          title="For customers"
          items={[
            "Browse nearby food deals.",
            "Pay securely through ClaimEat.",
            "Get a pickup code and QR.",
            "Collect at the store during the pickup window.",
          ]}
        />

        <FlowCard
          title="For businesses"
          items={[
            "Create a deal with price, quantity, and pickup time.",
            "Sell surplus before closing.",
            "Verify the pickup code or QR.",
            "Track claims, collections, and recovered value.",
          ]}
        />
      </div>

      <div className="rounded-[1.75rem] bg-white p-6 shadow-[0_10px_30px_rgba(95,78,55,0.08)] ring-1 ring-[#DDD2C2] dark:bg-[#241f1a] dark:ring-white/10 md:p-8">
        <h2 className="text-2xl font-black">Important note</h2>

        <p className="mt-3 leading-7 text-black/60 dark:text-white/55">
          ClaimEat does not prepare or handle the food. Food is prepared,
          packed, sold, and provided by the participating business.
        </p>
      </div>
    </Shell>
  );
}

function PageIntro({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text: string;
}) {
  return (
    <section className="py-10">
      <p className="text-sm font-bold uppercase tracking-wide text-[#6F7D43] dark:text-[#E1E9B8]">
        {eyebrow}
      </p>

      <h1 className="mt-2 max-w-3xl text-4xl font-black tracking-tight md:text-6xl">
        {title}
      </h1>

      <p className="mt-5 max-w-2xl text-lg leading-8 text-black/60 dark:text-white/55">
        {text}
      </p>
    </section>
  );
}

function FlowCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-[1.75rem] bg-white p-6 shadow-[0_10px_30px_rgba(95,78,55,0.08)] ring-1 ring-[#DDD2C2] dark:bg-[#241f1a] dark:ring-white/10 md:p-8">
      <h2 className="text-2xl font-black">{title}</h2>

      <div className="mt-6 grid gap-4">
        {items.map((item, index) => (
          <div key={item} className="flex gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#EEF1E3] text-sm font-black text-[#6F7D43] dark:bg-[#556235] dark:text-[#E1E9B8]">
              {index + 1}
            </div>

            <p className="pt-1 text-black/65 dark:text-white/55">{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
