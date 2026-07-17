import { Claim, Deal, MapDeal } from "@/lib/types";
import { supabase } from "@/lib/supabase/client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

type ApiDeal = {
  id: string;
  business_id: string;
  title: string;
  description?: string | null;
  category?: Deal["category"] | null;
  image_url?: string | null;
  price: number | string;
  original_price?: number | string | null;
  quantity_total: number;
  quantity_left: number;
  status: Deal["status"];
  pickup_start: string;
  pickup_end: string;
  created_at: string;
  business_name?: string | null;
  address_text?: string | null;
  business_address?: string | null;
  city?: string | null;
  business_city?: string | null;
};

type ApiClaim = {
  id: string;
  deal_id: string;
  user_id: string;
  quantity: number;
  payment_status: string;
  claim_status: string;
  created_at: string;
  pickup_code: string | null;
  qr_code: string | null;
};

type ApiMapDeal = {
  id: string;
  title: string;
  description: string | null;
  price: number;
  original_price: number;
  quantity_left: number;
  status: string;
  pickup_start: string;
  pickup_end: string;
  business_name: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
};

function inferCategory(title: string): Deal["category"] {
  const value = title.toLowerCase();

  if (value.includes("bakery") || value.includes("bread") || value.includes("pastry")) {
    return "bakery";
  }

  if (value.includes("fruit") || value.includes("veg")) {
    return "fruit_veg";
  }

  if (value.includes("meal") || value.includes("dinner") || value.includes("lunch")) {
    return "ready_meal";
  }

  if (value.includes("family")) {
    return "family_pack";
  }

  if (value.includes("grocery")) {
    return "grocery";
  }

  return "mystery_bag";
}

function mapDeal(apiDeal: ApiDeal): Deal {
  const price = Number(apiDeal.price);
  const originalPrice = apiDeal.original_price
    ? Number(apiDeal.original_price)
    : Number((price * 2.4).toFixed(2));

  return {
    id: apiDeal.id,
    businessId: apiDeal.business_id,
    businessName: apiDeal.business_name || "Selver Demo Store",
    city: apiDeal.business_city || apiDeal.city || "Pärnu",
    address:
      apiDeal.business_address ||
      apiDeal.address_text ||
      "Pärnu Keskus",
    title: apiDeal.title,
    description: apiDeal.description || "A surprise selection of good food available for pickup today.",
    category: apiDeal.category || inferCategory(apiDeal.title),
    price,
    originalPrice,
    quantityLeft: apiDeal.quantity_left,
    pickupStart: apiDeal.pickup_start,
    pickupEnd: apiDeal.pickup_end,
    status: apiDeal.status,
  };
}

function mapClaim(apiClaim: ApiClaim): Claim {
  return {
    id: apiClaim.id,
    dealId: apiClaim.deal_id,
    userId: apiClaim.user_id,
    quantity: apiClaim.quantity,
    paymentStatus: apiClaim.payment_status,
    claimStatus: apiClaim.claim_status,
    createdAt: apiClaim.created_at,
    pickupCode: apiClaim.pickup_code,
    qrCode: apiClaim.qr_code,
  };
}

function mapMapDeal(apiDeal: ApiMapDeal): MapDeal {
  return {
    id: apiDeal.id,
    title: apiDeal.title,
    description: apiDeal.description,
    price: Number(apiDeal.price),
    originalPrice: Number(apiDeal.original_price),
    quantityLeft: apiDeal.quantity_left,
    status: apiDeal.status,
    pickupStart: apiDeal.pickup_start,
    pickupEnd: apiDeal.pickup_end,
    businessName: apiDeal.business_name,
    address: apiDeal.address,
    city: apiDeal.city,
    latitude: Number(apiDeal.latitude),
    longitude: Number(apiDeal.longitude),
  };
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`API error ${response.status}: ${body}`);
  }

  return response.json();
}

export async function fetchDeals(): Promise<Deal[]> {
  const deals = await apiFetch<ApiDeal[]>("/public/deals");
  return deals.map(mapDeal);
}

export async function fetchDeal(id: string): Promise<Deal> {
  const deal = await apiFetch<ApiDeal>(`/public/deals/${id}`);
  return mapDeal(deal);
}

