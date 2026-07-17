import { supabase } from "@/lib/supabase/client";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "http://127.0.0.1:8000";

export type BusinessClaim = {
  id: string;
  code: string | null;
  pickup_code: string | null;
  qr_code: string | null;
  claim_status: string;
  payment_status: string;
  quantity: number;
  total_price: number;
  picked_up_at: string | null;
  collected_at: string | null;
  created_at: string | null;
  deal_id: string;
  deal_title: string;
  deal_description: string | null;
  deal_category: string | null;
  deal_price: number;
  original_price: number;
  pickup_start: string | null;
  pickup_end: string | null;
  business_id: string;
  business_name: string;
  business_city: string | null;
  business_address: string | null;
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

export async function fetchBusinessClaims() {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/claims/business`, {
    headers,
    cache: "no-store",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.detail || "Could not fetch business claims");
  }

  return response.json() as Promise<BusinessClaim[]>;
}
