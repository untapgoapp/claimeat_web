import Link from "next/link";
import { Shell } from "@/components/layout/shell";
import { fetchBusinessClaims } from "@/lib/api/admin";
import { fetchDeals } from "@/lib/api/deals";
import { ExpireReservationsButton } from "@/components/dev/expire-reservations-button";
import { ResetDemoDataButton } from "@/components/dev/reset-demo-data-button";

export default async function AdminPage() {
  const [deals, claims] = await Promise.all([
    fetchDeals(),
    fetchBusinessClaims(),
  ]);

  const revenue = claims.reduce((total, claim) => {
    const deal = deals.find((item) => item.id === claim.dealId);
    return total + (deal ? deal.price * claim.quantity : 0);
  }, 0);

  const collected = claims.filter(
    (claim) => claim.claimStatus === "collected"
  ).length;

  const activeClaims = claims.filter(
    (claim) => claim.claimStatus === "active"
  ).length;

  const mealsRescued = claims.reduce((total, claim) => {
    return total + claim.quantity;
  }, 0);

  return (
    <Shell>
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-[#6F7D43] dark:text-[#E1E9B8]">
          Internal view
        </p>

        <h1 className="mt-1 text-3xl font-black">Admin overview</h1>

        <p className="mt-2 text-black/60 dark:text-white/55">
          Demo metrics for ClaimEat pilot validation.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        <MetricCard label="Businesses" value="1" />
        <MetricCard label="Active deals" value={String(deals.length)} />
        <MetricCard label="Claims" value={String(claims.length)} />
        <MetricCard label="Collected" value={String(collected)} />
        <MetricCard label="Revenue" value={`€${revenue.toFixed(2)}`} />
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-[1.75rem] bg-white p-6 shadow-[0_10px_30px_rgba(95,78,55,0.08)] ring-1 ring-[#DDD2C2] dark:bg-[#241f1a] dark:ring-white/10">
          <h2 className="text-xl font-black">Pilot health</h2>

          <div className="mt-5 grid gap-3">
            <Row label="Meals rescued" value={String(mealsRescued)} />
            <Row label="Active pickup claims" value={String(activeClaims)} />
            <Row label="Collection rate" value={claims.length ? `${Math.round((collected / claims.length) * 100)}%` : "0%"} />
          </div>
        </div>

        <div className="rounded-[1.75rem] bg-white p-6 shadow-[0_10px_30px_rgba(95,78,55,0.08)] ring-1 ring-[#DDD2C2] dark:bg-[#241f1a] dark:ring-white/10">
          <h2 className="text-xl font-black">Quick actions</h2>

          <div className="mt-5 flex flex-col gap-3">
            <Link
              href="/business/deals/new"
              className="rounded-2xl bg-[#6f7d43] px-5 py-3 text-center font-semibold text-white hover:bg-[#5d6d32] dark:bg-[#9baa6a] dark:text-[#2F261F]"
            >
              Create demo deal
            </Link>

            <Link
              href="/business/claims"
              className="rounded-2xl bg-white px-5 py-3 text-center font-semibold shadow-[0_10px_30px_rgba(95,78,55,0.08)] ring-1 ring-black/10 hover:bg-[#556235]/[0.02] dark:bg-[#171411] dark:ring-white/10"
            >
              View pickup claims
            </Link>

            <Link
              href="/deals"
              className="rounded-2xl bg-white px-5 py-3 text-center font-semibold shadow-[0_10px_30px_rgba(95,78,55,0.08)] ring-1 ring-black/10 hover:bg-[#556235]/[0.02] dark:bg-[#171411] dark:ring-white/10"
            >
              View customer feed
            </Link>

            <ExpireReservationsButton />

            <ResetDemoDataButton />
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-[1.75rem] bg-white p-6 shadow-[0_10px_30px_rgba(95,78,55,0.08)] ring-1 ring-[#DDD2C2] dark:bg-[#241f1a] dark:ring-white/10">
        <h2 className="text-xl font-black">Recent claims</h2>

        {claims.length === 0 ? (
          <p className="mt-4 text-black/55 dark:text-white/45">
            No claims yet.
          </p>
        ) : (
          <div className="mt-4 overflow-hidden rounded-2xl border border-black/10 dark:border-white/10">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#F4EFE6] dark:bg-[#171411]">
                <tr>
                  <th className="px-4 py-3">Code</th>
                  <th className="px-4 py-3">Deal</th>
                  <th className="px-4 py-3">Qty</th>
                  <th className="px-4 py-3">Payment</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>

              <tbody>
                {claims.map((claim) => {
                  const deal = deals.find((item) => item.id === claim.dealId);

                  return (
                    <tr
                      key={claim.id}
                      className="border-t border-black/10 dark:border-white/10"
                    >
                      <td className="px-4 py-3 font-bold">
                        {claim.pickupCode || claim.id}
                      </td>
                      <td className="px-4 py-3">
                        {deal?.title || claim.dealId}
                      </td>
                      <td className="px-4 py-3">{claim.quantity}</td>
                      <td className="px-4 py-3">{claim.paymentStatus}</td>
                      <td className="px-4 py-3">{claim.claimStatus}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Shell>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl bg-white p-5 shadow-[0_10px_30px_rgba(95,78,55,0.08)] ring-1 ring-[#DDD2C2] dark:bg-[#241f1a] dark:ring-white/10">
      <p className="text-sm text-black/50 dark:text-white/45">{label}</p>
      <p className="mt-2 text-3xl font-black">{value}</p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-[#F4EFE6] px-4 py-3 dark:bg-[#171411]">
      <span className="text-black/60 dark:text-white/55">{label}</span>
      <span className="font-bold">{value}</span>
    </div>
  );
}
