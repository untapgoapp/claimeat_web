import { supabase } from "@/lib/supabase/client";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "http://127.0.0.1:8000";

export type BusinessDashboardStore = {
  id: string;
  name: string;
  description: string | null;
  city: string | null;
  address: string | null;
  status: string | null;
  verified: boolean | null;
  logo_url: string | null;
};

export type BusinessDashboardStats = {
  active_deals: number;
  active_pickups: number;
  collected_today: number;
  orders_today: number;
  revenue_today: number;
  platform_fees_today: number;
  business_amount_today: number;
  estimated_unpaid_payout: number;
  total_paid_orders: number;
};

export type BusinessDashboardDeal = {
  id: string;
  business_id: string;
  business_name: string | null;
  business_city: string | null;
  title: string;
  description: string | null;
  category: string | null;
  price: number;
  original_price: number;
  quantity_total: number;
  quantity_left: number;
  pickup_start: string | null;
  pickup_end: string | null;
  status: string;
  created_at: string | null;
  updated_at: string | null;
};

export type BusinessDashboardClaim = {
  id: string;
  deal_id: string;
  business_id: string;
  business_name: string | null;
  deal_title: string | null;
  quantity: number;
  total_price: number;
  platform_fee: number;
  business_amount: number;
  payment_status: string;
  claim_status: string;
  payout_status: string | null;
  pickup_code: string | null;
  code: string | null;
  qr_code: string | null;
  created_at: string | null;
  picked_up_at: string | null;
  collected_at: string | null;
};

export type BusinessDashboard = {
  businesses: BusinessDashboardStore[];
  stats: BusinessDashboardStats;
  active_deals: BusinessDashboardDeal[];
  recent_claims: BusinessDashboardClaim[];
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

export async function fetchBusinessDashboard() {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/business/dashboard`, {
    headers,
    cache: "no-store",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.detail || "Could not load business dashboard");
  }

  return response.json() as Promise<BusinessDashboard>;
}
