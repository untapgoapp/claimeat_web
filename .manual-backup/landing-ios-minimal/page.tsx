import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Clock3,
  Coffee,
  CreditCard,
  Leaf,
  MapPin,
  MapPinned,
  PackageCheck,
  QrCode,
  ShoppingBag,
  Sparkles,
  Store,
  TrendingUp,
  Utensils,
  WalletCards,
  type LucideIcon,
} from "lucide-react";

/* eslint-disable @next/next/no-img-element */

export const metadata: Metadata = {
  title: "ClaimEat | Rescue good food near you",
  description:
    "Discover surplus food from local shops, cafés and bakeries. Claim it online and collect it locally.",
};

const benefits: {
  icon: LucideIcon;
  title: string;
  description: string;
}[] = [
  {
    icon: WalletCards,
    title: "Better value",
    description:
      "Enjoy good food for less while helping local businesses recover value from surplus.",
  },
  {
    icon: MapPinned,
    title: "Close to home",
    description:
      "Discover food available from shops, cafés and bakeries around you.",
  },
  {
    icon: Leaf,
    title: "Less wasted",
    description:
      "Give perfectly good food another destination instead of the bin.",
  },
];

const steps: {
  number: string;
  icon: LucideIcon;
  title: string;
  description: string;
}[] = [
  {
    number: "01",
    icon: MapPinned,
    title: "Find",
    description:
      "Browse food available nearby and see exactly when it can be collected.",
  },
  {
    number: "02",
    icon: ShoppingBag,
    title: "Claim",
    description:
      "Choose an offer, reserve your quantity and pay securely through ClaimEat.",
  },
  {
    number: "03",
    icon: QrCode,
    title: "Collect",
    description:
      "Visit during the pickup window and show your ClaimEat ticket at the counter.",
  },
];

