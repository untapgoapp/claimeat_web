import { BusinessDashboardView } from "@/components/business/dashboard/business-dashboard";
import { BusinessGate } from "@/components/business/business-gate";
import { Shell } from "@/components/layout/shell";

export default function BusinessPage() {
  return (
    <Shell>
      <BusinessGate>
        <BusinessDashboardView />
      </BusinessGate>
    </Shell>
  );
}
