import { supabase } from "@/lib/supabase/client";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "http://127.0.0.1:8000";

export type ManagedBusinessDeal = {
  id: string;
  businessId: string;
  businessName: string;
  city: string | null;
  address: string | null;
  title: string;
  description: string | null;
  category: string;
  price: number;
  originalPrice: number;
  quantityLeft: number;
  pickupStart: string | null;
  pickupEnd: string | null;
  status: string;
  createdAt: string | null;
  claimCount: number;
  paidClaimCount: number;
  pickedUpCount: number;
  canDelete: boolean;
  canEditFully: boolean;
  hasClaims: boolean;
};

export type UpdateBusinessDealPayload = {
  title?: string;
  description?: string;
  category?: string;
  price?: number;
  original_price?: number;
  quantity_left?: number;
  pickup_start?: string | null;
  pickup_end?: string | null;
  status?: string;
};

async function getAuthHeaders() {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  if (!token) {
    throw new Error("You must be logged in.");
  }

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

async function parseError(response: Response) {
  const error = await response.json().catch(() => null);
  return error?.detail || "Request failed";
}

export async function fetchManagedBusinessDeals() {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/business/deals`, {
    headers,
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.json() as Promise<ManagedBusinessDeal[]>;
}

export async function updateManagedBusinessDeal(
  dealId: string,
  payload: UpdateBusinessDealPayload
) {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/business/deals/${dealId}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.json() as Promise<ManagedBusinessDeal>;
}

export async function closeManagedBusinessDeal(dealId: string) {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/business/deals/${dealId}/close`, {
    method: "POST",
    headers,
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.json() as Promise<ManagedBusinessDeal>;
}

export async function deleteManagedBusinessDeal(dealId: string) {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/business/deals/${dealId}`, {
    method: "DELETE",
    headers,
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.json() as Promise<{
    ok: boolean;
    deletedDealId: string;
    title: string;
  }>;
}
