import { FullscreenDealsMap } from "@/components/fullscreen-deals-map";
import { fetchMapBusinesses } from "@/lib/api/businesses";
import { fetchMapDeals } from "@/lib/api/deals";

export default async function DiscoverPage() {
  const [mapDeals, mapBusinesses] = await Promise.all([
    fetchMapDeals(),
    fetchMapBusinesses(),
  ]);

  return (
    <section
      className="relative w-full overflow-hidden bg-[#FBFAF6] text-[#18392B] dark:bg-[#171411] dark:text-[#fff7e8]"
      style={{
        height:
          "calc(100dvh - var(--claim-app-nav-height) - env(safe-area-inset-bottom))",
      }}
    >
      <FullscreenDealsMap
        deals={mapDeals}
        businesses={mapBusinesses}
      />
    </section>
  );
}
