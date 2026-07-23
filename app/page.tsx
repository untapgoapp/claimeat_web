import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Clock3,
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
    "Find surplus food from local businesses, claim it online and collect it nearby.",
};

const benefits: {
  icon: LucideIcon;
  title: string;
  text: string;
}[] = [
  {
    icon: ShoppingBag,
    title: "Good food for less",
    text: "Find surplus food at a better price.",
  },
  {
    icon: MapPin,
    title: "Available nearby",
    text: "Discover offers from local businesses.",
  },
  {
    icon: Leaf,
    title: "Less food wasted",
    text: "Help good food find another home.",
  },
];

const steps = [
  {
    number: "01",
    title: "Find",
    text: "Browse nearby food and pickup times.",
  },
  {
    number: "02",
    title: "Claim",
    text: "Reserve and pay securely.",
  },
  {
    number: "03",
    title: "Collect",
    text: "Show your QR ticket at the store.",
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
      <Header />

      <section className="border-b border-black/[0.07]">
        <div className="mx-auto grid w-full max-w-[1180px] gap-12 px-5 py-16 sm:px-8 sm:py-20 lg:min-h-[660px] lg:grid-cols-[1fr_0.8fr] lg:items-center">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-[#EAF1ED] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#477565]">
              <MapPin size={13} />
              Launching in Pärnu
            </p>

            <h1 className="mt-7 max-w-[760px] text-[clamp(3.7rem,8vw,7rem)] font-bold leading-[0.87] tracking-[-0.07em]">
              Still good.
              <span className="block text-[#2D725F]">
                Still here.
              </span>
            </h1>

            <p className="mt-7 max-w-[600px] text-lg leading-8 text-black/50 sm:text-xl">
              Rescue surplus food from local shops, cafés and bakeries before
              it goes to waste.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/deals"
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-[#173C32] px-7 font-semibold text-white transition hover:bg-[#102B24]"
              >
                Find food
                <ArrowRight size={18} />
              </Link>

              <Link
                href="/for-businesses"
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full border border-black/10 bg-white px-7 font-semibold"
              >
                For businesses
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] bg-[#EAF1ED] p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#477565]">
              ClaimEat
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-[-0.045em]">
              Food available today.
            </h2>

            <div className="mt-7 divide-y divide-black/[0.08] border-y border-black/[0.08]">
              <PreviewRow
                icon={MapPin}
                title="Browse nearby"
                text="See what local businesses have available."
              />

              <PreviewRow
                icon={Clock3}
                title="Choose a pickup"
                text="Know exactly when to collect."
              />

              <PreviewRow
                icon={QrCode}
                title="Show your ticket"
                text="Your QR stays inside My orders."
              />
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-black/[0.07] bg-white">
        <div className="mx-auto grid w-full max-w-[1180px] md:grid-cols-3">
          {benefits.map((benefit, index) => (
            <Benefit
              key={benefit.title}
              {...benefit}
              divided={index > 0}
            />
          ))}
        </div>
      </section>

      <section className="border-b border-black/[0.07]">
        <div className="mx-auto grid w-full max-w-[1180px] gap-14 px-5 py-20 sm:px-8 lg:grid-cols-2 lg:py-24">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#477565]">
              How it works
            </p>

            <h2 className="mt-4 text-4xl font-bold tracking-[-0.055em] sm:text-5xl">
              Find. Claim. Collect.
            </h2>

            <div className="mt-8 border-t border-black/[0.09]">
              {steps.map((step) => (
                <Step key={step.number} {...step} />
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] bg-[#173C32] p-7 text-white sm:p-9">
            <Store size={25} className="text-white/70" />

            <p className="mt-7 text-xs font-semibold uppercase tracking-[0.1em] text-white/45">
              For businesses
            </p>

            <h2 className="mt-4 text-4xl font-bold leading-[0.98] tracking-[-0.055em] sm:text-5xl">
              Turn surplus into paid pickups.
            </h2>

            <p className="mt-6 max-w-lg leading-7 text-white/55">
              Publish an offer, choose the quantity and pickup time, and let
              customers pay before arriving.
            </p>

            <div className="mt-7 grid gap-3 text-sm font-medium text-white/70">
              <BusinessPoint text="No delivery required" />
              <BusinessPoint text="Customers pay online" />
              <BusinessPoint text="QR pickup verification" />
            </div>

            <Link
              href="/for-businesses"
              className="mt-8 inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-white px-6 font-semibold text-[#173C32]"
            >
              Learn more
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-[#EAF1ED]">
        <div className="mx-auto flex w-full max-w-[1180px] flex-col items-center px-5 py-16 text-center sm:px-8 sm:py-20">
          <h2 className="max-w-[760px] text-4xl font-bold leading-[0.98] tracking-[-0.055em] sm:text-5xl">
            See what is still good and still available.
          </h2>

          <Link
            href="/deals"
            className="mt-8 inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-[#173C32] px-8 font-semibold text-white"
          >
            Open ClaimEat
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/[0.07] bg-[#FAFAF7]/92 backdrop-blur-xl">
      <div className="mx-auto flex min-h-[72px] w-full max-w-[1180px] items-center justify-between px-5 sm:px-8">
        <Link href="/" aria-label="ClaimEat home">
          <img
            src="/brand/claim-eat-header-logo.png"
            alt="ClaimEat"
            className="h-8 w-auto"
          />
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-medium text-black/48 md:flex">
          <Link href="/how-it-works">How it works</Link>
          <Link href="/for-businesses">For businesses</Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="hidden px-4 text-sm font-semibold sm:inline-flex"
          >
            Sign in
          </Link>

          <Link
            href="/deals"
            className="inline-flex min-h-11 items-center rounded-full bg-[#173C32] px-5 text-sm font-semibold text-white"
          >
            Find food
          </Link>
        </div>
      </div>
    </header>
  );
}

function PreviewRow({
  icon: Icon,
  title,
  text,
}: {
  icon: LucideIcon;
  title: string;
  text: string;
}) {
  return (
    <div className="flex items-start gap-4 py-5">
      <Icon
        size={20}
        className="mt-0.5 shrink-0 text-[#477565]"
      />

      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="mt-1 text-sm leading-6 text-black/42">
          {text}
        </p>
      </div>
    </div>
  );
}

function Benefit({
  icon: Icon,
  title,
  text,
  divided,
}: {
  icon: LucideIcon;
  title: string;
  text: string;
  divided: boolean;
}) {
  return (
    <article
      className={[
        "px-5 py-10 sm:px-8",
        divided
          ? "border-t border-black/[0.07] md:border-l md:border-t-0"
          : "",
      ].join(" ")}
    >
      <Icon
        size={23}
        className="text-[#477565]"
      />

      <h3 className="mt-6 text-xl font-semibold tracking-[-0.03em]">
        {title}
      </h3>

      <p className="mt-2 leading-7 text-black/43">
        {text}
      </p>
    </article>
  );
}

function Step({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="grid gap-2 border-b border-black/[0.09] py-6 sm:grid-cols-[50px_110px_1fr]">
      <span className="text-sm font-semibold text-[#477565]">
        {number}
      </span>

      <h3 className="font-semibold">{title}</h3>

      <p className="text-sm leading-6 text-black/45">
        {text}
      </p>
    </div>
  );
}

function BusinessPoint({
  text,
}: {
  text: string;
}) {
  return (
    <p className="flex items-center gap-3">
      <Check size={15} strokeWidth={2.5} />
      {text}
    </p>
  );
}

function Footer() {
  return (
    <footer className="border-t border-black/[0.07] bg-white">
      <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-5 px-5 py-9 text-sm text-black/40 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <img
          src="/brand/claim-eat-header-logo.png"
          alt="ClaimEat"
          className="h-7 w-auto"
        />

        <div className="flex flex-wrap gap-5">
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/contact">Contact</Link>
        </div>

        <p>© {new Date().getFullYear()} ClaimEat</p>
      </div>
    </footer>
  );
}
