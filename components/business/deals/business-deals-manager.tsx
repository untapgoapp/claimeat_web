"use client";

import Link from "next/link";
import {
  CircleAlert,
  Clock3,
  Eye,
  Lock,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
  X,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";

import {
  closeManagedBusinessDeal,
  deleteManagedBusinessDeal,
  fetchManagedBusinessDeals,
  updateManagedBusinessDeal,
  type ManagedBusinessDeal,
} from "@/lib/api/business-deals";
import { formatMoney } from "@/lib/utils/format";

type DealFilter =
  | "all"
  | "available"
  | "draft"
  | "sold_out"
  | "expired";

const filters: {
  value: DealFilter;
  label: string;
}[] = [
  { value: "available", label: "Live" },
  { value: "draft", label: "Drafts" },
  { value: "sold_out", label: "Closed" },
  { value: "expired", label: "Expired" },
  { value: "all", label: "All" },
];

const categories = [
  { value: "bakery", label: "Bakery" },
  {
    value: "fruit_veg",
    label: "Fruit & veg",
  },
  {
    value: "ready_meal",
    label: "Ready meal",
  },
  { value: "grocery", label: "Grocery" },
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
  "min-h-12 w-full min-w-0 rounded-xl border border-black/10 bg-white px-3 text-base outline-none focus:border-[#6F7D43] disabled:bg-black/[0.04] disabled:text-black/40";

function toDatetimeLocal(
  value: string | null,
) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const offset =
    date.getTimezoneOffset();

  return new Date(
    date.getTime() -
      offset * 60 * 1000,
  )
    .toISOString()
    .slice(0, 16);
}

function fromDatetimeLocal(
  value: string,
) {
  if (!value) return null;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error(
      "Enter a valid pickup time.",
    );
  }

  return date.toISOString();
}

function formatPickup(
  value: string | null,
) {
  if (!value) return "TBD";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "TBD";
  }

  return new Intl.DateTimeFormat(
    "en-GB",
    {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    },
  ).format(date);
}

function formatPickupRange(
  deal: ManagedBusinessDeal,
) {
  if (
    !deal.pickupStart ||
    !deal.pickupEnd
  ) {
    return "Pickup time not set";
  }

  return `${formatPickup(
    deal.pickupStart,
  )} – ${formatPickup(deal.pickupEnd)}`;
}

function useModalBodyLock() {
  useEffect(() => {
    const previous =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    return () => {
      document.body.style.overflow =
        previous;
    };
  }, []);
}

