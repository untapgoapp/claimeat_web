import {
  fetchBusinessStores,
  type BusinessStoreOption,
} from "@/lib/api/business-create";
import { supabase } from "@/lib/supabase/client";

export type EditableBusinessStore =
  BusinessStoreOption & {
    phone: string | null;
    email: string | null;
    website: string | null;
    image_url: string | null;
    latitude: number | null;
    longitude: number | null;
  };

export type BusinessStoreUpdate = {
  name: string;
  description: string | null;
  address: string | null;
  city: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  logo_url: string | null;
  image_url: string | null;
  latitude: number | null;
  longitude: number | null;
};

function normalizeStore(
  row: Record<string, unknown>,
  fallback: BusinessStoreOption,
): EditableBusinessStore {
  return {
    id: String(row.id || fallback.id),
    name: String(
      row.name || fallback.name,
    ),
    description:
      typeof row.description === "string"
        ? row.description
        : fallback.description,
    city:
      typeof row.city === "string"
        ? row.city
        : fallback.city,
    address:
      typeof row.address === "string"
        ? row.address
        : fallback.address,
    status:
      typeof row.status === "string"
        ? row.status
        : fallback.status,
    verified:
      typeof row.verified === "boolean"
        ? row.verified
        : fallback.verified,
    logo_url:
      typeof row.logo_url === "string"
        ? row.logo_url
        : fallback.logo_url,
    image_url:
      typeof row.image_url === "string"
        ? row.image_url
        : null,
    phone:
      typeof row.phone === "string"
        ? row.phone
        : null,
    email:
      typeof row.email === "string"
        ? row.email
        : null,
    website:
      typeof row.website === "string"
        ? row.website
        : null,
    latitude:
      typeof row.latitude === "number"
        ? row.latitude
        : null,
    longitude:
      typeof row.longitude === "number"
        ? row.longitude
        : null,
  };
}

export async function fetchEditableBusinessStores() {
  const allowedStores =
    await fetchBusinessStores();

  if (allowedStores.length === 0) {
    return [];
  }

  const ids = allowedStores.map(
    (store) => store.id,
  );

  const { data, error } =
    await supabase
      .from("businesses")
      .select("*")
      .in("id", ids);

  if (error) {
    return allowedStores.map(
      (store) =>
        normalizeStore({}, store),
    );
  }

  const rowsById = new Map(
    (data || []).map((row) => [
      String(row.id),
      row as Record<string, unknown>,
    ]),
  );

  return allowedStores.map((store) =>
    normalizeStore(
      rowsById.get(store.id) || {},
      store,
    ),
  );
}

export async function updateEditableBusinessStore(
  store: EditableBusinessStore,
  payload: BusinessStoreUpdate,
) {
  const { data, error } =
    await supabase
      .from("businesses")
      .update(payload)
      .eq("id", store.id)
      .select("*")
      .single();

  if (error) {
    throw new Error(
      error.message ||
        "Could not update store.",
    );
  }

  return normalizeStore(
    data as Record<string, unknown>,
    store,
  );
}
