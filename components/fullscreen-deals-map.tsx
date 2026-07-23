"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

import type { MapBusiness, MapDeal } from "@/lib/types";

type MapMode = "offers" | "businesses";

const DynamicDealMap = dynamic(
  () => import("@/components/deal-map"),
  {
    ssr: false,
    loading: () => <MapLoading />,
  },
);

const DynamicStoreMap = dynamic(
  () => import("@/components/deals/store-map"),
  {
    ssr: false,
    loading: () => <MapLoading />,
  },
);

export function FullscreenDealsMap({
  deals,
  businesses,
}: {
  deals: MapDeal[];
  businesses: MapBusiness[];
}) {
  const [mode, setMode] = useState<MapMode>("offers");

  const [selectedDealId, setSelectedDealId] = useState<
    string | null
  >(null);

  const [selectedStoreId, setSelectedStoreId] = useState<
    string | null
  >(null);

  function changeMode(nextMode: MapMode) {
    setMode(nextMode);
    setSelectedDealId(null);
    setSelectedStoreId(null);
  }

  return (
    <div className="relative">
      <div className="absolute left-1/2 top-4 z-30 -translate-x-1/2">
        <div className="inline-grid grid-cols-2 rounded-full border border-black/10 bg-[#FFFEFA]/95 p-1 shadow-[0_12px_36px_rgba(0,0,0,0.16)] backdrop-blur">
          <button
            type="button"
            onClick={() => changeMode("offers")}
            className={[
              "rounded-full px-5 py-2.5 text-sm font-black transition",
              mode === "offers"
                ? "bg-[#18392B] text-white"
                : "text-[#6B6258] hover:text-[#18392B]",
            ].join(" ")}
          >
            Offers
          </button>

          <button
            type="button"
            onClick={() => changeMode("businesses")}
            className={[
              "rounded-full px-5 py-2.5 text-sm font-black transition",
              mode === "businesses"
                ? "bg-[#18392B] text-white"
                : "text-[#6B6258] hover:text-[#18392B]",
            ].join(" ")}
          >
            Stores
          </button>
        </div>
      </div>

      {mode === "offers" ? (
        <DynamicDealMap
          deals={deals}
          selectedDealId={selectedDealId}
          onSelectDeal={setSelectedDealId}
          fullBleed
        />
      ) : (
        <DynamicStoreMap
          businesses={businesses}
          selectedStoreId={selectedStoreId}
          onSelectStore={setSelectedStoreId}
          fullBleed
        />
      )}
    </div>
  );
}

function MapLoading() {
  return (
    <div className="grid h-screen w-screen place-items-center bg-[#FBFAF6] text-sm font-semibold text-[#6B6258]">
      Loading map...
    </div>
  );
}