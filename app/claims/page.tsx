import Link from "next/link";
import { Shell } from "@/components/layout/shell";
import { ClaimQr } from "@/components/claim-qr";
import { fetchClaims } from "@/lib/api/admin";
import { fetchDeal } from "@/lib/api/deals";
import { Deal } from "@/lib/types";

function formatTime(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export default async function ClaimsPage() {
  const claims = await fetchClaims();

  const uniqueDealIds = [...new Set(claims.map((claim) => claim.dealId))];

  const dealEntries = await Promise.all(
    uniqueDealIds.map(async (dealId) => {
      try {
        const deal = await fetchDeal(dealId);
        return [dealId, deal] as const;
      } catch {
        return [dealId, null] as const;
      }
    })
  );

  const dealsById = new Map<string, Deal | null>(dealEntries);

  const activeClaims = claims.filter((claim) => claim.claimStatus === "active");
  const pastClaims = claims.filter((claim) => claim.claimStatus !== "active");

  return (
    <Shell>
      <section className="mb-8 rounded-[1.75rem] bg-white p-6 shadow-[0_10px_30px_rgba(95,78,55,0.08)] ring-1 ring-[#DDD2C2] dark:bg-[#241f1a] dark:ring-white/10 md:p-8">
        <p className="text-sm font-black uppercase tracking-wide text-[#6F7D43] dark:text-[#E1E9B8]">
          Pickup wallet
        </p>

        <h1 className="mt-2 text-4xl font-black tracking-tight md:text-5xl">
          My claims
        </h1>

        <p className="mt-3 max-w-2xl text-black/60 dark:text-white/55">
          Your active pickup codes and collected food rescue orders.
        </p>
      </section>

      {claims.length === 0 ? (
        <div className="rounded-[1.75rem] bg-white p-8 text-center shadow-[0_10px_30px_rgba(95,78,55,0.08)] ring-1 ring-[#DDD2C2] dark:bg-[#241f1a] dark:ring-white/10">
          <p className="text-2xl font-black">No claims yet</p>

          <p className="mx-auto mt-2 max-w-md text-black/55 dark:text-white/45">
            Find discounted food nearby and claim your first rescue bag.
          </p>

          <Link
            href="/deals"
            className="mt-6 inline-flex rounded-2xl bg-[#6f7d43] px-5 py-3 font-black text-white hover:bg-[#5d6d32] dark:bg-[#9baa6a] dark:text-[#2F261F]"
          >
            Browse deals
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          <ClaimSection
            title="Active claims"
            claims={activeClaims}
            dealsById={dealsById}
          />

          <ClaimSection
            title="Past claims"
            claims={pastClaims}
            dealsById={dealsById}
          />
        </div>
      )}
    </Shell>
  );
}

function ClaimSection({
  title,
  claims,
  dealsById,
}: {
  title: string;
  claims: Awaited<ReturnType<typeof fetchClaims>>;
  dealsById: Map<string, Deal | null>;
}) {
  if (claims.length === 0) return null;

  return (
    <section>
      <h2 className="mb-4 text-2xl font-black">{title}</h2>

      <div className="grid gap-4">
        {claims.map((claim) => {
          const deal = dealsById.get(claim.dealId);

          return (
            <div
              key={claim.id}
              className="grid gap-5 rounded-[1.75rem] bg-white p-6 shadow-[0_10px_30px_rgba(95,78,55,0.08)] ring-1 ring-[#DDD2C2] dark:bg-[#241f1a] dark:ring-white/10 md:grid-cols-[190px_1fr_auto]"
            >
              <div className="flex justify-center md:justify-start">
                <ClaimQr value={claim.qrCode || `CLAIMEAT:${claim.id}`} />
              </div>

              <div>
                <p className="text-sm font-black uppercase tracking-wide text-[#6F7D43] dark:text-[#E1E9B8]">
                  {claim.claimStatus}
                </p>

                <h3 className="mt-1 text-2xl font-black">
                  {deal?.title || "Rescue claim"}
                </h3>

                <p className="mt-1 text-sm text-black/50 dark:text-white/40">
                  {deal?.businessName || "Participating business"}
                </p>

                <div className="mt-4 grid gap-2 text-sm text-black/60 dark:text-white/50">
                  <p>
                    <span className="font-bold">Pickup code:</span>{" "}
                    {claim.pickupCode || claim.id.replace("claim_", "").toUpperCase()}
                  </p>

                  {deal && (
                    <>
                      <p>
                        <span className="font-bold">Pickup:</span>{" "}
                        {formatTime(deal.pickupStart)}-{formatTime(deal.pickupEnd)}
                      </p>

                      <p>
                        <span className="font-bold">Address:</span>{" "}
                        {deal.address}, {deal.city}
                      </p>
                    </>
                  )}

                  <p>
                    <span className="font-bold">Quantity:</span>{" "}
                    {claim.quantity} · Payment: {claim.paymentStatus}
                  </p>
                </div>
              </div>

              <div className="flex items-start md:justify-end">
                <span className="rounded-full bg-[#EEF1E3] px-4 py-2 text-sm font-black text-[#6F7D43] dark:bg-[#556235] dark:text-[#E1E9B8]">
                  {claim.claimStatus}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
