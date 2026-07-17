import { supabase } from "@/lib/supabase/client";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "http://127.0.0.1:8000";

export async function getAuthHeaders() {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  if (!token) {
    throw new Error("AUTH_REQUIRED");
  }

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

export async function readApiError(response: Response, fallback: string) {
  const error = await response.json().catch(() => null);

  if (typeof error?.detail === "string") {
    return error.detail;
  }

  if (Array.isArray(error?.detail)) {
    return error.detail
      .map((item: any) => item?.msg || item?.message || JSON.stringify(item))
      .join(", ");
  }

  return fallback;
}