export async function createBusinessDeal(data: {
  title: string;
  description: string;
  price: number;
  quantity: number;
  pickupStart: string;
  pickupEnd: string;
}): Promise<Deal> {
  const deal = await apiFetch<ApiDeal>("/deals", {
    method: "POST",
    body: JSON.stringify({
      business_id: "selver_demo",
      title: data.title,
      description: data.description,
      price: data.price,
      quantity: data.quantity,
      pickup_start: data.pickupStart,
      pickup_end: data.pickupEnd,
    }),
  });

  return mapDeal(deal);
}

export async function createPaymentIntent(data: {
  dealId: string;
  quantity: number;
}): Promise<{ client_secret: string; claim_id: string | null; reserved_until: string | null }> {
  const { data: sessionData } = await supabase.auth.getSession();
  const token = sessionData.session?.access_token;

  if (!token) {
    throw new Error("AUTH_REQUIRED");
  }

  return apiFetch("/create-payment-intent", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      deal_id: data.dealId,
      quantity: data.quantity,
    }),
  });
}

export async function createClaim(data: {
  dealId: string;
  quantity: number;
}): Promise<Claim> {
  const claim = await apiFetch<ApiClaim>("/claims", {
    method: "POST",
    body: JSON.stringify({
      deal_id: data.dealId,
      quantity: data.quantity,
    }),
  });

  return mapClaim(claim);
}

export async function fetchClaims(): Promise<Claim[]> {
  const claims = await apiFetch<ApiClaim[]>("/claims");
  return claims.map(mapClaim);
}

export async function fetchClaim(claimId: string): Promise<Claim> {
  const claim = await apiFetch<ApiClaim>(`/claims/${claimId}`);
  return mapClaim(claim);
}

export async function fetchBusinessClaims(): Promise<Claim[]> {
  const claims = await apiFetch<ApiClaim[]>("/business/claims");
  return claims.map(mapClaim);
}

export async function collectClaim(claimId: string): Promise<Claim> {
  const claim = await apiFetch<ApiClaim>(`/claims/${claimId}/collect`, {
    method: "POST",
  });

  return mapClaim(claim);
}

export async function confirmClaimPayment(data: {
  claimId: string;
  stripePaymentIntentId: string;
}): Promise<Claim> {
  const claim = await apiFetch<ApiClaim>(`/claims/${data.claimId}/confirm-payment`, {
    method: "POST",
    body: JSON.stringify({
      stripe_payment_intent_id: data.stripePaymentIntentId,
    }),
  });

  return mapClaim(claim);
}

export async function expireReservations(): Promise<{ expired: number }> {
  return apiFetch("/admin/expire-reservations", {
    method: "POST",
  });
}

export async function fetchMapDeals(): Promise<MapDeal[]> {
  const deals = await apiFetch<ApiMapDeal[]>("/map/deals");
  return deals.map(mapMapDeal);
}


export async function resetDemoData(): Promise<{
  businesses: number;
  deals_inserted: number;
  claims_deleted: number;
  deals_deleted: number;
}> {
  return apiFetch("/admin/reset-demo-data", {
    method: "POST",
  });
}

export type RedeemClaimResult = {
  ok: boolean;
  already_picked_up: boolean;
  claim: {
    id: string;
    code: string;
    status: string;
    picked_up_at: string | null;
    deal_id: string;
    deal_title: string;
    business_id: string;
    business_name: string;
  };
};

export async function redeemClaim(code: string, businessId?: string) {
  const { data: sessionData } = await supabase.auth.getSession();
  const token = sessionData.session?.access_token;

  if (!token) {
    throw new Error("AUTH_REQUIRED");
  }

  const response = await fetch(`${API_URL}/claims/redeem`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      code,
      business_id: businessId || null,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.detail || "Could not redeem claim");
  }

  return response.json() as Promise<RedeemClaimResult>;
}

export async function lookupClaim(code: string) {
  const response = await fetch(`${API_URL}/claims/lookup/${encodeURIComponent(code)}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.detail || "Could not find claim");
  }

  return response.json();
}

export type BusinessClaim = {
  id: string;
  code: string | null;
  claim_status: string;
  payment_status: string;
  quantity: number;
  picked_up_at: string | null;
  created_at: string | null;
  deal_id: string;
  deal_title: string;
  deal_price: number;
  pickup_start: string | null;
  pickup_end: string | null;
  business_id: string | null;
  business_name: string;
  business_city: string | null;
  business_address: string | null;
};

