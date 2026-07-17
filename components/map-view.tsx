"use client";

import dynamic from "next/dynamic";
import { MapDeal } from "@/lib/types";

const DynamicDealsMapBrowser = dynamic(
  () =>
    import("@/components/deals-map-browser").then(
      (mod) => mod.DealsMapBrowser
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[680px] items-center justify-center rounded-[1.75rem] bg-white shadow-[0_10px_30px_rgba(95,78,55,0.08)] ring-1 ring-[#DDD2C2] dark:bg-[#241f1a] dark:ring-white/10">
        <p className="text-black/55 dark:text-white/45">Loading map...</p>
      </div>
    ),
  }
);

export function MapView({ deals }: { deals: MapDeal[] }) {
  return <DynamicDealsMapBrowser deals={deals} />;
}
