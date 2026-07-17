// Admin/dev API functions still used by old admin/demo screens.
// These are intentionally separated from the customer/business production flow.

export {
  fetchBusinessClaims,
  fetchClaims,
  collectClaim,
  expireReservations,
  resetDemoData,
  createBusinessDeal,
} from "@/lib/api/legacy";