export default function LandingPage() {
  return (
    <main className="overflow-x-hidden bg-[#F8F5EE] text-[#18392B]">
      <LandingHeader />

      <section className="relative isolate overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_88%_8%,rgba(240,201,85,0.3),transparent_32%),radial-gradient(circle_at_8%_75%,rgba(106,138,94,0.18),transparent_34%)]"
        />

        <div
          aria-hidden="true"
          className="absolute left-1/2 top-0 -z-10 h-full w-px bg-black/[0.035]"
        />

        <div className="mx-auto grid min-h-[calc(100dvh-80px)] w-full max-w-[1240px] items-center gap-14 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:py-24">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#6A8A5E]/20 bg-[#E9EDDD] px-3.5 py-2 text-[11px] font-black uppercase tracking-[0.14em] text-[#526641]">
              <MapPin size={14} aria-hidden="true" />
              Launching in Pärnu
            </div>

            <h1 className="mt-7 max-w-[720px] text-[clamp(3.7rem,9vw,7.4rem)] font-black leading-[0.83] tracking-[-0.075em]">
              Still good.
              <span className="block text-[#B76E45]">
                Still here.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-black/58 sm:text-xl">
              Rescue surplus food from local shops, cafés and bakeries before
              it goes to waste.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/deals"
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-[#18392B] px-7 text-base font-black text-white shadow-[0_16px_35px_rgba(24,57,43,0.2)] transition hover:-translate-y-0.5 hover:bg-[#10271D]"
              >
                Find food near me
                <ArrowRight size={19} aria-hidden="true" />
              </Link>

              <Link
                href="/for-businesses"
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full border border-black/10 bg-white/80 px-7 text-base font-black text-[#18392B] backdrop-blur transition hover:border-[#6A8A5E]/45 hover:bg-white"
              >
                <Store size={18} aria-hidden="true" />
                For businesses
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm font-bold text-black/45">
              <TrustItem text="Secure online payment" />
              <TrustItem text="Local collection" />
              <TrustItem text="Installable PWA" />
            </div>
          </div>

          <ProductPreview />
        </div>
      </section>

      <section className="border-y border-black/[0.065] bg-white">
        <div className="mx-auto grid w-full max-w-[1240px] gap-8 px-4 py-7 sm:grid-cols-3 sm:px-6 lg:px-8">
          <TrustStripItem
            icon={MapPin}
            title="Pärnu first"
            text="Built around local pickup."
          />

          <TrustStripItem
            icon={CreditCard}
            title="Paid before collection"
            text="Simple and secure checkout."
          />

          <TrustStripItem
            icon={PackageCheck}
            title="Ready when you arrive"
            text="Clear collection windows."
          />
        </div>
      </section>

      <section className="bg-[#F8F5EE]">
        <div className="mx-auto w-full max-w-[1240px] px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#6A8A5E]">
                Why ClaimEat
              </p>

              <h2 className="mt-4 max-w-xl text-4xl font-black leading-[0.95] tracking-[-0.06em] sm:text-6xl">
                Food worth finding. Prices worth opening the app for.
              </h2>
            </div>

            <p className="max-w-xl text-lg leading-8 text-black/52 lg:justify-self-end">
              ClaimEat connects food businesses with nearby people at the
              moment surplus becomes available. No delivery fleet, no complex
              process, just food, payment and collection.
            </p>
          </div>

          <div className="mt-16 grid gap-0 border-y border-black/[0.08] md:grid-cols-3">
            {benefits.map((benefit, index) => (
              <Benefit
                key={benefit.title}
                {...benefit}
                divided={index > 0}
              />
            ))}
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="bg-[#18392B] text-white"
      >
        <div className="mx-auto w-full max-w-[1240px] px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#DCE5B9]">
              How it works
            </p>

            <h2 className="mt-4 text-4xl font-black leading-[0.95] tracking-[-0.055em] sm:text-6xl">
              Three small steps.
              <span className="block text-[#F0C955]">
                One less meal wasted.
              </span>
            </h2>
          </div>

          <div className="mt-16 grid gap-px overflow-hidden rounded-[2rem] bg-white/10 lg:grid-cols-3">
            {steps.map((step) => (
              <ProcessStep
                key={step.number}
                {...step}
              />
            ))}
          </div>

          <div className="mt-9 flex flex-col gap-4 rounded-[1.5rem] bg-white/[0.075] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="flex items-start gap-3">
              <Sparkles
                className="mt-0.5 shrink-0 text-[#F0C955]"
                size={21}
                aria-hidden="true"
              />

              <p className="max-w-2xl text-sm font-semibold leading-6 text-white/68">
                Once payment is confirmed, your pickup code and QR ticket stay
                available inside My orders.
              </p>
            </div>

            <Link
              href="/how-it-works"
              className="inline-flex shrink-0 items-center gap-2 text-sm font-black text-[#F0C955]"
            >
              See the full process
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section
        id="for-businesses"
        className="bg-[#F8F5EE]"
      >
        <div className="mx-auto w-full max-w-[1240px] px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="overflow-hidden rounded-[2.5rem] bg-[#E8EDD9]">
            <div className="grid gap-12 p-6 sm:p-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:p-14">
              <div>
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#18392B] text-white">
                  <TrendingUp size={27} aria-hidden="true" />
                </div>

                <p className="mt-7 text-xs font-black uppercase tracking-[0.16em] text-[#6A8A5E]">
                  For local businesses
                </p>

                <h2 className="mt-4 max-w-xl text-4xl font-black leading-[0.96] tracking-[-0.055em] sm:text-6xl">
                  Turn surplus into revenue.
                </h2>

                <p className="mt-6 max-w-xl text-lg leading-8 text-black/55">
                  Publish limited offers, choose the quantity and collection
                  time, and let customers pay before they arrive.
                </p>

                <ul className="mt-7 grid gap-3 text-sm font-bold text-black/58">
                  <BusinessBenefit text="No delivery operation required" />
                  <BusinessBenefit text="Paid pickup orders" />
                  <BusinessBenefit text="QR collection verification" />
                  <BusinessBenefit text="Live deal and revenue overview" />
                </ul>

                <Link
                  href="/for-businesses"
                  className="mt-9 inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-[#18392B] px-7 text-base font-black text-white transition hover:bg-[#10271D]"
                >
                  Explore ClaimEat for business
                  <ArrowRight size={19} aria-hidden="true" />
                </Link>
              </div>

              <BusinessPreview />
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-black/[0.06] bg-white">
        <div className="mx-auto grid w-full max-w-[1240px] gap-10 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:px-8">
          <div>
            <span className="grid h-14 w-14 place-items-center rounded-full bg-[#FFF2BE] text-[#765A0F]">
              <MapPinned size={26} aria-hidden="true" />
            </span>

            <p className="mt-6 text-xs font-black uppercase tracking-[0.16em] text-[#B76E45]">
              Starting locally
            </p>

            <h2 className="mt-4 text-4xl font-black tracking-[-0.055em] sm:text-5xl">
              Built in Pärnu.
              <span className="block text-black/28">
                Designed to travel.
              </span>
            </h2>
          </div>

          <div className="lg:pl-10">
            <p className="text-xl leading-9 text-black/58 sm:text-2xl sm:leading-10">
              ClaimEat begins with a simple local promise: make good food easier
              to find before the day ends.
            </p>

            <p className="mt-5 text-base leading-7 text-black/45">
              The pilot focuses on cafés, bakeries, restaurants and grocery
              stores where predictable pickup windows can create value for both
              sides.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#F0C955]">
        <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-8 px-4 py-16 sm:px-6 sm:py-20 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#765A0F]">
              Good food is waiting
            </p>

            <h2 className="mt-3 max-w-3xl text-4xl font-black leading-[0.95] tracking-[-0.055em] text-[#18392B] sm:text-5xl">
              Find what is still good, still nearby and still available.
            </h2>
          </div>

          <Link
            href="/deals"
            className="inline-flex min-h-14 shrink-0 items-center justify-center gap-2 rounded-full bg-[#18392B] px-8 text-base font-black text-white shadow-[0_14px_30px_rgba(24,57,43,0.18)]"
          >
            Open ClaimEat
            <ArrowRight size={19} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <LandingFooter />
    </main>
  );
}

function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/[0.06] bg-[#F8F5EE]/92 backdrop-blur-xl">
      <div className="mx-auto flex min-h-20 w-full max-w-[1240px] items-center justify-between gap-5 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          aria-label="ClaimEat home"
          className="inline-flex items-center"
        >
          <img
            src="/brand/claim-eat-header-logo.png"
            alt="ClaimEat"
            className="h-8 w-auto sm:h-9"
          />
        </Link>

        <nav
          className="hidden items-center gap-7 text-sm font-black text-black/52 md:flex"
          aria-label="Landing navigation"
        >
          <a
            href="#how-it-works"
            className="transition hover:text-[#18392B]"
          >
            How it works
          </a>

          <a
            href="#for-businesses"
            className="transition hover:text-[#18392B]"
          >
            For businesses
          </a>

          <Link
            href="/about"
            className="transition hover:text-[#18392B]"
          >
            About
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="hidden min-h-11 items-center justify-center rounded-full px-4 text-sm font-black text-[#18392B] transition hover:bg-black/[0.04] sm:inline-flex"
          >
            Sign in
          </Link>

          <Link
            href="/deals"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#18392B] px-5 text-sm font-black text-white transition hover:bg-[#10271D]"
          >
            Find food
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </header>
  );
}

function ProductPreview() {
  return (
    <div className="relative mx-auto w-full max-w-[620px] lg:mr-0">
      <div
        aria-hidden="true"
        className="absolute -inset-8 rounded-full bg-[#F0C955]/22 blur-3xl"
      />

      <div className="relative min-h-[520px] overflow-hidden rounded-[2.75rem] border border-black/[0.07] bg-[#DDE4CF] p-4 shadow-[0_35px_100px_rgba(63,55,38,0.2)] sm:min-h-[610px] sm:p-7">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.55),transparent_55%)]" />

        <div className="relative mx-auto w-full max-w-[355px] overflow-hidden rounded-[2.5rem] border-[7px] border-[#18392B] bg-[#F8F5EE] shadow-[0_26px_60px_rgba(24,57,43,0.28)]">
          <div className="flex items-center justify-between px-5 pb-3 pt-5">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.12em] text-[#6A8A5E]">
                Nearby today
              </p>

              <h2 className="mt-1 text-2xl font-black tracking-[-0.05em]">
                Rescue food
              </h2>
            </div>

            <span className="grid h-10 w-10 place-items-center rounded-full bg-white text-[#18392B] shadow-sm">
              <MapPin size={18} aria-hidden="true" />
            </span>
          </div>

          <div className="space-y-3 px-4 pb-5">
            <PreviewDeal
              icon={Coffee}
              accent="bg-[#D69064]"
              category="Bakery"
              title="Bakery Rescue Bag"
              business="Local Bakery"
              price="€2.99"
              oldPrice="€8.50"
              pickup="18:00–20:00"
              left="3 left"
            />

            <PreviewDeal
              icon={Utensils}
              accent="bg-[#E6B94F]"
              category="Prepared food"
              title="Evening Surprise Box"
              business="Neighbourhood Café"
              price="€3.99"
              oldPrice="€11.00"
              pickup="19:00–20:30"
              left="2 left"
            />
          </div>

          <div className="grid grid-cols-4 border-t border-black/[0.07] bg-white px-3 py-3 text-center text-[8px] font-black uppercase tracking-[0.04em] text-black/35">
            <PreviewNavItem
              icon={ShoppingBag}
              label="Deals"
              active
            />
            <PreviewNavItem
              icon={MapPinned}
              label="Discover"
            />
            <PreviewNavItem
              icon={Leaf}
              label="Saved"
            />
            <PreviewNavItem
              icon={Store}
              label="Profile"
            />
          </div>
        </div>

        <div className="absolute bottom-7 left-3 w-[178px] rounded-[1.35rem] border border-black/[0.07] bg-white p-4 shadow-[0_20px_45px_rgba(60,51,35,0.16)] sm:bottom-10 sm:left-7">
          <p className="text-[9px] font-black uppercase tracking-[0.1em] text-[#6A8A5E]">
            Pickup ready
          </p>

          <div className="mt-2 flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-[#E9EDDD] text-[#18392B]">
              <QrCode size={17} aria-hidden="true" />
            </span>

            <div>
              <p className="text-xs font-black">
                Ticket confirmed
              </p>

              <p className="mt-0.5 text-[10px] text-black/40">
                Show QR at collection
              </p>
            </div>
          </div>
        </div>

        <div className="absolute right-2 top-14 w-[170px] rounded-[1.35rem] bg-[#18392B] p-4 text-white shadow-[0_20px_50px_rgba(24,57,43,0.25)] sm:right-7 sm:top-20">
          <p className="text-[9px] font-black uppercase tracking-[0.1em] text-[#DCE5B9]">
            Local impact
          </p>

          <p className="mt-2 text-3xl font-black tracking-[-0.06em]">
            1 bag
          </p>

          <p className="mt-1 text-[10px] leading-4 text-white/55">
            rescued and collected nearby
          </p>
        </div>
      </div>

      <p className="mt-4 text-center text-xs font-semibold text-black/35">
        Product preview. Availability depends on participating businesses.
      </p>
    </div>
  );
}

