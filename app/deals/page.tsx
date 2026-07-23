import { DealsExplorer } from "@/components/deals/deals-explorer";
import { fetchDeals } from "@/lib/api/deals";

export default async function DealsPage() {
  const deals = await fetchDeals();

  return <DealsExplorer deals={deals} />;
}
