import Link from "next/link";
import { ArrowRight, Clock3, Leaf, MapPin, ShoppingBag, Store } from "lucide-react";

import { Shell } from "@/components/layout/shell";

const featuredDeals = [
  {
    title: "Bakery rescue bag",
    store: "Pagarikoda",
    distance: "650 m",
    price: "€3.99",
    value: "€9.50 value",
    pickup: "18:30 - 20:00",
    left: "4 left",
  },
  {
    title: "Café lunch box",
    store: "Morning Table",
    distance: "1.2 km",
    price: "€4.49",
    value: "€12 value",
    pickup: "16:00 - 17:30",
    left: "2 left",
  },
  {
    title: "Grocery surprise bag",
    store: "Local Market",
    distance: "900 m",
    price: "€2.99",
    value: "€8 value",
    pickup: "19:00 - 20:30",
    left: "6 left",
  },
];

const localTypes = ["Bakeries", "Cafés", "Restaurants", "Groceries", "Lunch spots"];

export default function HomePage() {
  return (
    <Shell>
      <main className="bg-[#FBFAF6] text-[#18392B]">
        <section className="mx-auto grid min-h-[calc(100vh-8rem)] max-w-7xl gap-14 px-5 py-16 md:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.24em] text-[#6A8A5E]">
              <Leaf size={15} />
              Still good. Still here.
            </p>

            <h1 className="mt-7 text-[clamp(3.8rem,9vw,8.8rem)] font-black leading-[0.82] tracking-[-0.065em]">
              Good food deserves better.
            </h1>

            <p className="mt-8 max-w-xl text-lg leading-8 text-[#6B6258] md:text-xl md:leading-9">
              Discover food bags from local cafés, bakeries and shops before they disappear.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/deals"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#18392B] px-7 py-4 font-black text-[#FBFAF6] shadow-[0_18px_45px_rgba(24,57,43,0.18)] transition hover:-translate-y-0.5 hover:bg-[#10271D]"
              >
                Browse deals
                <ArrowRight size={18} />
              </Link>

              <Link
                href="/business"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#E8D8BE] px-7 py-4 font-black text-[#18392B] transition hover:-translate-y-0.5 hover:bg-[#DCC7A6]"
              >
                For businesses
                <Store size={18} />
              </Link>
            </div>
          </div>

          <div className="border-l border-[#E6D9C5] pl-8 lg:pl-14">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-[#C76F56]">
              Tonight in Pärnu
            </p>

            <div className="mt-8 divide-y divide-[#E6D9C5]">
              {featuredDeals.map((deal) => (
                <HeroDeal key={deal.title} deal={deal} />
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
          <div className="grid gap-10 border-t border-[#E6D9C5] pt-14 lg:grid-cols-[0.45fr_1fr]">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.22em] text-[#6A8A5E]">
                Local food, second chances
              </p>

              <h2 className="mt-4 max-w-xl text-5xl font-black leading-[0.95] tracking-[-0.05em] md:text-7xl">
                Discover the places around you.
              </h2>
            </div>

            <div>
              <p className="max-w-2xl text-lg leading-8 text-[#6B6258]">
                ClaimEat is built around real food businesses, not anonymous boxes.
                Find bakeries, cafés, grocery stores and lunch spots with something
                good still waiting.
              </p>

              <div className="mt-8 flex flex-wrap gap-x-5 gap-y-3">
                {localTypes.map((type) => (
                  <Link
                    href="/deals"
                    key={type}
                    className="text-lg font-black text-[#18392B] underline decoration-[#E7B83D] decoration-4 underline-offset-8 transition hover:text-[#6A8A5E]"
                  >
                    {type}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
          <div className="grid gap-10 border-t border-[#E6D9C5] pt-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.22em] text-[#C76F56]">
                For businesses
              </p>

              <h2 className="mt-4 max-w-3xl text-5xl font-black leading-[0.95] tracking-[-0.05em] md:text-7xl">
                Have surplus food? Turn it into paid pickups.
              </h2>
            </div>

            <div>
              <p className="max-w-xl text-lg leading-8 text-[#6B6258]">
                Create food bags, set pickup windows and let customers reserve before closing time.
              </p>

              <Link
                href="/business"
                className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-[#18392B] px-7 py-4 font-black text-[#FBFAF6] shadow-[0_18px_45px_rgba(24,57,43,0.18)] transition hover:-translate-y-0.5 hover:bg-[#10271D]"
              >
                Add your business
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </Shell>
  );
}

function HeroDeal({
  deal,
}: {
  deal: {
    title: string;
    store: string;
    distance: string;
    price: string;
    value: string;
    pickup: string;
    left: string;
  };
}) {
  return (
    <Link
      href="/deals"
      className="group grid gap-5 py-7 transition hover:translate-x-1 md:grid-cols-[1fr_auto] md:items-center"
    >
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-3xl font-black tracking-[-0.04em] text-[#18392B]">
            {deal.title}
          </h2>

          <span className="rounded-full bg-[#E7B83D] px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-[#18392B]">
            {deal.left}
          </span>
        </div>

        <p className="mt-2 font-bold text-[#6B6258]">
          {deal.store} · {deal.distance}
        </p>

        <div className="mt-3 flex flex-wrap gap-3 text-sm font-bold text-[#8A7A68]">
          <span className="inline-flex items-center gap-1.5">
            <MapPin size={14} />
            {deal.distance}
          </span>
          <span>·</span>
          <span className="inline-flex items-center gap-1.5">
            <Clock3 size={14} />
            {deal.pickup}
          </span>
          <span>·</span>
          <span>{deal.value}</span>
        </div>
      </div>

      <div className="flex items-center gap-4 md:justify-end">
        <p className="text-3xl font-black tracking-[-0.04em] text-[#18392B]">
          {deal.price}
        </p>

        <ShoppingBag
          size={24}
          className="text-[#6A8A5E] transition group-hover:scale-110"
        />
      </div>
    </Link>
  );
}