function PreviewDeal({
  icon: Icon,
  accent,
  category,
  title,
  business,
  price,
  oldPrice,
  pickup,
  left,
}: {
  icon: LucideIcon;
  accent: string;
  category: string;
  title: string;
  business: string;
  price: string;
  oldPrice: string;
  pickup: string;
  left: string;
}) {
  return (
    <article className="overflow-hidden rounded-[1.45rem] bg-white shadow-[0_8px_24px_rgba(45,39,29,0.07)]">
      <div
        className={[
          "relative grid h-28 place-items-center overflow-hidden",
          accent,
        ].join(" ")}
      >
        <div className="absolute -right-5 -top-7 h-24 w-24 rounded-full bg-white/25" />
        <div className="absolute -bottom-9 -left-3 h-24 w-24 rounded-full bg-black/[0.07]" />

        <Icon
          size={45}
          strokeWidth={1.6}
          className="relative text-white"
          aria-hidden="true"
        />

        <span className="absolute bottom-3 right-3 rounded-full bg-[#FFF4B8] px-2.5 py-1 text-[9px] font-black text-[#685116]">
          {left}
        </span>
      </div>

      <div className="p-3.5">
        <p className="text-[9px] font-black uppercase tracking-[0.08em] text-[#6A8A5E]">
          {category}
        </p>

        <h3 className="mt-1 text-sm font-black leading-4">
          {title}
        </h3>

        <p className="mt-1 text-[10px] text-black/40">
          {business}
        </p>

        <div className="mt-3 flex items-end justify-between gap-3">
          <div>
            <span className="text-lg font-black text-[#18392B]">
              {price}
            </span>

            <span className="ml-2 text-[10px] font-bold text-black/30 line-through">
              {oldPrice}
            </span>
          </div>

          <span className="flex items-center gap-1 text-[9px] font-bold text-black/45">
            <Clock3 size={11} />
            {pickup}
          </span>
        </div>
      </div>
    </article>
  );
}

