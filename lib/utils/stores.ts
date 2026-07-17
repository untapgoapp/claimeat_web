import type { DealCategory, MapDeal } from "@/lib/types";
import {
  categoryImage,
  inferMapCategory,
} from "@/lib/utils/format";

export type StoreItem = {
  id: string;
  name: string;
  address: string;
  city: string;
  image: string;
  category: DealCategory;
  activeDeals: number;
  quantityLeft: number;
  priceFrom: number;
  dealIds: string[];
  deals: MapDeal[];
};

export function getStoreIdFromDeal(
  deal: MapDeal & { businessId?: string | null; business_id?: string | null }
) {
  if (deal.businessId) return deal.businessId;
  if (deal.business_id) return deal.business_id;

  return `${deal.businessName}-${deal.address}-${deal.city}`;
}

export function buildStores(mapDeals: MapDeal[]): StoreItem[] {
  const stores = new globalThis.Map<string, StoreItem>();

  for (const deal of mapDeals) {
    const storeId = getStoreIdFromDeal(deal);
    const category = inferMapCategory(deal);

    const current = stores.get(storeId);

    if (!current) {
      stores.set(storeId, {
        id: storeId,
        name: deal.businessName,
        address: deal.address,
        city: deal.city,
        image: categoryImage[category] || categoryImage.grocery,
        category,
        activeDeals: 1,
        quantityLeft: deal.quantityLeft,
        priceFrom: deal.price,
        dealIds: [deal.id],
        deals: [deal],
      });

      continue;
    }

    current.activeDeals += 1;
    current.quantityLeft += deal.quantityLeft;
    current.priceFrom = Math.min(current.priceFrom, deal.price);
    current.dealIds.push(deal.id);
    current.deals.push(deal);

    if (current.category === "mystery_bag" && category !== "mystery_bag") {
      current.category = category;
      current.image = categoryImage[category] || categoryImage.grocery;
    }
  }

  return Array.from(stores.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  );
}

export function findStoreById(mapDeals: MapDeal[], storeId: string) {
  return buildStores(mapDeals).find((store) => store.id === storeId) || null;
}
