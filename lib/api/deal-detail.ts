const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "http://127.0.0.1:8000"
).replace(/\/$/, "");

export type DealBusinessDetail = {
  id: string;
  name: string;
  description: string | null;

  address: string | null;
  address_text: string | null;
  formatted_address: string | null;

  city: string | null;
  country: string | null;

  latitude: number | null;
  longitude: number | null;

  logo_url: string | null;
  verified: boolean | null;
  status: string | null;

  phone: string | null;
  website_url: string | null;
  google_maps_url: string | null;

  opening_hours:
    | string[]
    | {
        weekday_text?: string[];
        open_now?: boolean;
        periods?: unknown[];
      }
    | null;
};

export type DealDetail = {
  id: string;
  business_id: string;

  title: string;
  description: string | null;
  category: string | null;
  image_url: string | null;

  price: number;
  original_price: number | null;

  quantity_total: number;
  quantity_left: number;

  pickup_start: string | null;
  pickup_end: string | null;

  status: string;

  created_at: string | null;
  updated_at: string | null;
  closed_at: string | null;

  business: DealBusinessDetail;
};

export async function fetchDealDetail(
  id: string,
): Promise<DealDetail | null> {
  const response = await fetch(
    `${API_URL}/deals/${encodeURIComponent(id)}/detail`,
    {
      cache: "no-store",
    },
  );

  if (!response.ok) {
    return null;
  }

  return (await response.json()) as DealDetail;
}