function PreviewNavItem({
  icon: Icon,
  label,
  active = false,
}: {
  icon: LucideIcon;
  label: string;
  active?: boolean;
}) {
  return (
    <span
      className={[
        "flex flex-col items-center gap-1",
        active
          ? "text-[#6A8A5E]"
          : "",
      ].join(" ")}
    >
      <Icon size={16} aria-hidden="true" />
      {label}
    </span>
  );
}

function TrustItem({
  text,
}: {
  text: string;
}) {
  return (
    <span className="inline-flex items-center gap-2">
      <CheckCircle2
        size={16}
        className="text-[#6A8A5E]"
        aria-hidden="true"
      />
      {text}
    </span>
  );
}

function TrustStripItem({
  icon: Icon,
  title,
  text,
}: {
  icon: LucideIcon;
  title: string;
  text: string;
}) {
  return (
    <div className="flex items-center gap-3 sm:justify-center">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#E9EDDD] text-[#526641]">
        <Icon size={18} aria-hidden="true" />
      </span>

      <div>
        <p className="text-sm font-black">
          {title}
        </p>

        <p className="mt-0.5 text-xs text-black/42">
          {text}
        </p>
      </div>
    </div>
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
        "py-8 md:px-8 md:py-10",
        divided
          ? "border-t border-black/[0.08] md:border-l md:border-t-0"
          : "",
      ].join(" ")}
    >
      <Icon
        size={28}
        strokeWidth={1.8}
        className="text-[#B76E45]"
        aria-hidden="true"
      />

      <h3 className="mt-7 text-2xl font-black tracking-[-0.04em]">
        {title}
      </h3>

      <p className="mt-3 max-w-sm leading-7 text-black/48">
        {description}
      </p>
    </article>
  );
}

