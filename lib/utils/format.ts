import { Deal, DealCategory, MapDeal } from "@/lib/types";

export const categoryLabel: Record<DealCategory, string> = {
  bakery: "Bakery",
  ready_meal: "Ready meal",
  fruit_veg: "Fruit & veg",
  grocery: "Grocery",
  family_pack: "Family pack",
  mystery_bag: "Rescue bag",
};

export const categoryImage: Record<DealCategory, string> = {
  bakery: "/store-types/bakery.png",
  fruit_veg: "/store-types/fruit-veg.png",
  ready_meal: "/store-types/ready-meal.png",
  grocery: "/store-types/grocery.png",
  family_pack: "/store-types/grocery.png",
  mystery_bag: "/store-types/grocery.png",
};

export function formatMoney(value: number) {
  return `€${Number(value).toFixed(2)}`;
}

export function formatTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "TBD";

  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function formatPickupWindow(start: string, end: string) {
  const startDate = new Date(start);
  const endDate = new Date(end);

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return "Pickup TBD";
  }

  const now = new Date();

  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);

  const isToday = startDate.toDateString() === now.toDateString();
  const isTomorrow = startDate.toDateString() === tomorrow.toDateString();

  const dayLabel = isToday
    ? "Today"
    : isTomorrow
      ? "Tomorrow"
      : new Intl.DateTimeFormat("en-GB", {
          month: "short",
          day: "numeric",
        }).format(startDate);

  return `${dayLabel} ${formatTime(start)}-${formatTime(end)}`;
}

export function getSavingPercent(deal: Deal | MapDeal) {
  if (!deal.originalPrice || deal.originalPrice <= deal.price) return 0;

  return Math.round(
    ((deal.originalPrice - deal.price) / deal.originalPrice) * 100
  );
}

export function getSavingAmount(deal: Deal | MapDeal) {
  return Math.max(0, deal.originalPrice - deal.price);
}

export function getDealImage(category: DealCategory) {
  return categoryImage[category] || categoryImage.grocery;
}

export function inferMapCategory(deal: MapDeal): DealCategory {
  const value = `${deal.title} ${deal.description || ""}`.toLowerCase();

  if (
    value.includes("bakery") ||
    value.includes("bread") ||
    value.includes("pastry") ||
    value.includes("croissant") ||
    value.includes("bun")
  ) {
    return "bakery";
  }

  if (
    value.includes("fruit") ||
    value.includes("veg") ||
    value.includes("vegetable") ||
    value.includes("produce")
  ) {
    return "fruit_veg";
  }

  if (
    value.includes("meal") ||
    value.includes("dinner") ||
    value.includes("lunch") ||
    value.includes("salad") ||
    value.includes("wrap") ||
    value.includes("ready")
  ) {
    return "ready_meal";
  }

  if (value.includes("family")) {
    return "family_pack";
  }

  if (
    value.includes("grocery") ||
    value.includes("surprise") ||
    value.includes("market")
  ) {
    return "grocery";
  }

  return "mystery_bag";
}
