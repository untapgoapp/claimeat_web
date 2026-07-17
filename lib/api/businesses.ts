import type { MapBusiness } from "@/lib/types";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.CLAIMEAT_API_URL ||
  "http://localhost:8000"
).replace(/\/$/, "");

type RawMapBusiness = {
  id: string;
  name: string;
  description?: string | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  latitude: number | string | null;
  longitude: number | string | null;
  logo_url?: string | null;
  verified?: boolean | null;
  phone?: string | null;
  website_url?: string | null;
  google_maps_url?: string | null;
};

export async function fetchMapBusinesses(): Promise<MapBusiness[]> {
  const response = await fetch(`${API_URL}/businesses/map`, {
    cache: "no-store",
  });

  if (!response.ok) {
    const body = await response.text();

    throw new Error(
      `Could not load businesses: ${response.status} ${body}`,
    );
  }

  const rows = (await response.json()) as RawMapBusiness[];

  return rows
    .map((row) => ({
      id: row.id,
      name: row.name,
      description: row.description ?? null,
      address: row.address ?? "",
      city: row.city ?? "",
      country: row.country ?? "EE",
      latitude: Number(row.latitude),
      longitude: Number(row.longitude),
      logoUrl: row.logo_url ?? null,
      verified: Boolean(row.verified),
      phone: row.phone ?? null,
      websiteUrl: row.website_url ?? null,
      googleMapsUrl: row.google_maps_url ?? null,
    }))
    .filter(
      (business) =>
        Number.isFinite(business.latitude) &&
        Number.isFinite(business.longitude),
    );
}