import { supabase } from "@/lib/supabase/client";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "http://127.0.0.1:8000";

export type BusinessStoreOption = {
  id: string;
  name: string;
  description: string | null;
  city: string | null;
  address: string | null;
  status: string | null;
  verified: boolean | null;
  logo_url: string | null;
};

export type CreateBusinessDealPayload = {
  business_id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  original_price: number | null;
  quantity_total: number;
  pickup_start: string;
  pickup_end: string;
  status: "draft" | "available";
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

export async function fetchBusinessStores() {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/business/create/stores`, {
    headers,
    cache: "no-store",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.detail || "Could not load your stores");
  }

  return response.json() as Promise<BusinessStoreOption[]>;
}

export async function createBusinessDeal(payload: CreateBusinessDealPayload) {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/business/create/deal`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.detail || "Could not create deal");
  }

  return response.json() as Promise<{ id: string }>;
}
