export type DealCategory =
  | "bakery"
  | "ready_meal"
  | "fruit_veg"
  | "grocery"
  | "family_pack"
  | "mystery_bag";

export type Deal = {
  id: string;
  businessId: string;
  businessName: string;
  city: string;
  address: string;
  title: string;
  description: string;
  category: DealCategory;
  imageUrl?: string | null;
  price: number;
  originalPrice: number;
  quantityLeft: number;
  pickupStart: string;
  pickupEnd: string;
  status: "available" | "sold_out" | "expired" | "cancelled" | "draft";
};

export type Claim = {
  id: string;
  dealId: string;
  userId: string;
  quantity: number;
  paymentStatus: string;
  claimStatus: string;
  createdAt: string;
  pickupCode: string | null;
  qrCode: string | null;
};

export type MapDeal = {
  id: string;
  title: string;
  description: string | null;
  price: number;
  originalPrice: number;
  quantityLeft: number;
  status: string;
  pickupStart: string;
  pickupEnd: string;
  businessName: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
};

export type MapBusiness = {
  id: string;
  name: string;
  description: string | null;
  address: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  logoUrl: string | null;
  verified: boolean;
  phone: string | null;
  websiteUrl: string | null;
  googleMapsUrl: string | null;
};
