import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Clock3,
  CreditCard,
  Leaf,
  MapPin,
  QrCode,
  ShoppingBag,
  Store,
  type LucideIcon,
} from "lucide-react";

/* eslint-disable @next/next/no-img-element */

export const metadata: Metadata = {
  title: "ClaimEat | Still good. Still here.",
  description:
    "Find surplus food from local shops, cafés and bakeries. Claim it online and collect it nearby.",
};

const benefits: {
  icon: LucideIcon;
  title: string;
  description: string;
}[] = [
  {
    icon: ShoppingBag,
    title: "Good food for less",
    description:
      "Discover surplus food at a better price while supporting local businesses.",
  },
  {
    icon: MapPin,
    title: "Available nearby",
    description:
      "See what local shops, bakeries and cafés have available around you.",
  },
  {
    icon: Leaf,
    title: "Less food wasted",
    description:
      "Help perfectly good food reach people instead of being thrown away.",
  },
];

const steps = [
  {
    number: "01",
    title: "Find",
    description:
      "Browse food available nearby and check its collection window.",
  },
  {
    number: "02",
    title: "Claim",
    description:
      "Reserve what you want and pay securely through ClaimEat.",
  },
  {
    number: "03",
    title: "Collect",
    description:
      "Visit the business and show your QR ticket during pickup.",
  },
];

