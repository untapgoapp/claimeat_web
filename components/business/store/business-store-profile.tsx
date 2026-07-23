"use client";

import Link from "next/link";
import {
  BadgeCheck,
  ExternalLink,
  Globe2,
  ImageIcon,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  Store,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { fetchBusinessStores } from "@/lib/api/business-create";

type StoreRecord = {
  id: string;
  name?: string | null;
  [key: string]: unknown;
};

function textValue(
  store: StoreRecord,
  ...keys: string[]
) {
  for (const key of keys) {
    const value = store[key];

    if (
      typeof value === "string" &&
      value.trim()
    ) {
      return value.trim();
    }

    if (
      typeof value === "number"
    ) {
      return String(value);
    }
  }

  return null;
}

function booleanValue(
  store: StoreRecord,
  key: string,
) {
  return store[key] === true;
}

function getInitials(name: string) {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) {
    return "CE";
  }

  if (parts.length === 1) {
    return parts[0]
      .slice(0, 2)
      .toUpperCase();
  }

  return `${parts[0][0]}${parts[1][0]}`
    .toUpperCase();
}

export function BusinessStoreProfile() {
  const [stores, setStores] =
    useState<StoreRecord[]>([]);

  const [selectedId, setSelectedId] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const selectedStore = useMemo(
    () =>
      stores.find(
        (store) =>
          store.id === selectedId,
      ) ||
      stores[0] ||
      null,
    [selectedId, stores],
  );

  async function loadStores() {
    setLoading(true);
    setError(null);

    try {
      const nextStores =
        (await fetchBusinessStores()) as unknown as StoreRecord[];

      setStores(nextStores);

      setSelectedId((current) => {
        if (
          current &&
          nextStores.some(
            (store) =>
              store.id === current,
          )
        ) {
          return current;
        }

        return nextStores[0]?.id || "";
      });
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Could not load store profile.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadStores();
  }, []);

  if (loading && !selectedStore) {
    return (
      <div className="mt-6 animate-pulse space-y-3">
        <div className="h-36 rounded-[1.5rem] bg-black/[0.06]" />
        <div className="h-64 rounded-[1.5rem] bg-black/[0.06]" />
      </div>
    );
  }

  if (error && !selectedStore) {
    return (
      <div className="mt-6 rounded-[1.5rem] bg-[#FFF0EA] p-5 text-[#8A3A20]">
        <h2 className="font-black">
          Could not load store
        </h2>

        <p className="mt-2 text-sm">
          {error}
        </p>

        <button
          type="button"
          onClick={() =>
            void loadStores()
          }
          className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#8A3A20] px-5 text-sm font-black text-white"
        >
          <RefreshCw
            size={17}
            aria-hidden="true"
          />
          Try again
        </button>
      </div>
    );
  }

  if (!selectedStore) {
    return (
      <div className="mt-6 rounded-[1.5rem] border border-black/[0.07] bg-white px-5 py-10 text-center">
        <Store
          size={30}
          className="mx-auto text-[#6F7D43]"
          aria-hidden="true"
        />

        <h2 className="mt-4 text-lg font-black">
          No store assigned
        </h2>

        <p className="mt-2 text-sm text-black/45">
          Your business account is not
          connected to a store yet.
        </p>
      </div>
    );
  }

  const name =
    textValue(
      selectedStore,
      "name",
      "business_name",
    ) || "ClaimEat store";

  const description =
    textValue(
      selectedStore,
      "description",
    );

  const city =
    textValue(
      selectedStore,
      "city",
    );

  const address =
    textValue(
      selectedStore,
      "formatted_address",
      "address",
      "address_text",
    );

  const fullAddress = [
    address,
    city &&
    !address?.includes(city)
      ? city
      : null,
  ]
    .filter(Boolean)
    .join(", ");

  const phone =
    textValue(
      selectedStore,
      "phone",
      "phone_number",
    );

  const email =
    textValue(
      selectedStore,
      "email",
      "contact_email",
    );

  const website =
    textValue(
      selectedStore,
      "website",
      "website_url",
    );

  const logoUrl =
    textValue(
      selectedStore,
      "logo_url",
      "logoUrl",
    );

  const verified =
    booleanValue(
      selectedStore,
      "verified",
    );

  return (
    <>
      {stores.length > 1 ? (
        <div className="-mx-4 mt-5 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {stores.map((store) => {
            const storeName =
              textValue(
                store,
                "name",
                "business_name",
              ) || "Store";

            const active =
              selectedStore.id === store.id;

            return (
              <button
                key={store.id}
                type="button"
                onClick={() =>
                  setSelectedId(store.id)
                }
                className={[
                  "min-h-10 shrink-0 rounded-full px-4 text-sm font-black",
                  active
                    ? "bg-[#18392B] text-white"
                    : "border border-black/[0.07] bg-white text-black/50",
                ].join(" ")}
              >
                {storeName}
              </button>
            );
          })}
        </div>
      ) : null}

      <section className="mt-6 overflow-hidden rounded-[1.5rem] border border-black/[0.07] bg-white">
        <div className="flex items-center gap-4 p-4">
          <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-[1.3rem] bg-[#E9EDDD] text-xl font-black text-[#18392B]">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={`${name} logo`}
                className="h-full w-full object-cover"
              />
            ) : (
              getInitials(name)
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="truncate text-xl font-black tracking-[-0.03em]">
                {name}
              </h2>

              {verified ? (
                <BadgeCheck
                  size={18}
                  className="shrink-0 text-[#6F7D43]"
                  aria-label="Verified store"
                />
              ) : null}
            </div>

            <p className="mt-1 text-xs font-semibold text-black/40">
              {city || "Location not set"}
            </p>

            <Link
              href={`/stores/${selectedStore.id}`}
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-black text-[#6F7D43]"
            >
              View public profile
              <ExternalLink
                size={15}
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>

        {description ? (
          <p className="border-t border-black/[0.07] px-4 py-3 text-sm leading-6 text-black/55">
            {description}
          </p>
        ) : null}
      </section>

      <section className="mt-4 overflow-hidden rounded-[1.5rem] border border-black/[0.07] bg-white">
        <ProfileRow
          icon={MapPin}
          label="Address"
          value={
            fullAddress ||
            "Address not added"
          }
        />

        <ProfileRow
          icon={Phone}
          label="Phone"
          value={
            phone || "Phone not added"
          }
          href={
            phone
              ? `tel:${phone}`
              : undefined
          }
        />

        <ProfileRow
          icon={Mail}
          label="Email"
          value={
            email || "Email not added"
          }
          href={
            email
              ? `mailto:${email}`
              : undefined
          }
        />

        <ProfileRow
          icon={Globe2}
          label="Website"
          value={
            website ||
            "Website not added"
          }
          href={website || undefined}
        />

        <ProfileRow
          icon={ImageIcon}
          label="Images"
          value={
            logoUrl
              ? "Logo added"
              : "Logo not added"
          }
        />
      </section>

      <p className="mt-4 text-center text-xs leading-5 text-black/35">
        This screen currently reflects the
        information customers can see.
        Editing will be connected next.
      </p>
    </>
  );
}

type ProfileIcon =
  typeof MapPin;

function ProfileRow({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: ProfileIcon;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <>
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#E9EDDD] text-[#18392B]">
        <Icon
          size={18}
          aria-hidden="true"
        />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-[10px] font-black uppercase tracking-[0.08em] text-black/35">
          {label}
        </span>

        <span className="mt-1 block break-words text-sm font-semibold [overflow-wrap:anywhere]">
          {value}
        </span>
      </span>
    </>
  );

  const className =
    "flex min-h-[64px] items-center gap-3 border-b border-black/[0.07] px-4 py-2.5 last:border-b-0";

  if (href) {
    return (
      <a
        href={href}
        target={
          href.startsWith("http")
            ? "_blank"
            : undefined
        }
        rel={
          href.startsWith("http")
            ? "noreferrer"
            : undefined
        }
        className={className}
      >
        {content}
      </a>
    );
  }

  return (
    <div className={className}>
      {content}
    </div>
  );
}
