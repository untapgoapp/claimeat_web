import Link from "next/link";
import {
  ArrowRight,
  Check,
  Clock3,
  Leaf,
  MapPinned,
  PackageCheck,
  ShoppingBag,
  Store,
} from "lucide-react";

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#FBFAF6] text-[#18392B]">
      <header className="border-b border-black/[0.06] bg-[#FBFAF6]/95 backdrop-blur-xl">
        <div className="mx-auto flex min-h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link
            href="/"
            className="flex items-center gap-2.5"
            aria-label="ClaimEat home"
          >
            <span className="grid h-10 w-10 place-items-center rounded-full bg-[#6A8A5E] text-white">
              <Leaf
                size={20}
                strokeWidth={2.4}
                aria-hidden="true"
              />
            </span>

            <span className="text-xl font-black tracking-[-0.04em]">
              ClaimEat
            </span>
          </Link>

          <nav className="flex items-center gap-2">
            <Link
              href="/login"
              className="hidden min-h-10 items-center justify-center rounded-full px-4 text-sm font-black text-[#18392B] transition hover:bg-black/[0.04] sm:inline-flex"
            >
              Sign in
            </Link>

            <Link
              href="/deals"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#18392B] px-5 text-sm font-black text-white transition hover:bg-[#10271D]"
            >
              Open ClaimEat
              <ArrowRight
                size={17}
                aria-hidden="true"
              />
            </Link>
          </nav>
        </div>
      </header>

      <section className="relative">
        <div
          aria-hidden="true"
          className="absolute -right-32 top-10 h-80 w-80 rounded-full bg-[#F0C955]/25 blur-3xl"
        />

        <div
          aria-hidden="true"
          className="absolute -left-40 bottom-0 h-96 w-96 rounded-full bg-[#6A8A5E]/15 blur-3xl"
        />

        <div className="relative mx-auto grid w-full max-w-6xl gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-32">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#6A8A5E]/20 bg-[#E8EDD9] px-3 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-[#526641]">
              <MapPinned
                size={14}
                aria-hidden="true"
              />
              Pärnu pilot
            </div>

            <h1 className="mt-6 max-w-3xl text-[clamp(3rem,12vw,6.4rem)] font-black leading-[0.88] tracking-[-0.065em] text-[#18392B]">
              Good food deserves better.
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-black/58 sm:text-xl">
              Find surplus food from local businesses, claim it before it
              disappears and collect it during the pickup window.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/deals"
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-[#B76E45] px-7 text-base font-black text-white shadow-[0_14px_30px_rgba(183,110,69,0.24)] transition hover:bg-[#A35F3B]"
              >
                Browse deals
                <ArrowRight
                  size={19}
                  aria-hidden="true"
                />
              </Link>

              <Link
                href="/discover"
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full border border-black/10 bg-white px-7 text-base font-black text-[#18392B] transition hover:border-[#6A8A5E]/40"
              >
                <MapPinned
                  size={19}
                  aria-hidden="true"
                />
                Explore the map
              </Link>
            </div>

            <p className="mt-5 flex items-center gap-2 text-sm font-semibold text-black/45">
              <Check
                size={16}
                className="text-[#6A8A5E]"
                aria-hidden="true"
              />
              Installable on your phone. No app store needed.
            </p>
          </div>

          <div className="relative mx-auto w-full max-w-md lg:mx-0 lg:ml-auto">
            <div className="absolute -inset-5 rotate-3 rounded-[2.8rem] bg-[#F0C955]/45" />

            <div className="relative overflow-hidden rounded-[2.5rem] border border-black/[0.06] bg-white p-6 shadow-[0_28px_80px_rgba(56,48,36,0.16)] sm:p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[#6A8A5E]">
                    ClaimEat
                  </p>

                  <h2 className="mt-2 text-3xl font-black tracking-[-0.045em]">
                    Rescue nearby
                  </h2>
                </div>

                <span className="grid h-12 w-12 place-items-center rounded-full bg-[#E8EDD9] text-[#526641]">
                  <ShoppingBag
                    size={23}
                    aria-hidden="true"
                  />
                </span>
              </div>

              <div className="mt-8 space-y-3">
                <FeatureRow
                  icon={Store}
                  title="Local businesses"
                  description="Discover food available around Pärnu."
                />

                <FeatureRow
                  icon={Clock3}
                  title="Clear pickup windows"
                  description="Know where and when to collect."
                />

                <FeatureRow
                  icon={PackageCheck}
                  title="Simple claiming"
                  description="Reserve food before somebody else does."
                />
              </div>

              <div className="mt-8 rounded-[1.6rem] bg-[#18392B] p-5 text-white">
                <p className="text-sm font-bold text-white/65">
                  Current availability
                </p>

                <p className="mt-2 text-xl font-black tracking-[-0.025em]">
                  Real offers appear inside ClaimEat as businesses publish
                  them.
                </p>

                <Link
                  href="/deals"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-black text-[#F0C955]"
                >
                  Check what is available
                  <ArrowRight
                    size={16}
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-black/[0.06] bg-white">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="max-w-2xl">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#6A8A5E]">
              How it works
            </p>

            <h2 className="mt-3 text-4xl font-black tracking-[-0.05em] sm:text-5xl">
              Find it. Claim it. Collect it.
            </h2>

            <p className="mt-4 text-lg leading-8 text-black/50">
              No queues, mystery detours or archaeological expeditions through
              supermarket bins.
            </p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            <StepCard
              number="01"
              icon={MapPinned}
              title="Find"
              description="Browse available food nearby or explore businesses on the map."
            />

            <StepCard
              number="02"
              icon={ShoppingBag}
              title="Claim"
              description="Choose an offer and reserve it while it is still available."
            />

            <StepCard
              number="03"
              icon={Clock3}
              title="Collect"
              description="Visit the business during its pickup window and collect your food."
            />
          </div>
        </div>
      </section>

      <section className="bg-[#E8EDD9]">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#6A8A5E] text-white">
              <Store
                size={27}
                aria-hidden="true"
              />
            </div>

            <h2 className="mt-6 max-w-3xl text-4xl font-black tracking-[-0.05em] sm:text-5xl">
              Have good food left at the end of the day?
            </h2>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-black/55">
              ClaimEat gives local businesses a simpler way to sell surplus
              food instead of wasting it.
            </p>
          </div>

          <Link
            href="/for-businesses"
            className="inline-flex min-h-14 w-fit items-center justify-center gap-2 rounded-full bg-[#18392B] px-7 text-base font-black text-white transition hover:bg-[#10271D]"
          >
            Claim your business
            <ArrowRight
              size={19}
              aria-hidden="true"
            />
          </Link>
        </div>
      </section>

      <footer className="bg-[#18392B] text-white">
        <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Link
                href="/"
                className="flex items-center gap-2 text-xl font-black tracking-[-0.04em]"
              >
                <Leaf
                  size={21}
                  className="text-[#F0C955]"
                  aria-hidden="true"
                />
                ClaimEat
              </Link>

              <p className="mt-2 text-sm text-white/55">
                Still good. Still here.
              </p>
            </div>

            <nav className="flex flex-wrap gap-x-5 gap-y-3 text-sm font-bold text-white/65">
              <Link
                href="/how-it-works"
                className="hover:text-white"
              >
                How it works
              </Link>

              <Link
                href="/about"
                className="hover:text-white"
              >
                About
              </Link>

              <Link
                href="/contact"
                className="hover:text-white"
              >
                Contact
              </Link>

              <Link
                href="/privacy"
                className="hover:text-white"
              >
                Privacy
              </Link>

              <Link
                href="/terms"
                className="hover:text-white"
              >
                Terms
              </Link>
            </nav>
          </div>

          <div className="mt-9 border-t border-white/10 pt-6 text-xs text-white/40">
            © {new Date().getFullYear()} ClaimEat
          </div>
        </div>
      </footer>
    </main>
  );
}

type FeatureIcon = typeof Store;

function FeatureRow({
  icon: Icon,
  title,
  description,
}: {
  icon: FeatureIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4 rounded-[1.4rem] bg-[#FBFAF6] p-4">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white text-[#6A8A5E] shadow-sm">
        <Icon
          size={21}
          aria-hidden="true"
        />
      </span>

      <div>
        <h3 className="font-black">{title}</h3>

        <p className="mt-1 text-sm leading-5 text-black/48">
          {description}
        </p>
      </div>
    </div>
  );
}

function StepCard({
  number,
  icon: Icon,
  title,
  description,
}: {
  number: string;
  icon: FeatureIcon;
  title: string;
  description: string;
}) {
  return (
    <article className="rounded-[2rem] border border-black/[0.06] bg-[#FBFAF6] p-6 sm:p-7">
      <div className="flex items-center justify-between">
        <span className="text-sm font-black text-[#B76E45]">
          {number}
        </span>

        <span className="grid h-11 w-11 place-items-center rounded-full bg-[#E8EDD9] text-[#526641]">
          <Icon
            size={21}
            aria-hidden="true"
          />
        </span>
      </div>

      <h3 className="mt-8 text-2xl font-black tracking-[-0.035em]">
        {title}
      </h3>

      <p className="mt-3 leading-7 text-black/50">
        {description}
      </p>
    </article>
  );
}
