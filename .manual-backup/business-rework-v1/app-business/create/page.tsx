import { BusinessGate } from "@/components/business/business-gate";
import { BusinessCreateDealForm } from "@/components/business/create/business-create-deal-form";
import { Shell } from "@/components/layout/shell";

export default function BusinessCreatePage() {
  return (
    <Shell>
      <BusinessGate>
        <BusinessCreateDealForm />
      </BusinessGate>
    </Shell>
  );
}
