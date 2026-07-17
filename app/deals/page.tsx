import { DealsExplorer } from "@/components/deals/deals-explorer";
import { FullscreenDealsMap } from "@/components/fullscreen-deals-map";
import { Shell } from "@/components/layout/shell";
import { SiteHeader } from "@/components/layout/site-header";
import {
  fetchDeals,
  fetchMapDeals,
} from "@/lib/api/deals";

import { fetchMapBusinesses } from "@/lib/api/businesses";

export default async function DealsPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const params = await searchParams;

  if (params.view === "map") {
    const [mapDeals, mapBusinesses] = await Promise.all([
      fetchMapDeals(),
      fetchMapBusinesses(),
    ]);

    return (
      <div className="min-h-screen bg-[#FBFAF6] text-[#18392B] dark:bg-[#171411] dark:text-[#fff7e8]">
        <SiteHeader />

        <FullscreenDealsMap
          deals={mapDeals}
          businesses={mapBusinesses}
        />
      </div>
    );
  }

  const [deals, mapDeals, mapBusinesses] = await Promise.all([
    fetchDeals(),
    fetchMapDeals(),
    fetchMapBusinesses(),
  ]);

  return (
    <Shell>
      <DealsExplorer
        deals={deals}
        mapDeals={mapDeals}
        businesses={mapBusinesses}
        initialView="list"
      />
    </Shell>
  );
}