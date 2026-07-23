"use client";

import Link from "next/link";
import {
  CircleAlert,
  Lock,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  closeManagedBusinessDeal,
  deleteManagedBusinessDeal,
  fetchManagedBusinessDeals,
  updateManagedBusinessDeal,
  type ManagedBusinessDeal,
} from "@/lib/api/business-deals";
import { formatMoney } from "@/lib/utils/format";

type DealFilter = "all" | "available" | "draft" | "sold_out" | "expired";

const filters: { value: DealFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "available", label: "Available" },
  { value: "draft", label: "Draft" },
  { value: "sold_out", label: "Closed" },
  { value: "expired", label: "Expired" },
];

const categories = [
  { value: "bakery", label: "Bakery" },
  { value: "fruit_veg", label: "Fruit & veg" },
  { value: "ready_meal", label: "Ready meal" },
  { value: "grocery", label: "Grocery" },
  { value: "family_pack", label: "Family pack" },
  { value: "mystery_bag", label: "Mystery bag" },
];

function toDatetimeLocal(value: string | null) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60 * 1000);

  return localDate.toISOString().slice(0, 16);
}

function fromDatetimeLocal(value: string) {
  if (!value) return null;
  return new Date(value).toISOString();
}

function formatPickup(value: string | null) {
  if (!value) return "TBD";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "TBD";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function BusinessDealsManager() {
  const [deals, setDeals] = useState<ManagedBusinessDeal[]>([]);
  const [filter, setFilter] = useState<DealFilter>("all");
  const [editingDeal, setEditingDeal] = useState<ManagedBusinessDeal | null>(
    null
  );
  const [deleteDeal, setDeleteDeal] = useState<ManagedBusinessDeal | null>(
    null
  );
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  const filteredDeals = useMemo(() => {
    if (filter === "all") return deals;
    return deals.filter((deal) => deal.status === filter);
  }, [deals, filter]);

  const stats = useMemo(() => {
    return {
      total: deals.length,
      available: deals.filter((deal) => deal.status === "available").length,
      locked: deals.filter((deal) => deal.hasClaims).length,
      deletable: deals.filter((deal) => deal.canDelete).length,
    };
  }, [deals]);

  async function loadDeals() {
    setLoading(true);
    setMessage(null);

    try {
      const nextDeals = await fetchManagedBusinessDeals();
      setDeals(nextDeals);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Could not load deals."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadDeals();
  }, []);

  async function handleCloseDeal(deal: ManagedBusinessDeal) {
    setBusy(true);
    setMessage(null);

    try {
      const updated = await closeManagedBusinessDeal(deal.id);
      setDeals((current) =>
        current.map((item) => (item.id === updated.id ? updated : item))
      );
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Could not close deal."
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
      await deleteManagedBusinessDeal(deleteDeal.id);
      setDeals((current) =>
        current.filter((deal) => deal.id !== deleteDeal.id)
      );
      setDeleteDeal(null);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Could not delete deal."
      );
    } finally {
      setBusy(false);
    }
  }

  function updateDealInState(updated: ManagedBusinessDeal) {
    setDeals((current) =>
      current.map((deal) => (deal.id === updated.id ? updated : deal))
    );
  }

  return (
    <div className="space-y-7 pb-16">
      <section className="relative overflow-hidden rounded-[2.25rem] bg-[#6F7D43] p-6 text-white shadow-[0_24px_70px_rgba(95,78,55,0.14)] md:p-8">
        <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[#9baa6a]/30 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-32 w-72 rounded-full bg-[#b76e45]/20 blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-wide text-[#dfe8b6]">
              Business tools
            </p>

            <h1 className="mt-4 text-4xl font-black tracking-tight md:text-6xl">
              Manage deals
            </h1>

            <p className="mt-3 max-w-2xl text-white/62">
              Edit live offers, close sold-out deals and safely delete drafts
              before customers claim them.
            </p>
          </div>

          <Link
            href="/business/deals/new"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 font-black text-[#2F261F] shadow-[0_10px_30px_rgba(95,78,55,0.08)] transition hover:bg-[#F4EFE6]"
          >
            <Plus size={18} />
            Create deal
          </Link>
        </div>

        <div className="relative z-10 mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total deals" value={String(stats.total)} />
          <StatCard label="Available" value={String(stats.available)} />
          <StatCard label="Locked" value={String(stats.locked)} />
          <StatCard label="Deletable" value={String(stats.deletable)} />
        </div>
      </section>

      <section className="rounded-[1.75rem] bg-white p-5 shadow-[0_10px_30px_rgba(95,78,55,0.08)] ring-1 ring-[#DDD2C2] dark:bg-[#241f1a] dark:ring-white/10 md:p-6">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-[#6F7D43] dark:text-[#E1E9B8]">
              Inventory
            </p>

            <h2 className="mt-1 text-3xl font-black tracking-tight">
              Your offers
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {filters.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setFilter(item.value)}
                className={[
                  "rounded-full px-4 py-2 text-sm font-black transition",
                  filter === item.value
                    ? "bg-[#6F7D43] text-white dark:bg-[#9baa6a] dark:text-[#2F261F]"
                    : "bg-[#F4EFE6] text-black/50 hover:text-black dark:bg-[#171411] dark:text-white/45 dark:hover:text-white",
                ].join(" ")}
              >
                {item.label}
              </button>
            ))}

            <button
              type="button"
              onClick={() => loadDeals()}
              className="inline-flex items-center gap-2 rounded-full bg-[#F4EFE6] px-4 py-2 text-sm font-black text-[#6F7D43] transition hover:bg-[#EEF1E3] dark:bg-[#171411] dark:text-[#E1E9B8]"
            >
              <RefreshCw size={15} />
              Refresh
            </button>
          </div>
        </div>

        {message ? (
          <div className="mt-5 rounded-[1.5rem] bg-[#fff0ea] p-4 text-[#8a3a20]">
            <div className="flex gap-3">
              <CircleAlert size={20} />
              <p className="font-semibold">{message}</p>
            </div>
          </div>
        ) : null}

        <div className="mt-6 space-y-3">
          {loading ? (
            <div className="rounded-[1.5rem] bg-[#F4EFE6] p-8 text-center dark:bg-[#171411]">
              <p className="font-black">Loading deals...</p>
            </div>
          ) : filteredDeals.length === 0 ? (
            <div className="rounded-[1.5rem] bg-[#F4EFE6] p-8 text-center dark:bg-[#171411]">
              <p className="text-xl font-black">No deals here</p>
              <p className="mt-2 text-sm text-black/50 dark:text-white/40">
                Try another filter or create a new deal.
              </p>
            </div>
          ) : (
            filteredDeals.map((deal) => (
              <DealManagementCard
                key={deal.id}
                deal={deal}
                busy={busy}
                onEdit={() => setEditingDeal(deal)}
                onClose={() => handleCloseDeal(deal)}
                onDelete={() => setDeleteDeal(deal)}
              />
            ))
          )}
        </div>
      </section>

      {editingDeal ? (
        <EditDealModal
          deal={editingDeal}
          onClose={() => setEditingDeal(null)}
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
          onClose={() => setDeleteDeal(null)}
          onConfirm={handleDeleteDeal}
        />
      ) : null}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.5rem] bg-white/10 p-4 backdrop-blur">
      <p className="text-xs font-black uppercase tracking-wide text-white/42">
        {label}
      </p>
      <p className="mt-2 text-3xl font-black">{value}</p>
    </div>
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
  return (
    <div className="rounded-[1.5rem] border border-[#DDD2C2] bg-[#FBF8F2] p-4 transition hover:-translate-y-0.5 hover:shadow-lg dark:border-white/10 dark:bg-[#171411]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={deal.status} />

            {deal.hasClaims ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#fff6df] px-3 py-1 text-xs font-black uppercase tracking-wide text-[#74501f]">
                <Lock size={13} />
                {deal.claimCount} claim{deal.claimCount === 1 ? "" : "s"}
              </span>
            ) : (
              <span className="rounded-full bg-[#eef8e6] px-3 py-1 text-xs font-black uppercase tracking-wide text-[#40591f]">
                No claims
              </span>
            )}
          </div>

          <h3 className="mt-3 truncate text-xl font-black tracking-tight">
            {deal.title}
          </h3>

          <p className="mt-1 line-clamp-1 text-sm text-black/50 dark:text-white/40">
            {deal.description || "No description"}
          </p>

          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-black/50 dark:text-white/40">
            <span>
              Price:{" "}
              <strong className="text-black dark:text-white">
                {formatMoney(deal.price)}
              </strong>
            </span>
            <span>Qty left: {deal.quantityLeft}</span>
            <span>
              Pickup: {formatPickup(deal.pickupStart)} to{" "}
              {formatPickup(deal.pickupEnd)}
            </span>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap gap-2">
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex items-center gap-2 rounded-full bg-[#F4EFE6] px-4 py-2 text-sm font-black text-[#6F7D43] transition hover:bg-[#EEF1E3] dark:bg-[#241f1a] dark:text-[#E1E9B8]"
          >
            <Pencil size={15} />
            Edit
          </button>

          {deal.status !== "sold_out" ? (
            <button
              type="button"
              onClick={onClose}
              disabled={busy}
              className="rounded-full bg-[#6f7d43] px-4 py-2 text-sm font-black text-white transition hover:bg-[#5d6d32] disabled:opacity-60"
            >
              Close
            </button>
          ) : null}

          <button
            type="button"
            onClick={onDelete}
            disabled={busy || !deal.canDelete}
            title={
              deal.canDelete
                ? "Delete deal"
                : "Deals with customer claims cannot be deleted"
            }
            className="inline-flex items-center gap-2 rounded-full bg-[#fff0ea] px-4 py-2 text-sm font-black text-[#8a3a20] transition hover:bg-[#ffe3d8] disabled:cursor-not-allowed disabled:opacity-45"
          >
            <Trash2 size={15} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    available: "bg-[#EEF1E3] text-[#6F7D43]",
    draft: "bg-black/[0.055] text-black/50",
    sold_out: "bg-[#e9e2d6] text-[#6f5f4b]",
    expired: "bg-[#fff0ea] text-[#8a3a20]",
    cancelled: "bg-[#fff0ea] text-[#8a3a20]",
  };

  return (
    <span
      className={[
        "rounded-full px-3 py-1 text-xs font-black uppercase tracking-wide",
        styles[status] || styles.draft,
      ].join(" ")}
    >
      {status.replace("_", " ")}
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
  onUpdated: (deal: ManagedBusinessDeal) => void;
}) {
  const [title, setTitle] = useState(deal.title || "");
  const [description, setDescription] = useState(deal.description || "");
  const [category, setCategory] = useState(deal.category || "mystery_bag");
  const [price, setPrice] = useState(String(deal.price || ""));
  const [originalPrice, setOriginalPrice] = useState(
    String(deal.originalPrice || "")
  );
  const [quantityLeft, setQuantityLeft] = useState(
    String(deal.quantityLeft ?? 0)
  );
  const [pickupStart, setPickupStart] = useState(
    toDatetimeLocal(deal.pickupStart)
  );
  const [pickupEnd, setPickupEnd] = useState(toDatetimeLocal(deal.pickupEnd));
  const [status, setStatus] = useState(deal.status || "available");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const locked = !deal.canEditFully;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);

    try {
      const payload = locked
        ? {
            title,
            description,
            status,
          }
        : {
            title,
            description,
            category,
            price: Number(price),
            original_price: Number(originalPrice),
            quantity_left: Number(quantityLeft),
            pickup_start: fromDatetimeLocal(pickupStart),
            pickup_end: fromDatetimeLocal(pickupEnd),
            status,
          };

      const updated = await updateManagedBusinessDeal(deal.id, payload);
      onUpdated(updated);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Could not update deal."
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[10000]">
      <button
        type="button"
        className="absolute inset-0 bg-[#6F7D43]/40 backdrop-blur-xl"
        onClick={onClose}
        aria-label="Close edit modal"
      />

      <div className="pointer-events-none relative z-10 flex min-h-screen items-center justify-center px-4 py-8">
        <form
          onSubmit={handleSubmit}
          className="pointer-events-auto relative max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-[2.25rem] bg-[#FBF8F2] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.25)] ring-1 ring-black/10 dark:bg-[#241f1a] dark:ring-white/10"
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-black/[0.06] text-black/60 transition hover:bg-[#556235]/[0.1] hover:text-black dark:bg-white/10 dark:text-white/60 dark:hover:text-white"
            aria-label="Close"
          >
            <X size={17} />
          </button>

          <div className="pr-12">
            <p className="text-sm font-black uppercase tracking-wide text-[#6F7D43] dark:text-[#E1E9B8]">
              Edit deal
            </p>

            <h2 className="mt-2 text-3xl font-black tracking-tight">
              {deal.title}
            </h2>

            {locked ? (
              <p className="mt-3 rounded-2xl bg-[#fff6df] p-3 text-sm font-semibold leading-6 text-[#74501f]">
                This deal already has customer claims. Price, quantity, category
                and pickup window are locked.
              </p>
            ) : null}
          </div>

          <div className="mt-6 grid gap-4">
            <label className="grid gap-2">
              <span className="text-sm font-black">Title</span>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                required
                className="rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none focus:border-[#6f7d43] dark:border-white/10 dark:bg-[#171411]"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-black">Description</span>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={3}
                className="rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none focus:border-[#6f7d43] dark:border-white/10 dark:bg-[#171411]"
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-sm font-black">Category</span>
                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  disabled={locked}
                  className="rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none disabled:opacity-50 dark:border-white/10 dark:bg-[#171411]"
                >
                  {categories.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-black">Status</span>
                <select
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                  className="rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none focus:border-[#6f7d43] dark:border-white/10 dark:bg-[#171411]"
                >
                  <option value="draft">Draft</option>
                  <option value="available">Available</option>
                  <option value="sold_out">Sold out</option>
                  <option value="expired">Expired</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <label className="grid gap-2">
                <span className="text-sm font-black">Price</span>
                <input
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                  type="number"
                  step="0.01"
                  min="0"
                  disabled={locked}
                  className="rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none disabled:opacity-50 dark:border-white/10 dark:bg-[#171411]"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-black">Original price</span>
                <input
                  value={originalPrice}
                  onChange={(event) => setOriginalPrice(event.target.value)}
                  type="number"
                  step="0.01"
                  min="0"
                  disabled={locked}
                  className="rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none disabled:opacity-50 dark:border-white/10 dark:bg-[#171411]"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-black">Quantity left</span>
                <input
                  value={quantityLeft}
                  onChange={(event) => setQuantityLeft(event.target.value)}
                  type="number"
                  min="0"
                  disabled={locked}
                  className="rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none disabled:opacity-50 dark:border-white/10 dark:bg-[#171411]"
                />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-sm font-black">Pickup start</span>
                <input
                  value={pickupStart}
                  onChange={(event) => setPickupStart(event.target.value)}
                  type="datetime-local"
                  disabled={locked}
                  className="rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none disabled:opacity-50 dark:border-white/10 dark:bg-[#171411]"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-black">Pickup end</span>
                <input
                  value={pickupEnd}
                  onChange={(event) => setPickupEnd(event.target.value)}
                  type="datetime-local"
                  disabled={locked}
                  className="rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none disabled:opacity-50 dark:border-white/10 dark:bg-[#171411]"
                />
              </label>
            </div>
          </div>

          {error ? (
            <div className="mt-5 rounded-[1.5rem] bg-[#fff0ea] p-4 text-sm font-semibold text-[#8a3a20]">
              {error}
            </div>
          ) : null}

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full bg-[#F4EFE6] px-5 py-3 font-black text-black/55 transition hover:text-black dark:bg-[#171411] dark:text-white/50 dark:hover:text-white"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={busy}
              className="rounded-full bg-[#6F7D43] px-5 py-3 font-black text-white transition hover:bg-[#556235] disabled:opacity-60 dark:bg-[#9baa6a] dark:text-[#2F261F]"
            >
              {busy ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
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
  const blocked = !deal.canDelete;

  return (
    <div className="fixed inset-0 z-[10000]">
      <button
        type="button"
        className="absolute inset-0 bg-[#6F7D43]/40 backdrop-blur-xl"
        onClick={onClose}
        aria-label="Close delete modal"
      />

      <div className="pointer-events-none relative z-10 flex min-h-screen items-center justify-center px-4 py-8">
        <div className="pointer-events-auto w-full max-w-md rounded-[2.25rem] bg-[#FBF8F2] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.25)] ring-1 ring-black/10 dark:bg-[#241f1a] dark:ring-white/10">
          <p className="text-sm font-black uppercase tracking-wide text-[#8a3a20]">
            Delete deal
          </p>

          <h2 className="mt-2 text-3xl font-black tracking-tight">
            {deal.title}
          </h2>

          {blocked ? (
            <p className="mt-4 rounded-2xl bg-[#fff6df] p-4 text-sm font-semibold leading-6 text-[#74501f]">
              This deal has {deal.claimCount} customer claim
              {deal.claimCount === 1 ? "" : "s"}. It cannot be deleted. Close
              it instead so customers keep their receipt history.
            </p>
          ) : (
            <p className="mt-4 text-sm leading-6 text-black/55 dark:text-white/45">
              This will permanently delete the deal. This is only allowed
              because no customer has claimed it yet.
            </p>
          )}

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full bg-[#F4EFE6] px-5 py-3 font-black text-black/55 transition hover:text-black dark:bg-[#171411] dark:text-white/50 dark:hover:text-white"
            >
              Close
            </button>

            {!blocked ? (
              <button
                type="button"
                onClick={onConfirm}
                disabled={busy}
                className="rounded-full bg-[#8a3a20] px-5 py-3 font-black text-white transition hover:bg-[#723019] disabled:opacity-60"
              >
                {busy ? "Deleting..." : "Delete"}
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