export function BusinessDealsManager() {
  const [deals, setDeals] = useState<
    ManagedBusinessDeal[]
  >([]);

  const [filter, setFilter] =
    useState<DealFilter>("available");

  const [editingDeal, setEditingDeal] =
    useState<ManagedBusinessDeal | null>(
      null,
    );

  const [deleteDeal, setDeleteDeal] =
    useState<ManagedBusinessDeal | null>(
      null,
    );

  const [busy, setBusy] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [message, setMessage] =
    useState<string | null>(null);

  const filteredDeals = useMemo(() => {
    if (filter === "all") {
      return deals;
    }

    return deals.filter(
      (deal) => deal.status === filter,
    );
  }, [deals, filter]);

  const stats = useMemo(
    () => ({
      total: deals.length,

      available: deals.filter(
        (deal) =>
          deal.status === "available",
      ).length,

      drafts: deals.filter(
        (deal) =>
          deal.status === "draft",
      ).length,

      claimed: deals.filter(
        (deal) => deal.hasClaims,
      ).length,
    }),
    [deals],
  );

  async function loadDeals() {
    setLoading(true);
    setMessage(null);

    try {
      const nextDeals =
        await fetchManagedBusinessDeals();

      setDeals(nextDeals);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Could not load deals.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadDeals();
  }, []);

  async function handleCloseDeal(
    deal: ManagedBusinessDeal,
  ) {
    setBusy(true);
    setMessage(null);

    try {
      const updated =
        await closeManagedBusinessDeal(
          deal.id,
        );

      setDeals((current) =>
        current.map((item) =>
          item.id === updated.id
            ? updated
            : item,
        ),
      );
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Could not close deal.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function handleDeleteDeal() {
    if (!deleteDeal) return;

    setBusy(true);
    setMessage(null);

    try {
      await deleteManagedBusinessDeal(
        deleteDeal.id,
      );

      setDeals((current) =>
        current.filter(
          (deal) =>
            deal.id !== deleteDeal.id,
        ),
      );

      setDeleteDeal(null);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Could not delete deal.",
      );
    } finally {
      setBusy(false);
    }
  }

  function updateDealInState(
    updated: ManagedBusinessDeal,
  ) {
    setDeals((current) =>
      current.map((deal) =>
        deal.id === updated.id
          ? updated
          : deal,
      ),
    );
  }

  return (
    <section className="business-mobile-page">
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.12em] text-[#6F7D43]">
            Inventory
          </p>

          <h1 className="mt-2 text-[2rem] font-black leading-none tracking-[-0.045em]">
            Deals
          </h1>

          <p className="mt-2 text-sm leading-5 text-black/45">
            Publish, edit and close your
            rescue offers.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            void loadDeals()
          }
          disabled={loading || busy}
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-black/[0.07] bg-white text-[#18392B] shadow-sm disabled:opacity-50"
          aria-label="Refresh deals"
        >
          <RefreshCw
            size={19}
            className={
              loading ? "animate-spin" : ""
            }
            aria-hidden="true"
          />
        </button>
      </header>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <StatCard
          label="Live"
          value={String(stats.available)}
        />

        <StatCard
          label="Drafts"
          value={String(stats.drafts)}
        />

        <StatCard
          label="With claims"
          value={String(stats.claimed)}
        />

        <StatCard
          label="Total"
          value={String(stats.total)}
        />
      </div>

      <Link
        href="/business/deals/new"
        className="mt-4 flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-[#18392B] px-6 text-base font-black text-white shadow-[0_10px_26px_rgba(24,57,43,0.18)]"
      >
        <Plus
          size={20}
          strokeWidth={2.7}
          aria-hidden="true"
        />

        Create new deal
      </Link>

      <div className="-mx-4 mt-5 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {filters.map((item) => {
          const active =
            filter === item.value;

          return (
            <button
              key={item.value}
              type="button"
              onClick={() =>
                setFilter(item.value)
              }
              className={[
                "min-h-9 shrink-0 rounded-full px-4 text-xs font-black",
                active
                  ? "bg-[#18392B] text-white"
                  : "border border-black/[0.07] bg-white text-black/50",
              ].join(" ")}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {message ? (
        <div className="mt-4 flex gap-3 rounded-xl bg-[#FFF0EA] p-4 text-[#8A3A20]">
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

      <div className="mt-4 space-y-3">
        {loading ? (
          <DealsLoading />
        ) : filteredDeals.length === 0 ? (
          <div className="rounded-[1.5rem] border border-black/[0.07] bg-white px-5 py-10 text-center">
            <p className="text-lg font-black">
              No deals here
            </p>

            <p className="mt-2 text-sm text-black/45">
              Try another filter or create
              a new deal.
            </p>
          </div>
        ) : (
          filteredDeals.map((deal) => (
            <DealManagementCard
              key={deal.id}
              deal={deal}
              busy={busy}
              onEdit={() =>
                setEditingDeal(deal)
              }
              onClose={() =>
                void handleCloseDeal(deal)
              }
              onDelete={() =>
                setDeleteDeal(deal)
              }
            />
          ))
        )}
      </div>

      {editingDeal ? (
        <EditDealModal
          deal={editingDeal}
          onClose={() =>
            setEditingDeal(null)
          }
          onUpdated={(updated) => {
            updateDealInState(updated);
            setEditingDeal(null);
          }}
        />
      ) : null}

      {deleteDeal ? (
        <DeleteDealModal
          deal={deleteDeal}
          busy={busy}
          onClose={() =>
            setDeleteDeal(null)
          }
          onConfirm={() =>
            void handleDeleteDeal()
          }
        />
      ) : null}
    </section>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <article className="min-h-[84px] rounded-[1.25rem] border border-black/[0.07] bg-white p-3.5">
      <p className="text-[10px] font-black uppercase tracking-[0.08em] text-black/35">
        {label}
      </p>

      <p className="mt-2 text-xl font-black tracking-[-0.035em] text-[#18392B]">
        {value}
      </p>
    </article>
  );
}

function DealManagementCard({
  deal,
  busy,
  onEdit,
  onClose,
  onDelete,
}: {
  deal: ManagedBusinessDeal;
  busy: boolean;
  onEdit: () => void;
  onClose: () => void;
  onDelete: () => void;
}) {
  const canClose = [
    "available",
    "draft",
  ].includes(deal.status);

  return (
    <article className="overflow-hidden rounded-[1.4rem] border border-black/[0.07] bg-white">
      <div className="p-4">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge
            status={deal.status}
          />

          {deal.hasClaims ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#FFF0C7] px-2.5 py-1 text-[10px] font-black uppercase text-[#715914]">
              <Lock
                size={12}
                aria-hidden="true"
              />

              {deal.claimCount} claim
              {deal.claimCount === 1
                ? ""
                : "s"}
            </span>
          ) : (
            <span className="rounded-full bg-[#E4EAD7] px-2.5 py-1 text-[10px] font-black uppercase text-[#36562B]">
              No claims
            </span>
          )}
        </div>

        <div className="mt-3 flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h2 className="line-clamp-2 text-lg font-black leading-5 tracking-[-0.025em]">
              {deal.title}
            </h2>

            <p className="mt-1.5 line-clamp-2 text-sm leading-5 text-black/45">
              {deal.description ||
                "No description"}
            </p>
          </div>

          <p className="shrink-0 text-lg font-black text-[#18392B]">
            {formatMoney(deal.price)}
          </p>
        </div>

        <div className="mt-3 rounded-xl bg-[#F3F0E8] px-3 py-2.5">
          <p className="flex items-start gap-2 text-xs leading-5 text-black/50">
            <Clock3
              size={14}
              className="mt-0.5 shrink-0 text-[#6F7D43]"
              aria-hidden="true"
            />

            <span>
              {formatPickupRange(deal)}
            </span>
          </p>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3 text-xs text-black/45">
          <span>
            <strong className="text-black/70">
              {deal.quantityLeft}
            </strong>{" "}
            remaining
          </span>

          <span>
            {deal.paidClaimCount} paid ·{" "}
            {deal.pickedUpCount} collected
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 border-t border-black/[0.07] p-3">
        <Link
          href={`/deals/${deal.id}`}
          className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#F3F0E8] text-sm font-black text-[#18392B]"
        >
          <Eye
            size={16}
            aria-hidden="true"
          />

          Preview
        </Link>

        <button
          type="button"
          onClick={onEdit}
          className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#E9EDDD] text-sm font-black text-[#18392B]"
        >
          <Pencil
            size={16}
            aria-hidden="true"
          />

          Edit
        </button>

        <button
          type="button"
          onClick={onClose}
          disabled={busy || !canClose}
          className="min-h-11 rounded-xl border border-[#18392B]/15 bg-white px-3 text-sm font-black text-[#18392B] disabled:border-black/[0.05] disabled:bg-black/[0.03] disabled:text-black/30"
        >
          {canClose
            ? "Close deal"
            : "Closed"}
        </button>

        <button
          type="button"
          onClick={onDelete}
          disabled={busy}
          className={[
            "flex min-h-11 items-center justify-center gap-2 rounded-xl px-3 text-sm font-black",
            deal.canDelete
              ? "bg-[#FFF0EA] text-[#8A3A20]"
              : "bg-black/[0.035] text-black/30",
          ].join(" ")}
        >
          {deal.canDelete ? (
            <Trash2
              size={16}
              aria-hidden="true"
            />
          ) : (
            <Lock
              size={15}
              aria-hidden="true"
            />
          )}

          Delete
        </button>
      </div>
    </article>
  );
}

function StatusBadge({
  status,
}: {
  status: string;
}) {
  const styles: Record<
    string,
    string
  > = {
    available:
      "bg-[#E4EAD7] text-[#36562B]",

    draft:
      "bg-black/[0.06] text-black/50",

    sold_out:
      "bg-[#EAE4D9] text-[#6F5F4B]",

    closed:
      "bg-[#EAE4D9] text-[#6F5F4B]",

    expired:
      "bg-[#F2E4DE] text-[#8A3A20]",

    cancelled:
      "bg-[#F2E4DE] text-[#8A3A20]",
  };

  const labels: Record<
    string,
    string
  > = {
    available: "Live",
    draft: "Draft",
    sold_out: "Closed",
    closed: "Closed",
    expired: "Expired",
    cancelled: "Cancelled",
  };

  return (
    <span
      className={[
        "rounded-full px-2.5 py-1 text-[10px] font-black uppercase",
        styles[status] ||
          styles.draft,
      ].join(" ")}
    >
      {labels[status] ||
        status.replaceAll("_", " ")}
    </span>
  );
}

function EditDealModal({
  deal,
  onClose,
  onUpdated,
}: {
  deal: ManagedBusinessDeal;
  onClose: () => void;
  onUpdated: (
    deal: ManagedBusinessDeal,
  ) => void;
}) {
  useModalBodyLock();

  const [title, setTitle] =
    useState(deal.title || "");

  const [description, setDescription] =
    useState(deal.description || "");

  const [category, setCategory] =
    useState(
      deal.category || "mystery_bag",
    );

  const [price, setPrice] =
    useState(String(deal.price || ""));

  const [
    originalPrice,
    setOriginalPrice,
  ] = useState(
    String(deal.originalPrice || ""),
  );

  const [
    quantityLeft,
    setQuantityLeft,
  ] = useState(
    String(deal.quantityLeft ?? 0),
  );

  const [
    pickupStart,
    setPickupStart,
  ] = useState(
    toDatetimeLocal(deal.pickupStart),
  );

  const [pickupEnd, setPickupEnd] =
    useState(
      toDatetimeLocal(deal.pickupEnd),
    );

  const [status, setStatus] =
    useState(
      deal.status || "available",
    );

  const [busy, setBusy] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const locked = !deal.canEditFully;

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    setBusy(true);
    setError(null);

    try {
      if (!title.trim()) {
        throw new Error(
          "Add a deal title.",
        );
      }

      if (!locked) {
        const nextPrice = Number(price);

        const nextOriginalPrice =
          Number(originalPrice);

        const nextQuantity =
          Number(quantityLeft);

        if (
          !Number.isFinite(nextPrice) ||
          nextPrice <= 0
        ) {
          throw new Error(
            "Enter a valid price.",
          );
        }

        if (
          !Number.isFinite(
            nextOriginalPrice,
          ) ||
          nextOriginalPrice < nextPrice
        ) {
          throw new Error(
            "Original price must be at least the deal price.",
          );
        }

        if (
          !Number.isInteger(
            nextQuantity,
          ) ||
          nextQuantity < 0
        ) {
          throw new Error(
            "Quantity cannot be negative.",
          );
        }

        if (
          pickupStart &&
          pickupEnd &&
          new Date(pickupEnd).getTime() <=
            new Date(
              pickupStart,
            ).getTime()
        ) {
          throw new Error(
            "Pickup end must be after pickup start.",
          );
        }
      }

      const payload = locked
        ? {
            title: title.trim(),
            description:
              description.trim(),
            status,
          }
        : {
            title: title.trim(),
            description:
              description.trim(),
            category,
            price: Number(price),
            original_price: Number(
              originalPrice,
            ),
            quantity_left: Number(
              quantityLeft,
            ),
            pickup_start:
              fromDatetimeLocal(
                pickupStart,
              ),
            pickup_end:
              fromDatetimeLocal(
                pickupEnd,
              ),
            status,
          };

      const updated =
        await updateManagedBusinessDeal(
          deal.id,
          payload,
        );

      onUpdated(updated);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Could not update deal.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[2147483500] overflow-y-auto bg-[#F5F2EB]">
      <form
        onSubmit={handleSubmit}
        className="mx-auto flex min-h-[100dvh] w-full max-w-xl flex-col"
      >
        <header
          className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-black/[0.07] bg-[#F5F2EB]/95 px-4 py-3 backdrop-blur"
          style={{
            paddingTop:
              "max(12px, env(safe-area-inset-top))",
          }}
        >
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-[0.1em] text-[#6F7D43]">
              Edit deal
            </p>

            <h1 className="mt-1 truncate text-xl font-black">
              {deal.title}
            </h1>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-black/[0.06]"
            aria-label="Close editor"
          >
            <X
              size={19}
              aria-hidden="true"
            />
          </button>
        </header>

        <div className="flex-1 space-y-4 px-4 py-5">
          {locked ? (
            <div className="flex gap-3 rounded-xl bg-[#FFF0C7] p-4 text-[#715914]">
              <Lock
                size={20}
                className="shrink-0"
                aria-hidden="true"
              />

              <p className="text-sm leading-5">
                Customers have already
                claimed this deal. Price,
                quantity, category and
                pickup times are locked.
              </p>
            </div>
          ) : null}

          <FormSection title="Food details">
            <Field label="Title">
              <input
                value={title}
                onChange={(event) =>
                  setTitle(
                    event.target.value,
                  )
                }
                required
                className={fieldClass}
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
                rows={4}
                className={`${fieldClass} py-3`}
              />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Category">
                <select
                  value={category}
                  onChange={(event) =>
                    setCategory(
                      event.target.value,
                    )
                  }
                  disabled={locked}
                  className={fieldClass}
                >
                  {categories.map(
                    (item) => (
                      <option
                        key={item.value}
                        value={item.value}
                      >
                        {item.label}
                      </option>
                    ),
                  )}
                </select>
              </Field>

              <Field label="Status">
                <select
                  value={status}
                  onChange={(event) =>
                    setStatus(
                      event.target.value,
                    )
                  }
                  className={fieldClass}
                >
                  <option value="draft">
                    Draft
                  </option>

                  <option value="available">
                    Live
                  </option>

                  <option value="sold_out">
                    Closed
                  </option>

                  <option value="expired">
                    Expired
                  </option>

                  <option value="cancelled">
                    Cancelled
                  </option>
                </select>
              </Field>
            </div>
          </FormSection>

          <FormSection title="Price and quantity">
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
                  step="0.01"
                  min="0"
                  disabled={locked}
                  className={fieldClass}
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
                  step="0.01"
                  min="0"
                  disabled={locked}
                  className={fieldClass}
                />
              </Field>
            </div>

            <Field label="Quantity remaining">
              <input
                value={quantityLeft}
                onChange={(event) =>
                  setQuantityLeft(
                    event.target.value,
                  )
                }
                type="number"
                min="0"
                disabled={locked}
                className={fieldClass}
              />
            </Field>
          </FormSection>

          <FormSection title="Pickup window">
            <Field label="Pickup starts">
              <input
                value={pickupStart}
                onChange={(event) =>
                  setPickupStart(
                    event.target.value,
                  )
                }
                type="datetime-local"
                disabled={locked}
                className={fieldClass}
              />
            </Field>

            <Field label="Pickup ends">
              <input
                value={pickupEnd}
                onChange={(event) =>
                  setPickupEnd(
                    event.target.value,
                  )
                }
                type="datetime-local"
                disabled={locked}
                className={fieldClass}
              />
            </Field>
          </FormSection>

          {error ? (
            <div className="rounded-xl bg-[#FFF0EA] p-4 text-sm font-semibold text-[#8A3A20]">
              {error}
            </div>
          ) : null}
        </div>

        <footer
          className="sticky bottom-0 z-20 grid grid-cols-[0.8fr_1.2fr] gap-2 border-t border-black/[0.07] bg-[#F5F2EB]/96 px-4 py-3 backdrop-blur"
          style={{
            paddingBottom:
              "max(12px, env(safe-area-inset-bottom))",
          }}
        >
          <button
            type="button"
            onClick={onClose}
            className="min-h-12 rounded-xl bg-black/[0.06] text-sm font-black text-black/55"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={busy}
            className="min-h-12 rounded-xl bg-[#18392B] text-sm font-black text-white disabled:opacity-50"
          >
            {busy
              ? "Saving…"
              : "Save changes"}
          </button>
        </footer>
      </form>
    </div>
  );
}

function FormSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4 rounded-[1.4rem] border border-black/[0.07] bg-white p-4">
      <h2 className="text-base font-black">
        {title}
      </h2>

      {children}
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
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

function DeleteDealModal({
  deal,
  busy,
  onClose,
  onConfirm,
}: {
  deal: ManagedBusinessDeal;
  busy: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  useModalBodyLock();

  const blocked = !deal.canDelete;

  return (
    <div className="fixed inset-0 z-[2147483500] flex items-end bg-black/40 p-0 sm:items-center sm:justify-center sm:p-5">
      <div className="w-full rounded-t-[1.8rem] bg-[#F5F2EB] p-5 sm:max-w-md sm:rounded-[1.8rem]">
        <div className="mx-auto mb-5 h-1.5 w-10 rounded-full bg-black/15 sm:hidden" />

        <p className="text-[10px] font-black uppercase tracking-[0.1em] text-[#8A3A20]">
          Delete deal
        </p>

        <h2 className="mt-2 text-2xl font-black tracking-[-0.035em]">
          {deal.title}
        </h2>

        {blocked ? (
          <div className="mt-4 flex gap-3 rounded-xl bg-[#FFF0C7] p-4 text-[#715914]">
            <Lock
              size={20}
              className="shrink-0"
              aria-hidden="true"
            />

            <p className="text-sm leading-5">
              This deal has{" "}
              {deal.claimCount} customer
              claim
              {deal.claimCount === 1
                ? ""
                : "s"}
              . Close it instead so
              customers keep their receipt.
            </p>
          </div>
        ) : (
          <p className="mt-4 text-sm leading-6 text-black/50">
            This permanently removes the
            deal. It is allowed because no
            customer has claimed it.
          </p>
        )}

        <div
          className="mt-6 grid grid-cols-2 gap-2"
          style={{
            paddingBottom:
              "env(safe-area-inset-bottom)",
          }}
        >
          <button
            type="button"
            onClick={onClose}
            className="min-h-12 rounded-xl bg-black/[0.06] text-sm font-black text-black/55"
          >
            {blocked ? "Close" : "Cancel"}
          </button>

          {!blocked ? (
            <button
              type="button"
              onClick={onConfirm}
              disabled={busy}
              className="min-h-12 rounded-xl bg-[#8A3A20] text-sm font-black text-white disabled:opacity-50"
            >
              {busy
                ? "Deleting…"
                : "Delete deal"}
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="min-h-12 rounded-xl bg-[#18392B] text-sm font-black text-white"
            >
              Understood
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function DealsLoading() {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({
        length: 3,
      }).map((_, index) => (
        <div
          key={index}
          className="h-64 rounded-[1.4rem] bg-black/[0.06]"
        />
      ))}
    </div>
  );
}
