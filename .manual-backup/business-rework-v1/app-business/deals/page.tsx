import { BusinessDealsManager } from "@/components/business/deals/business-deals-manager";
import { BusinessGate } from "@/components/business/business-gate";
import { Shell } from "@/components/layout/shell";

export default function BusinessDealsPage() {
  return (
    <Shell>
      <BusinessGate>
        <BusinessDealsManager />
      </BusinessGate>
    </Shell>
  );
}