function ProcessStep({
  number,
  icon: Icon,
  title,
  description,
}: {
  number: string;
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <article className="bg-[#18392B] p-6 sm:p-8 lg:min-h-[330px]">
      <div className="flex items-center justify-between">
        <span className="text-sm font-black text-[#F0C955]">
          {number}
        </span>

        <span className="grid h-11 w-11 place-items-center rounded-full bg-white/10 text-[#DCE5B9]">
          <Icon size={20} aria-hidden="true" />
        </span>
      </div>

      <h3 className="mt-16 text-3xl font-black tracking-[-0.045em]">
        {title}
      </h3>

      <p className="mt-4 max-w-sm leading-7 text-white/55">
        {description}
      </p>
    </article>
  );
}

function BusinessBenefit({
  text,
}: {
  text: string;
}) {
  return (
    <li className="flex items-center gap-3">
      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white text-[#6A8A5E]">
        <Check size={14} strokeWidth={3} aria-hidden="true" />
      </span>

      {text}
    </li>
  );
}

function BusinessPreview() {
  return (
    <div className="rounded-[2rem] bg-[#18392B] p-4 text-white shadow-[0_30px_70px_rgba(24,57,43,0.24)] sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.12em] text-[#DCE5B9]">
            Business overview
          </p>

          <h3 className="mt-1 text-2xl font-black tracking-[-0.04em]">
            Today at your store
          </h3>
        </div>

        <span className="grid h-11 w-11 place-items-center rounded-full bg-white/10">
          <Store size={20} aria-hidden="true" />
        </span>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-2">
        <DashboardMetric
          label="Active deals"
          value="4"
        />

        <DashboardMetric
          label="Pickups"
          value="12"
        />

        <DashboardMetric
          label="Recovered"
          value="€74.80"
        />
      </div>

      <div className="mt-4 rounded-[1.4rem] bg-white p-4 text-[#18392B]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.1em] text-[#6A8A5E]">
              Live deal
            </p>

            <h4 className="mt-1 font-black">
              Evening Rescue Bags
            </h4>
          </div>

          <span className="rounded-full bg-[#E9EDDD] px-2.5 py-1 text-[9px] font-black text-[#526641]">
            Available
          </span>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <MiniMetric label="Stock" value="6" />
          <MiniMetric label="Claimed" value="8" />
          <MiniMetric label="Pickup" value="18:30" />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3 rounded-[1.4rem] bg-white/[0.08] p-4">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#F0C955] text-[#18392B]">
          <QrCode size={20} aria-hidden="true" />
        </span>

        <div>
          <p className="text-sm font-black">
            Pickup verification
          </p>

          <p className="mt-1 text-xs text-white/48">
            Scan or enter the customer code.
          </p>
        </div>
      </div>
    </div>
  );
}

function DashboardMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0 rounded-xl bg-white/10 px-2 py-3 text-center">
      <p className="truncate text-[8px] font-black uppercase tracking-[0.05em] text-white/45">
        {label}
      </p>

      <p className="mt-1 truncate text-lg font-black">
        {value}
      </p>
    </div>
  );
}

function MiniMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-[#F3F0E8] p-2.5">
      <p className="text-[8px] font-black uppercase tracking-[0.05em] text-black/30">
        {label}
      </p>

      <p className="mt-1 text-sm font-black">
        {value}
      </p>
    </div>
  );
}

function LandingFooter() {
  return (
    <footer className="bg-[#18392B] text-white">
      <div className="mx-auto w-full max-w-[1240px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 border-b border-white/10 pb-10 md:grid-cols-[1.3fr_0.7fr_0.7fr]">
          <div>
            <Link
              href="/"
              className="inline-flex"
            >
              <img
                src="/brand/claim-eat-logo-no-back.png"
                alt="ClaimEat"
                className="h-auto w-36 brightness-0 invert"
              />
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-6 text-white/48">
              Rescue good food from local businesses and collect it nearby.
            </p>
          </div>

          <FooterColumn
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

          <FooterColumn
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

        <div className="flex flex-col gap-2 pt-7 text-xs text-white/35 sm:flex-row sm:items-center sm:justify-between">
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

function FooterColumn({
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
      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#DCE5B9]">
        {title}
      </p>

      <nav className="mt-4 grid gap-3 text-sm font-bold text-white/50">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="transition hover:text-white"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
