import Image from "next/image";

type DealCategoryImageProps = {
  category?: string | null;
  title?: string | null;
  className?: string;
};

const categoryImageMap: Record<string, string> = {
  bakery: "/placeholders/bakery.png",

  fruit_veg: "/placeholders/fruit-veg.png",
  "fruit & veg": "/placeholders/fruit-veg.png",
  fruit: "/placeholders/fruit-veg.png",

  ready_meal: "/placeholders/ready-meals.png",
  ready_meals: "/placeholders/ready-meals.png",
  "ready meal": "/placeholders/ready-meals.png",
  "ready meals": "/placeholders/ready-meals.png",

  grocery: "/placeholders/grocery.png",
  groceries: "/placeholders/grocery.png",

  family: "/placeholders/family.png",
  family_pack: "/placeholders/family.png",
  "family pack": "/placeholders/family.png",

  mystery_bag: "/placeholders/default.png",
  "mystery bag": "/placeholders/default.png",
};

export function getDealCategoryImage(category?: string | null) {
  const normalized = (category || "").toLowerCase().trim();
  return categoryImageMap[normalized] || "/placeholders/default.png";
}

export function DealCategoryImage({
  category,
  title,
  className = "",
}: DealCategoryImageProps) {
  return (
    <div
      className={[
        "relative aspect-[2.25/1] w-full overflow-hidden bg-[#DCC7AA]",
        className,
      ].join(" ")}
    >
      <Image
        src={getDealCategoryImage(category)}
        alt={title || "Deal image"}
        fill
        className="object-cover transition duration-500 group-hover:scale-[1.035]"
        sizes="(max-width: 768px) 100vw, 420px"
        priority={false}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-[#2F261F]/16 via-transparent to-transparent" />
    </div>
  );
}
