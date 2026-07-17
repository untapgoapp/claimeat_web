import Link from "next/link";

/* eslint-disable @next/next/no-img-element */

const exploreLinks = [
  { href: "/deals", label: "Deals" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/for-businesses", label: "For businesses" },
];

const companyLinks = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/business", label: "Business dashboard" },
];

const legalLinks = [
  { href: "/terms", label: "Terms" },
  { href: "/privacy", label: "Privacy" },
  { href: "/refunds", label: "Refunds" },
];

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <p className="text-sm font-black uppercase tracking-[0.16em] text-[#6F7D43] dark:text-[#E1E9B8]">
        {title}
      </p>

      <div className="mt-4 grid gap-3">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-sm font-semibold text-black/55 transition hover:text-black dark:text-white/50 dark:hover:text-white"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="mx-auto max-w-6xl px-4 pb-10 pt-14">
      <div className="border-t border-black/10 pt-10 dark:border-white/10">
        <div className="grid gap-10 md:grid-cols-[1.3fr_0.7fr_0.7fr_0.7fr]">
          <div>
            <Link href="/" className="inline-flex">
              <img
                src="/brand/claim-eat-logo.png"
                alt="ClaimEat"
                className="h-auto w-36"
              />
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-6 text-black/55 dark:text-white/45">
              Good food nearby, claimed in time. A simple food rescue
              marketplace built for local shops and everyday pickup.
            </p>
          </div>

          <FooterColumn title="Explore" links={exploreLinks} />
          <FooterColumn title="Company" links={companyLinks} />
          <FooterColumn title="Legal" links={legalLinks} />
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-black/10 pt-6 text-sm text-black/40 dark:border-white/10 dark:text-white/35 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} ClaimEat.</p>
          <p>Less waste. Better value. Local pickup.</p>
        </div>
      </div>
    </footer>
  );
}
