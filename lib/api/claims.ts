import { API_URL, getAuthHeaders, readApiError } from "@/lib/api/client";

export type RedeemClaimResult = {
  ok?: boolean;
  already_picked_up?: boolean;
  claim: {
    id: string;
    code: string | null;
    pickup_code?: string | null;
    qr_code?: string | null;
    deal_title: string;
    business_name: string;
    claim_status?: string;
    payment_status?: string;
    picked_up_at?: string | null;
    collected_at?: string | null;
  };
};

export type LookupClaimResult = {
  id: string;
  code: string | null;
  pickup_code: string | null;
  qr_code: string | null;
  claim_status: string;
  payment_status: string;
  deal_title: string;
  business_name: string;
};

export async function redeemClaim(code: string, businessId?: string) {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/claims/redeem`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      code,
      business_id: businessId || null,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(await readApiError(response, "Could not redeem claim"));
  }

  return response.json() as Promise<RedeemClaimResult>;
}

export async function lookupClaim(code: string) {
  const response = await fetch(`${API_URL}/claims/lookup/${encodeURIComponent(code)}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(await readApiError(response, "Could not lookup claim"));
  }

  return response.json() as Promise<LookupClaimResult>;
}
