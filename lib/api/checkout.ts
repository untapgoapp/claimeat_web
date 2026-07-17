import { API_URL, getAuthHeaders, readApiError } from "@/lib/api/client";

export type CreatePaymentIntentPayload = {
  dealId: string;
  quantity: number;
};

export type CreatePaymentIntentResult = {
  client_secret: string;
  claim_id: string | null;
  reserved_until: string | null;
};

export async function createPaymentIntent(
  data: CreatePaymentIntentPayload
): Promise<CreatePaymentIntentResult> {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/create-payment-intent`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      deal_id: data.dealId,
      quantity: data.quantity,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      await readApiError(response, "Could not create payment intent")
    );
  }

  return response.json();
}
