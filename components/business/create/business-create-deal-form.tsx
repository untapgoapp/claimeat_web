"use client";

import {
  CircleAlert,
  Clock3,
  Euro,
  PackagePlus,
  Save,
  Store,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";

import {
  createBusinessDeal,
  fetchBusinessStores,
  type BusinessStoreOption,
} from "@/lib/api/business-create";
import { formatMoney } from "@/lib/utils/format";

type DealStatus =
  | "draft"
  | "available";

const categories = [
  { value: "bakery", label: "Bakery" },
  {
    value: "fruit_veg",
    label: "Fruit & veg",
  },
  { value: "grocery", label: "Grocery" },
  {
    value: "ready_meal",
    label: "Ready meal",
  },
  {
    value: "family_pack",
    label: "Family pack",
  },
  {
    value: "mystery_bag",
    label: "Mystery bag",
  },
];

const fieldClass =
  "min-h-12 w-full min-w-0 rounded-xl border border-black/10 bg-[#F8F5EE] px-3 text-base outline-none focus:border-[#6F7D43] disabled:opacity-50";

function toDatetimeLocal(date: Date) {
  const offset =
    date.getTimezoneOffset();

  return new Date(
    date.getTime() -
      offset * 60 * 1000,
  )
    .toISOString()
    .slice(0, 16);
}

function getDefaultPickupStart() {
  const date = new Date();

  date.setMinutes(
    date.getMinutes() + 60,
  );

  return toDatetimeLocal(date);
}

function getDefaultPickupEnd() {
  const date = new Date();

  date.setHours(
    date.getHours() + 4,
  );

  return toDatetimeLocal(date);
}

function localDateTimeToISOString(
  value: string,
) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error(
      "Enter a valid pickup time.",
    );
  }

  return date.toISOString();
}

