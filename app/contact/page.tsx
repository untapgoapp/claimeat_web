import { Shell } from "@/components/layout/shell";

export default function ContactPage() {
  return (
    <Shell>
      <section className="py-10">
        <p className="text-sm font-bold uppercase tracking-wide text-[#6F7D43] dark:text-[#E1E9B8]">
          Contact
        </p>

        <h1 className="mt-2 max-w-3xl text-4xl font-black tracking-tight md:text-6xl">
          Contact ClaimEat
        </h1>

        <p className="mt-5 max-w-2xl text-lg leading-8 text-black/60 dark:text-white/55">
          For support, pilots, partnerships, or general questions, reach out to
          the right inbox below.
        </p>
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        <ContactCard title="Customer support" email="support@claimeat.com" />
        <ContactCard title="Business pilots" email="business@claimeat.com" />
        <ContactCard title="General" email="hello@claimeat.com" />
      </section>
    </Shell>
  );
}

function ContactCard({ title, email }: { title: string; email: string }) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-[0_10px_30px_rgba(95,78,55,0.08)] ring-1 ring-[#DDD2C2] dark:bg-[#241f1a] dark:ring-white/10">
      <h2 className="text-xl font-black">{title}</h2>

      <a
        href={`mailto:${email}`}
        className="mt-3 block text-[#6F7D43] font-bold dark:text-[#E1E9B8]"
      >
        {email}
      </a>
    </div>
  );
}
