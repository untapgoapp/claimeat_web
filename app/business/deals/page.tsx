import { BusinessGate } from "@/components/business/business-gate";
import { BusinessDealsManager } from "@/components/business/deals/business-deals-manager";

export default function BusinessDealsPage() {
  return (
    <BusinessGate>
      <BusinessDealsManager />
    </BusinessGate>
  );
}
