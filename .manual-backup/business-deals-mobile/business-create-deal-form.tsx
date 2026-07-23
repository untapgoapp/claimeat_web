"use client";

import {
  ArrowRight,
  CircleAlert,
  Clock3,
  Euro,
  PackagePlus,
  Save,
  Store,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import {
  createBusinessDeal,
  fetchBusinessStores,
  type BusinessStoreOption,
} from "@/lib/api/business-create";

type DealStatus = "draft" | "available";

const categories = [
  { value: "bakery", label: "Bakery" },
  { value: "fruit_veg", label: "Fruit & veg" },
  { value: "grocery", label: "Grocery" },
  { value: "ready_meal", label: "Ready meal" },
  { value: "family_pack", label: "Family pack" },
  { value: "mystery_bag", label: "Mystery bag" },
];

function toDatetimeLocal(date: Date) {
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 16);
}

function getDefaultPickupStart() {
  const date = new Date();
  date.setMinutes(date.getMinutes() + 60);
  return toDatetimeLocal(date);
}

function getDefaultPickupEnd() {
  const date = new Date();
  date.setHours(date.getHours() + 4);
  return toDatetimeLocal(date);
}

function localDateTimeToISOString(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error("Invalid pickup time.");
  }

  return date.toISOString();
}

export function BusinessCreateDealForm() {
  const router = useRouter();

  const [stores, setStores] = useState<BusinessStoreOption[]>([]);
  const [businessId, setBusinessId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("bakery");
  const [price, setPrice] = useState("2.99");
  const [originalPrice, setOriginalPrice] = useState("8.50");
  const [quantity, setQuantity] = useState("5");
  const [pickupStart, setPickupStart] = useState(getDefaultPickupStart);
  const [pickupEnd, setPickupEnd] = useState(getDefaultPickupEnd);
  const [busy, setBusy] = useState(false);
  const [loadingStores, setLoadingStores] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  const selectedStore = useMemo(() => {
    return stores.find((store) => store.id === businessId) || null;
  }, [stores, businessId]);

  const savings = useMemo(() => {
    const dealPrice = Number(price);
    const beforePrice = Number(originalPrice);

    if (!dealPrice || !beforePrice || beforePrice <= dealPrice) return null;

    return Math.round(((beforePrice - dealPrice) / beforePrice) * 100);
  }, [price, originalPrice]);

  async function loadStores() {
    setLoadingStores(true);
    setMessage(null);

    try {
      const nextStores = await fetchBusinessStores();
      setStores(nextStores);

      if (nextStores[0]) {
        setBusinessId(nextStores[0].id);
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not load stores.");
    } finally {
      setLoadingStores(false);
    }
  }

  useEffect(() => {
    void loadStores();
  }, []);

  async function submitDeal(status: DealStatus) {
    setBusy(true);
    setMessage(null);

    try {
      const numericPrice = Number(price);
      const numericOriginalPrice = originalPrice.trim()
        ? Number(originalPrice)
        : null;
      const numericQuantity = Number(quantity);

      if (!businessId) {
        throw new Error("Choose a store.");
      }

      if (!title.trim()) {
        throw new Error("Add a title.");
      }

      if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
        throw new Error("Add a valid deal price.");
      }

      if (
        numericOriginalPrice !== null &&
        (!Number.isFinite(numericOriginalPrice) ||
          numericOriginalPrice < numericPrice)
      ) {
        throw new Error("Original price should be higher than the deal price.");
      }

      if (!Number.isInteger(numericQuantity) || numericQuantity < 1) {
        throw new Error("Quantity must be at least 1.");
      }

      const created = await createBusinessDeal({
        business_id: businessId,
        title: title.trim(),
        description: description.trim(),
        category,
        price: numericPrice,
        original_price: numericOriginalPrice,
        quantity_total: numericQuantity,
        pickup_start: localDateTimeToISOString(pickupStart),
        pickup_end: localDateTimeToISOString(pickupEnd),
        status,
      });

      if (status === "available") {
        router.push(`/deals/${created.id}`);
      } else {
        router.push("/business/deals");
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not create deal.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-7 pb-16">
      <section className="relative overflow-hidden rounded-[2.25rem] bg-[#6F7D43] p-6 text-white shadow-[0_24px_70px_rgba(95,78,55,0.14)] md:p-8">
        <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[#9baa6a]/30 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-32 w-72 rounded-full bg-[#b76e45]/20 blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-wide text-[#dfe8b6]">
              <PackagePlus size={14} />
              Business
            </p>

            <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-tight md:text-6xl">
              Create a rescue deal
            </h1>

            <p className="mt-3 max-w-2xl text-white/62">
              Publish surplus food, set pickup times and make it available to
              customers instantly.
            </p>
          </div>

          <div className="rounded-[1.5rem] bg-white/10 px-5 py-4 backdrop-blur">
            <p className="text-xs font-black uppercase tracking-wide text-white/45">
              Status
            </p>
            <p className="mt-1 text-2xl font-black">New deal</p>
          </div>
        </div>
      </section>

      {message ? (
        <div className="rounded-[1.5rem] bg-[#fff0ea] p-4 text-[#8a3a20]">
          <div className="flex gap-3">
            <CircleAlert size={22} className="mt-0.5 shrink-0" />
            <p className="font-semibold">{message}</p>
          </div>
        </div>
      ) : null}

      <section className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <div className="rounded-[1.75rem] bg-white p-5 shadow-[0_10px_30px_rgba(95,78,55,0.08)] ring-1 ring-[#DDD2C2] dark:bg-[#241f1a] dark:ring-white/10 md:p-6">
          <div className="grid gap-5">
            <label className="grid gap-2">
              <span className="text-sm font-black uppercase tracking-wide text-black/40 dark:text-white/35">
                Store
              </span>

              <select
                value={businessId}
                onChange={(event) => setBusinessId(event.target.value)}
                disabled={loadingStores || stores.length === 0}
                className="min-h-14 rounded-2xl border border-black/10 bg-[#FBF8F2] px-4 font-semibold outline-none focus:border-[#6f7d43] disabled:opacity-60 dark:border-white/10 dark:bg-[#171411]"
              >
                {stores.map((store) => (
                  <option key={store.id} value={store.id}>
                    {store.name} {store.city ? `· ${store.city}` : ""}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-black uppercase tracking-wide text-black/40 dark:text-white/35">
                Deal title
              </span>

              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Bakery Rescue Bag"
                className="min-h-14 rounded-2xl border border-black/10 bg-[#FBF8F2] px-4 text-lg font-black outline-none focus:border-[#6f7d43] dark:border-white/10 dark:bg-[#171411]"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-black uppercase tracking-wide text-black/40 dark:text-white/35">
                Description
              </span>

              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="A surprise mix of fresh bread, pastries and end-of-day bakery extras."
                rows={5}
                className="rounded-2xl border border-black/10 bg-[#FBF8F2] px-4 py-3 font-semibold leading-6 outline-none focus:border-[#6f7d43] dark:border-white/10 dark:bg-[#171411]"
              />
            </label>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-sm font-black uppercase tracking-wide text-black/40 dark:text-white/35">
                  Category
                </span>

                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className="min-h-14 rounded-2xl border border-black/10 bg-[#FBF8F2] px-4 font-semibold outline-none focus:border-[#6f7d43] dark:border-white/10 dark:bg-[#171411]"
                >
                  {categories.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-black uppercase tracking-wide text-black/40 dark:text-white/35">
                  Quantity
                </span>

                <input
                  value={quantity}
                  onChange={(event) => setQuantity(event.target.value)}
                  inputMode="numeric"
                  className="min-h-14 rounded-2xl border border-black/10 bg-[#FBF8F2] px-4 font-black outline-none focus:border-[#6f7d43] dark:border-white/10 dark:bg-[#171411]"
                />
              </label>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-sm font-black uppercase tracking-wide text-black/40 dark:text-white/35">
                  Deal price
                </span>

                <div className="relative">
                  <Euro
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-black/35 dark:text-white/30"
                  />
                  <input
                    value={price}
                    onChange={(event) => setPrice(event.target.value)}
                    inputMode="decimal"
                    className="min-h-14 w-full rounded-2xl border border-black/10 bg-[#FBF8F2] pl-11 pr-4 text-xl font-black outline-none focus:border-[#6f7d43] dark:border-white/10 dark:bg-[#171411]"
                  />
                </div>
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-black uppercase tracking-wide text-black/40 dark:text-white/35">
                  Original price
                </span>

                <div className="relative">
                  <Euro
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-black/35 dark:text-white/30"
                  />
                  <input
                    value={originalPrice}
                    onChange={(event) => setOriginalPrice(event.target.value)}
                    inputMode="decimal"
                    className="min-h-14 w-full rounded-2xl border border-black/10 bg-[#FBF8F2] pl-11 pr-4 text-xl font-black outline-none focus:border-[#6f7d43] dark:border-white/10 dark:bg-[#171411]"
                  />
                </div>
              </label>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-sm font-black uppercase tracking-wide text-black/40 dark:text-white/35">
                  Pickup starts
                </span>

                <input
                  type="datetime-local"
                  value={pickupStart}
                  onChange={(event) => setPickupStart(event.target.value)}
                  className="min-h-14 rounded-2xl border border-black/10 bg-[#FBF8F2] px-4 font-semibold outline-none focus:border-[#6f7d43] dark:border-white/10 dark:bg-[#171411]"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-black uppercase tracking-wide text-black/40 dark:text-white/35">
                  Pickup ends
                </span>

                <input
                  type="datetime-local"
                  value={pickupEnd}
                  onChange={(event) => setPickupEnd(event.target.value)}
                  className="min-h-14 rounded-2xl border border-black/10 bg-[#FBF8F2] px-4 font-semibold outline-none focus:border-[#6f7d43] dark:border-white/10 dark:bg-[#171411]"
                />
              </label>
            </div>
          </div>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => submitDeal("available")}
              disabled={busy || loadingStores || stores.length === 0}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#6F7D43] px-6 py-4 font-black text-white transition hover:bg-[#556235] disabled:opacity-60 dark:bg-[#9baa6a] dark:text-[#2F261F]"
            >
              Publish deal
              <ArrowRight size={18} />
            </button>

            <button
              type="button"
              onClick={() => submitDeal("draft")}
              disabled={busy || loadingStores || stores.length === 0}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#F4EFE6] px-6 py-4 font-black text-[#6F7D43] transition hover:bg-[#EEF1E3] disabled:opacity-60 dark:bg-[#171411] dark:text-[#E1E9B8]"
            >
              <Save size={18} />
              Save draft
            </button>
          </div>
        </div>

        <aside className="space-y-5">
          <div className="rounded-[1.75rem] bg-white p-5 shadow-[0_10px_30px_rgba(95,78,55,0.08)] ring-1 ring-[#DDD2C2] dark:bg-[#241f1a] dark:ring-white/10 md:p-6">
            <div className="flex items-start gap-3">
              <Store className="mt-1 text-[#6F7D43]" size={22} />
              <div>
                <p className="text-sm font-black uppercase tracking-wide text-black/35 dark:text-white/30">
                  Selected store
                </p>
                <h3 className="mt-1 text-2xl font-black tracking-tight">
                  {selectedStore?.name || "No store selected"}
                </h3>
                <p className="mt-2 text-sm leading-6 text-black/50 dark:text-white/40">
                  {selectedStore
                    ? `${selectedStore.address || "Address not set"} ${
                        selectedStore.city ? `· ${selectedStore.city}` : ""
                      }`
                    : "Connect this user to a business first."}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[1.75rem] bg-[#EEF1E3] p-5 text-[#2F261F] shadow-[0_10px_30px_rgba(95,78,55,0.08)] dark:bg-[#556235] dark:text-white md:p-6">
            <p className="text-sm font-black uppercase tracking-wide opacity-55">
              Preview
            </p>

            <h3 className="mt-3 text-3xl font-black tracking-tight">
              {title.trim() || "Your rescue deal"}
            </h3>

            <p className="mt-3 text-sm leading-6 opacity-65">
              {description.trim() ||
                "Add a short description so customers know what they are claiming."}
            </p>

            <div className="mt-5 grid gap-3">
              <PreviewTile label="Price" value={`€${Number(price || 0).toFixed(2)}`} />
              <PreviewTile
                label="Before"
                value={
                  originalPrice.trim()
                    ? `€${Number(originalPrice || 0).toFixed(2)}`
                    : "Not set"
                }
              />
              <PreviewTile label="Quantity" value={quantity || "0"} />
              <PreviewTile
                label="Savings"
                value={savings !== null ? `${savings}%` : "—"}
              />
            </div>
          </div>

          <div className="rounded-[1.75rem] bg-white p-5 shadow-[0_10px_30px_rgba(95,78,55,0.08)] ring-1 ring-[#DDD2C2] dark:bg-[#241f1a] dark:ring-white/10 md:p-6">
            <div className="flex gap-3">
              <Clock3 className="mt-1 text-[#6F7D43]" size={20} />
              <div>
                <p className="font-black">Pickup window</p>
                <p className="mt-1 text-sm leading-6 text-black/50 dark:text-white/40">
                  Customers can claim the deal immediately, but the food should
                  only be handed over during the pickup window.
                </p>
              </div>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}

function PreviewTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.25rem] bg-white/65 p-4 dark:bg-black/15">
      <p className="text-xs font-black uppercase tracking-wide opacity-45">
        {label}
      </p>
      <p className="mt-1 text-xl font-black">{value}</p>
    </div>
  );
}
