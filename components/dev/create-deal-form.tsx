"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createBusinessDeal } from "@/lib/api/admin";

function toIsoFromLocal(value: string) {
  return new Date(value).toISOString();
}

function getDefaultDateTime(hoursFromNow: number) {
  const date = new Date();
  date.setHours(date.getHours() + hoursFromNow);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);

  return date.toISOString().slice(0, 16);
}

export function CreateDealForm() {
  const router = useRouter();

  const [title, setTitle] = useState("Bakery Rescue Bag");
  const [description, setDescription] = useState(
    "A mix of fresh bakery items from today."
  );
  const [price, setPrice] = useState("3.99");
  const [quantity, setQuantity] = useState("4");
  const [pickupStart, setPickupStart] = useState(getDefaultDateTime(2));
  const [pickupEnd, setPickupEnd] = useState(getDefaultDateTime(4));
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSaving(true);
    setError(null);

    try {
      await createBusinessDeal({
        title,
        description,
        price: Number(price),
        quantity: Number(quantity),
        pickupStart: toIsoFromLocal(pickupStart),
        pickupEnd: toIsoFromLocal(pickupEnd),
      });

      router.push("/deals");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-black/60 dark:text-white/55">
          Title
        </label>
        <input
          className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-[#6f7d43] dark:border-white/10 dark:bg-[#171411]"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-black/60 dark:text-white/55">
          Description
        </label>
        <textarea
          className="min-h-28 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-[#6f7d43] dark:border-white/10 dark:bg-[#171411]"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          required
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-black/60 dark:text-white/55">
            Price
          </label>
          <input
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-[#6f7d43] dark:border-white/10 dark:bg-[#171411]"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            inputMode="decimal"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-black/60 dark:text-white/55">
            Quantity
          </label>
          <input
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-[#6f7d43] dark:border-white/10 dark:bg-[#171411]"
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
            inputMode="numeric"
            required
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-black/60 dark:text-white/55">
            Pickup starts
          </label>
          <input
            type="datetime-local"
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-[#6f7d43] dark:border-white/10 dark:bg-[#171411]"
            value={pickupStart}
            onChange={(event) => setPickupStart(event.target.value)}
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-black/60 dark:text-white/55">
            Pickup ends
          </label>
          <input
            type="datetime-local"
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-[#6f7d43] dark:border-white/10 dark:bg-[#171411]"
            value={pickupEnd}
            onChange={(event) => setPickupEnd(event.target.value)}
            required
          />
        </div>
      </div>

      {error && (
        <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <button
        className="rounded-2xl bg-[#6f7d43] px-6 py-4 font-bold text-white shadow-[0_10px_30px_rgba(95,78,55,0.08)] hover:bg-[#5d6d32] disabled:opacity-60 dark:bg-[#9baa6a] dark:text-[#2F261F]"
        disabled={isSaving}
      >
        {isSaving ? "Creating..." : "Create deal"}
      </button>
    </form>
  );
}
