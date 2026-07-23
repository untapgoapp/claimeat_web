import { BusinessDealsManager } from "@/components/business/deals/business-deals-manager";
import { BusinessGate } from "@/components/business/business-gate";

export default function BusinessDealsPage() {
  return (
    <>
      <BusinessGate>
        <BusinessDealsManager />
      </BusinessGate>
    </>
  );
}