export default function LandingPage() {
  return (
    <main
      className="min-h-screen overflow-x-hidden bg-[#FAFAF7] text-[#173C32]"
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
      }}
    >
      <LandingHeader />

      <section className="border-b border-black/[0.07]">
        <div className="mx-auto flex min-h-[calc(100dvh-76px)] w-full max-w-[1180px] flex-col items-center justify-center px-5 py-20 text-center sm:px-8 sm:py-28 lg:py-36">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#EAF1ED] px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.12em] text-[#426A5B]">
            <MapPin
              size={13}
              strokeWidth={2.2}
              aria-hidden="true"
            />

            Pärnu pilot
          </div>

          <h1 className="mt-8 max-w-[980px] text-[clamp(3.75rem,10vw,7.75rem)] font-bold leading-[0.88] tracking-[-0.07em]">
            Still good.
            <span className="block text-[#2D725F]">
              Still here.
            </span>
          </h1>

          <p className="mt-8 max-w-[670px] text-lg leading-8 text-black/52 sm:text-xl sm:leading-9">
            Rescue surplus food from local shops, cafés and bakeries before it
            goes to waste.
          </p>

          <div className="mt-10 flex w-full max-w-xl flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/deals"
              className="inline-flex min-h-14 flex-1 items-center justify-center gap-2 rounded-full bg-[#173C32] px-7 text-base font-semibold text-white transition hover:bg-[#0F2B24]"
            >
              Find food
              <ArrowRight
                size={18}
                aria-hidden="true"
              />
            </Link>

            <Link
              href="/for-businesses"
              className="inline-flex min-h-14 flex-1 items-center justify-center rounded-full border border-black/[0.1] bg-white px-7 text-base font-semibold text-[#173C32] transition hover:border-black/20 hover:bg-[#F7F7F3]"
            >
              For businesses
            </Link>
          </div>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 text-sm font-medium text-black/42 sm:flex-row sm:gap-7">
            <SmallTrust text="Secure payment" />
            <SmallTrust text="Local pickup" />
            <SmallTrust text="Clear collection times" />
          </div>
        </div>
      </section>

      <section className="border-b border-black/[0.07] bg-white">
        <div className="mx-auto grid w-full max-w-[1180px] sm:grid-cols-3">
          <SimpleFact
            icon={MapPin}
            title="Local by design"
            text="Starting with businesses in Pärnu."
          />

          <SimpleFact
            icon={CreditCard}
            title="Paid before pickup"
            text="Reserve and pay before you arrive."
            divided
          />

          <SimpleFact
            icon={Clock3}
            title="Collect on time"
            text="Every offer has a clear pickup window."
            divided
          />
        </div>
      </section>

      <section className="border-b border-black/[0.07]">
        <div className="mx-auto w-full max-w-[1180px] px-5 py-24 sm:px-8 sm:py-32">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.13em] text-[#507365]">
                Why ClaimEat
              </p>

              <h2 className="mt-5 max-w-[620px] text-4xl font-bold leading-[0.98] tracking-[-0.055em] sm:text-6xl">
                Better value for food that is still perfectly good.
              </h2>
            </div>

            <p className="max-w-[570px] text-lg leading-8 text-black/48 lg:justify-self-end">
              ClaimEat connects nearby customers with food businesses when
              surplus becomes available. No delivery network. No complicated
              process. Just discover, claim and collect.
            </p>
          </div>

          <div className="mt-20 border-y border-black/[0.08] md:grid md:grid-cols-3">
            {benefits.map((benefit, index) => (
              <Benefit
                key={benefit.title}
                {...benefit}
                divided={index !== 0}
              />
            ))}
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="scroll-mt-24 border-b border-black/[0.07] bg-white"
      >
        <div className="mx-auto grid w-full max-w-[1180px] gap-16 px-5 py-24 sm:px-8 sm:py-32 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.13em] text-[#507365]">
              How it works
            </p>

            <h2 className="mt-5 max-w-[500px] text-4xl font-bold leading-[0.98] tracking-[-0.055em] sm:text-6xl">
              Find it.
              <br />
              Claim it.
              <br />
              Collect it.
            </h2>

            <p className="mt-7 max-w-md text-lg leading-8 text-black/48">
              The full journey takes place inside ClaimEat, from discovering an
              offer to showing the collection ticket.
            </p>
          </div>

          <div className="border-t border-black/[0.09]">
            {steps.map((step) => (
              <ProcessRow
                key={step.number}
                number={step.number}
                title={step.title}
                description={step.description}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-black/[0.07]">
        <div className="mx-auto grid w-full max-w-[1180px] gap-14 px-5 py-24 sm:px-8 sm:py-32 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.13em] text-[#507365]">
              Inside ClaimEat
            </p>

            <h2 className="mt-5 max-w-[580px] text-4xl font-bold leading-[0.98] tracking-[-0.055em] sm:text-6xl">
              Everything you need for a simple pickup.
            </h2>

            <p className="mt-7 max-w-lg text-lg leading-8 text-black/48">
              Browse nearby deals, pay securely and keep your QR ticket ready
              inside My orders.
            </p>

            <Link
              href="/deals"
              className="mt-8 inline-flex items-center gap-2 text-base font-semibold text-[#23604F]"
            >
              Open ClaimEat
              <ArrowRight
                size={17}
                aria-hidden="true"
              />
            </Link>
          </div>

          <div className="border-y border-black/[0.09]">
            <ProductRow
              icon={MapPin}
              title="Nearby deals"
              text="Food currently available around your location."
            />

            <ProductRow
              icon={CreditCard}
              title="Secure checkout"
              text="Reserve and pay before the collection window."
            />

            <ProductRow
              icon={QrCode}
              title="Pickup ticket"
              text="Your QR and collection code remain available in My orders."
              last
            />
          </div>
        </div>
      </section>

      <section
        id="for-businesses"
        className="scroll-mt-24 bg-[#173C32] text-white"
      >
        <div className="mx-auto grid w-full max-w-[1180px] gap-16 px-5 py-24 sm:px-8 sm:py-32 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.13em] text-white/48">
              For businesses
            </p>

            <h2 className="mt-5 max-w-[720px] text-4xl font-bold leading-[0.97] tracking-[-0.055em] sm:text-6xl">
              Turn surplus food into paid local pickups.
            </h2>

            <p className="mt-7 max-w-[620px] text-lg leading-8 text-white/55">
              Publish an offer, choose the quantity and collection time, and let
              nearby customers pay before arriving.
            </p>

            <Link
              href="/for-businesses"
              className="mt-9 inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-white px-7 text-base font-semibold text-[#173C32] transition hover:bg-[#F0F4F1]"
            >
              Explore ClaimEat for business
              <ArrowRight
                size={18}
                aria-hidden="true"
              />
            </Link>
          </div>

          <div className="border-t border-white/15">
            <BusinessRow
              title="Publish in minutes"
              text="Set price, quantity and collection time."
            />

            <BusinessRow
              title="Customers pay first"
              text="Orders are confirmed before pickup."
            />

            <BusinessRow
              title="Verify with QR"
              text="Scan the customer ticket at collection."
            />

            <BusinessRow
              title="Track activity"
              text="See live deals, claims and collected orders."
            />
          </div>
        </div>
      </section>

      <section className="border-b border-black/[0.07] bg-[#EAF1ED]">
        <div className="mx-auto flex w-full max-w-[1180px] flex-col items-center px-5 py-24 text-center sm:px-8 sm:py-32">
          <p className="text-xs font-bold uppercase tracking-[0.13em] text-[#507365]">
            Starting in Pärnu
          </p>

          <h2 className="mt-5 max-w-[850px] text-4xl font-bold leading-[0.97] tracking-[-0.055em] sm:text-6xl">
            Good food should find a home, not a bin.
          </h2>

          <p className="mt-7 max-w-[620px] text-lg leading-8 text-black/48">
            ClaimEat is beginning locally with cafés, bakeries, restaurants and
            grocery stores.
          </p>
        </div>
      </section>

      <section className="bg-[#FAFAF7]">
        <div className="mx-auto flex w-full max-w-[1180px] flex-col items-center px-5 py-24 text-center sm:px-8 sm:py-32">
          <h2 className="max-w-[850px] text-4xl font-bold leading-[0.97] tracking-[-0.055em] sm:text-6xl">
            See what is still good and still available.
          </h2>

          <Link
            href="/deals"
            className="mt-9 inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-[#173C32] px-8 text-base font-semibold text-white transition hover:bg-[#0F2B24]"
          >
            Find food
            <ArrowRight
              size={18}
              aria-hidden="true"
            />
          </Link>
        </div>
      </section>

      <LandingFooter />
    </main>
  );
}

function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/[0.07] bg-[#FAFAF7]/90 backdrop-blur-xl">
      <div className="mx-auto flex min-h-[76px] w-full max-w-[1180px] items-center justify-between gap-4 px-5 sm:px-8">
        <Link
          href="/"
          aria-label="ClaimEat home"
          className="inline-flex items-center"
        >
          <img
            src="/brand/claim-eat-header-logo.png"
            alt="ClaimEat"
            className="h-8 w-auto"
          />
        </Link>

        <nav
          className="hidden items-center gap-8 text-sm font-semibold text-black/48 md:flex"
          aria-label="Landing navigation"
        >
          <a
            href="#how-it-works"
            className="transition hover:text-[#173C32]"
          >
            How it works
          </a>

          <a
            href="#for-businesses"
            className="transition hover:text-[#173C32]"
          >
            For businesses
          </a>

          <Link
            href="/about"
            className="transition hover:text-[#173C32]"
          >
            About
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="hidden min-h-11 items-center justify-center rounded-full px-4 text-sm font-semibold text-[#173C32] transition hover:bg-black/[0.04] sm:inline-flex"
          >
            Sign in
          </Link>

          <Link
            href="/deals"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#173C32] px-5 text-sm font-semibold text-white transition hover:bg-[#0F2B24]"
          >
            Find food
          </Link>
        </div>
      </div>
    </header>
  );
}

function SmallTrust({
  text,
}: {
  text: string;
}) {
  return (
    <span className="inline-flex items-center gap-2">
      <Check
        size={14}
        strokeWidth={2.5}
        className="text-[#477565]"
        aria-hidden="true"
      />

      {text}
    </span>
  );
}

function SimpleFact({
  icon: Icon,
  title,
  text,
  divided = false,
}: {
  icon: LucideIcon;
  title: string;
  text: string;
  divided?: boolean;
}) {
  return (
    <article
      className={[
        "flex items-start gap-4 px-5 py-8 sm:px-8 sm:py-9",
        divided
          ? "border-t border-black/[0.07] sm:border-l sm:border-t-0"
          : "",
      ].join(" ")}
    >
      <Icon
        size={21}
        strokeWidth={1.8}
        className="mt-0.5 shrink-0 text-[#477565]"
        aria-hidden="true"
      />

      <div>
        <h3 className="text-sm font-semibold">
          {title}
        </h3>

        <p className="mt-1 text-sm leading-6 text-black/42">
          {text}
        </p>
      </div>
    </article>
  );
}

function Benefit({
  icon: Icon,
  title,
  description,
  divided,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  divided: boolean;
}) {
  return (
    <article
      className={[
        "py-10 md:px-8 md:py-12",
        divided
          ? "border-t border-black/[0.08] md:border-l md:border-t-0"
          : "",
      ].join(" ")}
    >
      <Icon
        size={25}
        strokeWidth={1.7}
        className="text-[#477565]"
        aria-hidden="true"
      />

      <h3 className="mt-8 text-2xl font-semibold tracking-[-0.035em]">
        {title}
      </h3>

      <p className="mt-4 max-w-sm leading-7 text-black/44">
        {description}
      </p>
    </article>
  );
}

function ProcessRow({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <article className="grid gap-4 border-b border-black/[0.09] py-8 sm:grid-cols-[70px_150px_1fr] sm:items-start sm:py-10">
      <span className="text-sm font-semibold text-[#477565]">
        {number}
      </span>

      <h3 className="text-2xl font-semibold tracking-[-0.035em]">
        {title}
      </h3>

      <p className="max-w-md leading-7 text-black/46">
        {description}
      </p>
    </article>
  );
}

function ProductRow({
  icon: Icon,
  title,
  text,
  last = false,
}: {
  icon: LucideIcon;
  title: string;
  text: string;
  last?: boolean;
}) {
  return (
    <article
      className={[
        "flex items-start gap-5 py-8",
        last
          ? ""
          : "border-b border-black/[0.09]",
      ].join(" ")}
    >
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#EAF1ED] text-[#477565]">
        <Icon
          size={19}
          strokeWidth={1.8}
          aria-hidden="true"
        />
      </span>

      <div>
        <h3 className="text-lg font-semibold">
          {title}
        </h3>

        <p className="mt-2 max-w-md leading-7 text-black/44">
          {text}
        </p>
      </div>
    </article>
  );
}

function BusinessRow({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <article className="border-b border-white/15 py-7">
      <h3 className="text-xl font-semibold tracking-[-0.025em]">
        {title}
      </h3>

      <p className="mt-2 leading-7 text-white/48">
        {text}
      </p>
    </article>
  );
}

function LandingFooter() {
  return (
    <footer className="border-t border-black/[0.07] bg-white">
      <div className="mx-auto w-full max-w-[1180px] px-5 py-12 sm:px-8">
        <div className="grid gap-10 border-b border-black/[0.07] pb-10 md:grid-cols-[1.4fr_0.8fr_0.8fr]">
          <div>
            <img
              src="/brand/claim-eat-header-logo.png"
              alt="ClaimEat"
              className="h-8 w-auto"
            />

            <p className="mt-4 max-w-sm text-sm leading-6 text-black/42">
              Rescue surplus food from local businesses and collect it nearby.
            </p>
          </div>

          <FooterLinks
            title="Explore"
            links={[
              {
                href: "/deals",
                label: "Find food",
              },
              {
                href: "/how-it-works",
                label: "How it works",
              },
              {
                href: "/for-businesses",
                label: "For businesses",
              },
            ]}
          />

          <FooterLinks
            title="ClaimEat"
            links={[
              {
                href: "/about",
                label: "About",
              },
              {
                href: "/contact",
                label: "Contact",
              },
              {
                href: "/privacy",
                label: "Privacy",
              },
              {
                href: "/terms",
                label: "Terms",
              },
            ]}
          />
        </div>

        <div className="flex flex-col gap-2 pt-7 text-xs text-black/32 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} ClaimEat
          </p>

          <p>
            Still good. Still here.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterLinks({
  title,
  links,
}: {
  title: string;
  links: {
    href: string;
    label: string;
  }[];
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-black/32">
        {title}
      </p>

      <nav className="mt-4 grid gap-3 text-sm font-medium text-black/48">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="transition hover:text-[#173C32]"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