export function BusinessCreateDealForm() {
  const router = useRouter();

  const [stores, setStores] = useState<
    BusinessStoreOption[]
  >([]);

  const [businessId, setBusinessId] =
    useState("");

  const [title, setTitle] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [category, setCategory] =
    useState("bakery");

  const [price, setPrice] =
    useState("2.99");

  const [
    originalPrice,
    setOriginalPrice,
  ] = useState("8.50");

  const [quantity, setQuantity] =
    useState("5");

  const [
    pickupStart,
    setPickupStart,
  ] = useState(getDefaultPickupStart);

  const [pickupEnd, setPickupEnd] =
    useState(getDefaultPickupEnd);

  const [busy, setBusy] =
    useState(false);

  const [
    loadingStores,
    setLoadingStores,
  ] = useState(true);

  const [message, setMessage] =
    useState<string | null>(null);

  const selectedStore = useMemo(
    () =>
      stores.find(
        (store) =>
          store.id === businessId,
      ) || null,
    [stores, businessId],
  );

  const savings = useMemo(() => {
    const dealPrice = Number(price);

    const beforePrice =
      Number(originalPrice);

    if (
      !dealPrice ||
      !beforePrice ||
      beforePrice <= dealPrice
    ) {
      return null;
    }

    return Math.round(
      ((beforePrice - dealPrice) /
        beforePrice) *
        100,
    );
  }, [price, originalPrice]);

  async function loadStores() {
    setLoadingStores(true);
    setMessage(null);

    try {
      const nextStores =
        await fetchBusinessStores();

      setStores(nextStores);

      if (nextStores[0]) {
        setBusinessId(
          nextStores[0].id,
        );
      }
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Could not load stores.",
      );
    } finally {
      setLoadingStores(false);
    }
  }

  useEffect(() => {
    void loadStores();
  }, []);

  async function submitDeal(
    status: DealStatus,
  ) {
    setBusy(true);
    setMessage(null);

    try {
      const numericPrice =
        Number(price);

      const numericOriginalPrice =
        originalPrice.trim()
          ? Number(originalPrice)
          : null;

      const numericQuantity =
        Number(quantity);

      if (!businessId) {
        throw new Error(
          "Choose a store.",
        );
      }

      if (!title.trim()) {
        throw new Error(
          "Add a deal title.",
        );
      }

      if (
        !Number.isFinite(
          numericPrice,
        ) ||
        numericPrice <= 0
      ) {
        throw new Error(
          "Add a valid deal price.",
        );
      }

      if (
        numericOriginalPrice !== null &&
        (!Number.isFinite(
          numericOriginalPrice,
        ) ||
          numericOriginalPrice <
            numericPrice)
      ) {
        throw new Error(
          "Original price must be at least the deal price.",
        );
      }

      if (
        !Number.isInteger(
          numericQuantity,
        ) ||
        numericQuantity < 1
      ) {
        throw new Error(
          "Quantity must be at least 1.",
        );
      }

      const pickupStartDate =
        new Date(pickupStart);

      const pickupEndDate =
        new Date(pickupEnd);

      if (
        Number.isNaN(
          pickupStartDate.getTime(),
        ) ||
        Number.isNaN(
          pickupEndDate.getTime(),
        )
      ) {
        throw new Error(
          "Enter valid pickup times.",
        );
      }

      if (
        pickupEndDate.getTime() <=
        pickupStartDate.getTime()
      ) {
        throw new Error(
          "Pickup end must be after pickup start.",
        );
      }

      await createBusinessDeal({
        business_id: businessId,
        title: title.trim(),
        description:
          description.trim(),
        category,
        price: numericPrice,
        original_price:
          numericOriginalPrice,
        quantity_total:
          numericQuantity,
        pickup_start:
          localDateTimeToISOString(
            pickupStart,
          ),
        pickup_end:
          localDateTimeToISOString(
            pickupEnd,
          ),
        status,
      });

      router.replace(
        "/business/deals",
      );

      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Could not create deal.",
      );
    } finally {
      setBusy(false);
    }
  }

  function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    void submitDeal("available");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="pb-2"
    >
      {message ? (
        <div className="mb-4 flex gap-3 rounded-xl bg-[#FFF0EA] p-4 text-[#8A3A20]">
          <CircleAlert
            size={20}
            className="shrink-0"
            aria-hidden="true"
          />

          <p className="text-sm font-semibold">
            {message}
          </p>
        </div>
      ) : null}

      <div className="space-y-4">
        <FormSection
          title="Store"
          icon={
            <Store
              size={19}
              aria-hidden="true"
            />
          }
        >
          {loadingStores ? (
            <div className="h-12 animate-pulse rounded-xl bg-black/[0.06]" />
          ) : stores.length === 0 ? (
            <div className="rounded-xl bg-[#FFF0EA] p-4 text-sm font-semibold text-[#8A3A20]">
              This account is not connected
              to a store.
            </div>
          ) : (
            <>
              <Field label="Publishing from">
                <select
                  value={businessId}
                  onChange={(event) =>
                    setBusinessId(
                      event.target.value,
                    )
                  }
                  className={fieldClass}
                >
                  {stores.map((store) => (
                    <option
                      key={store.id}
                      value={store.id}
                    >
                      {store.name}
                      {store.city
                        ? ` · ${store.city}`
                        : ""}
                    </option>
                  ))}
                </select>
              </Field>

              {selectedStore ? (
                <div className="rounded-xl bg-[#E9EDDD] px-3 py-2.5">
                  <p className="text-sm font-black text-[#18392B]">
                    {selectedStore.name}
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#18392B]/60">
                    {[
                      selectedStore.address,
                      selectedStore.city,
                    ]
                      .filter(Boolean)
                      .join(", ") ||
                      "Address not added"}
                  </p>
                </div>
              ) : null}
            </>
          )}
        </FormSection>

        <FormSection
          title="Food details"
          icon={
            <PackagePlus
              size={19}
              aria-hidden="true"
            />
          }
        >
          <Field label="Deal title">
            <input
              value={title}
              onChange={(event) =>
                setTitle(
                  event.target.value,
                )
              }
              placeholder="Bakery Rescue Bag"
              maxLength={90}
              className={`${fieldClass} font-bold`}
            />
          </Field>

          <Field label="Description">
            <textarea
              value={description}
              onChange={(event) =>
                setDescription(
                  event.target.value,
                )
              }
              placeholder="What might customers receive?"
              rows={4}
              maxLength={500}
              className={`${fieldClass} py-3 leading-5`}
            />
          </Field>

          <Field label="Category">
            <select
              value={category}
              onChange={(event) =>
                setCategory(
                  event.target.value,
                )
              }
              className={fieldClass}
            >
              {categories.map((item) => (
                <option
                  key={item.value}
                  value={item.value}
                >
                  {item.label}
                </option>
              ))}
            </select>
          </Field>
        </FormSection>

        <FormSection
          title="Price and quantity"
          icon={
            <Euro
              size={19}
              aria-hidden="true"
            />
          }
        >
          <div className="grid grid-cols-2 gap-3">
            <Field label="Deal price">
              <input
                value={price}
                onChange={(event) =>
                  setPrice(
                    event.target.value,
                  )
                }
                type="number"
                inputMode="decimal"
                step="0.01"
                min="0"
                className={`${fieldClass} font-black`}
              />
            </Field>

            <Field label="Original price">
              <input
                value={originalPrice}
                onChange={(event) =>
                  setOriginalPrice(
                    event.target.value,
                  )
                }
                type="number"
                inputMode="decimal"
                step="0.01"
                min="0"
                className={`${fieldClass} font-black`}
              />
            </Field>
          </div>

          <Field label="Number of bags">
            <input
              value={quantity}
              onChange={(event) =>
                setQuantity(
                  event.target.value,
                )
              }
              type="number"
              inputMode="numeric"
              min="1"
              step="1"
              className={`${fieldClass} font-black`}
            />
          </Field>
        </FormSection>

        <FormSection
          title="Pickup window"
          icon={
            <Clock3
              size={19}
              aria-hidden="true"
            />
          }
        >
          <Field label="Pickup starts">
            <input
              type="datetime-local"
              value={pickupStart}
              onChange={(event) =>
                setPickupStart(
                  event.target.value,
                )
              }
              className={fieldClass}
            />
          </Field>

          <Field label="Pickup ends">
            <input
              type="datetime-local"
              value={pickupEnd}
              onChange={(event) =>
                setPickupEnd(
                  event.target.value,
                )
              }
              className={fieldClass}
            />
          </Field>
        </FormSection>

        <section className="rounded-[1.4rem] bg-[#18392B] p-4 text-white">
          <p className="text-[10px] font-black uppercase tracking-[0.1em] text-white/45">
            Customer preview
          </p>

          <div className="mt-3 flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h2 className="line-clamp-2 text-lg font-black leading-5">
                {title.trim() ||
                  "Your rescue deal"}
              </h2>

              <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-white/55">
                {description.trim() ||
                  "Add a description for customers."}
              </p>
            </div>

            <div className="shrink-0 text-right">
              <p className="text-xl font-black">
                {Number.isFinite(
                  Number(price),
                )
                  ? formatMoney(
                      Number(price),
                    )
                  : "€0.00"}
              </p>

              {originalPrice ? (
                <p className="mt-0.5 text-xs text-white/40 line-through">
                  {formatMoney(
                    Number(
                      originalPrice,
                    ) || 0,
                  )}
                </p>
              ) : null}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <PreviewPill>
              {quantity || "0"} available
            </PreviewPill>

            <PreviewPill>
              {savings !== null
                ? `${savings}% saving`
                : "No saving calculated"}
            </PreviewPill>

            <PreviewPill>
              {selectedStore?.name ||
                "No store"}
            </PreviewPill>
          </div>
        </section>
      </div>

      <footer
        className="sticky bottom-0 z-20 -mx-4 mt-5 grid grid-cols-[0.8fr_1.2fr] gap-2 border-t border-black/[0.07] bg-[#F5F2EB]/96 px-4 py-3 backdrop-blur"
        style={{
          paddingBottom:
            "max(12px, env(safe-area-inset-bottom))",
        }}
      >
        <button
          type="button"
          onClick={() =>
            void submitDeal("draft")
          }
          disabled={
            busy ||
            loadingStores ||
            stores.length === 0
          }
          className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-black/[0.06] text-sm font-black text-black/55 disabled:opacity-50"
        >
          <Save
            size={17}
            aria-hidden="true"
          />

          Save draft
        </button>

        <button
          type="submit"
          disabled={
            busy ||
            loadingStores ||
            stores.length === 0
          }
          className="min-h-12 rounded-xl bg-[#18392B] text-sm font-black text-white disabled:opacity-50"
        >
          {busy
            ? "Publishing…"
            : "Publish deal"}
        </button>
      </footer>
    </form>
  );
}

function FormSection({
  title,
  icon,
  children,
}: {
  title: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="space-y-4 rounded-[1.4rem] border border-black/[0.07] bg-white p-4">
      <header className="flex items-center gap-2 text-[#18392B]">
        {icon}

        <h2 className="text-base font-black">
          {title}
        </h2>
      </header>

      {children}
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="grid min-w-0 gap-1.5">
      <span className="text-[11px] font-black uppercase tracking-[0.06em] text-black/40">
        {label}
      </span>

      {children}
    </label>
  );
}

function PreviewPill({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <span className="rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-black uppercase text-white/70">
      {children}
    </span>
  );
}
