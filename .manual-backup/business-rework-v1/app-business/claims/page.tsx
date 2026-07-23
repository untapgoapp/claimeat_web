import { BusinessGate } from "@/components/business/business-gate";
import { BusinessClaimsConsole } from "@/components/business/claims/business-claims-console";
import { Shell } from "@/components/layout/shell";

export default function BusinessClaimsPage() {
  return (
    <Shell>
      <BusinessGate>
        <BusinessClaimsConsole initialClaims={[]} />
      </BusinessGate>
    </Shell>
  );
}
