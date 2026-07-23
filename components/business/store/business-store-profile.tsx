"use client";

import Link from "next/link";
import {
  BadgeCheck,
  Camera,
  CircleAlert,
  ExternalLink,
  ImagePlus,
  LoaderCircle,
  MapPin,
  Pencil,
  RefreshCw,
  Save,
  Store,
  X,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type ReactNode,
} from "react";

import {
  fetchEditableBusinessStores,
  updateEditableBusinessStore,
  type EditableBusinessStore,
} from "@/lib/api/business-store-profile";
import {
  uploadBusinessImage,
  validateBusinessImage,
} from "@/lib/storage/business-media";

type StoreForm = {
  name: string;
  description: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  website: string;
  latitude: string;
  longitude: string;
};

const inputClass =
  "min-h-12 w-full min-w-0 rounded-xl border border-black/10 bg-[#F8F5EE] px-3 text-base outline-none focus:border-[#6F7D43]";

function getForm(
  store: EditableBusinessStore,
): StoreForm {
  return {
    name: store.name || "",
    description:
      store.description || "",
    address: store.address || "",
    city: store.city || "",
    phone: store.phone || "",
    email: store.email || "",
    website: store.website || "",
    latitude:
      store.latitude !== null
        ? String(store.latitude)
        : "",
    longitude:
      store.longitude !== null
        ? String(store.longitude)
        : "",
  };
}

function nullable(value: string) {
  const trimmed = value.trim();
  return trimmed || null;
}

function coordinate(value: string) {
  if (!value.trim()) return null;

  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    throw new Error(
      "Latitude and longitude must be valid numbers.",
    );
  }

  return parsed;
}

export function BusinessStoreProfile() {
  const [stores, setStores] = useState<
    EditableBusinessStore[]
  >([]);

  const [selectedId, setSelectedId] =
    useState("");

  const [form, setForm] =
    useState<StoreForm | null>(null);

  const [editing, setEditing] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [busy, setBusy] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [saved, setSaved] =
    useState(false);

  const [logoFile, setLogoFile] =
    useState<File | null>(null);

  const [coverFile, setCoverFile] =
    useState<File | null>(null);

  const [logoPreview, setLogoPreview] =
    useState<string | null>(null);

  const [coverPreview, setCoverPreview] =
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
        await fetchEditableBusinessStores();

      setStores(nextStores);

      if (nextStores[0]) {
        setSelectedId((current) =>
          nextStores.some(
            (store) =>
              store.id === current,
          )
            ? current
            : nextStores[0].id,
        );
      }
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Could not load store.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadStores();
  }, []);

  useEffect(() => {
    if (!selectedStore) return;

    setForm(getForm(selectedStore));
    setLogoPreview(
      selectedStore.logo_url,
    );
    setCoverPreview(
      selectedStore.image_url,
    );
    setLogoFile(null);
    setCoverFile(null);
    setEditing(false);
    setSaved(false);
  }, [selectedStore?.id]);

  function setField(
    field: keyof StoreForm,
    value: string,
  ) {
    setForm((current) =>
      current
        ? {
            ...current,
            [field]: value,
          }
        : current,
    );
  }

  function selectImage(
    event: ChangeEvent<HTMLInputElement>,
    type: "logo" | "cover",
  ) {
    const file =
      event.target.files?.[0];

    event.target.value = "";

    if (!file) return;

    try {
      validateBusinessImage(file);

      const preview =
        URL.createObjectURL(file);

      if (type === "logo") {
        setLogoFile(file);
        setLogoPreview(preview);
      } else {
        setCoverFile(file);
        setCoverPreview(preview);
      }

      setError(null);
    } catch (imageError) {
      setError(
        imageError instanceof Error
          ? imageError.message
          : "Could not use image.",
      );
    }
  }

  async function saveStore() {
    if (!selectedStore || !form) {
      return;
    }

    if (!form.name.trim()) {
      setError(
        "Business name is required.",
      );
      return;
    }

    setBusy(true);
    setError(null);
    setSaved(false);

    try {
      let logoUrl =
        selectedStore.logo_url;

      let imageUrl =
        selectedStore.image_url;

      if (logoFile) {
        const uploaded =
          await uploadBusinessImage({
            file: logoFile,
            bucket: "business-images",
            folder: selectedStore.id,
          });

        logoUrl = uploaded.publicUrl;
      }

      if (coverFile) {
        const uploaded =
          await uploadBusinessImage({
            file: coverFile,
            bucket: "business-images",
            folder: selectedStore.id,
          });

        imageUrl = uploaded.publicUrl;
      }

      const updated =
        await updateEditableBusinessStore(
          selectedStore,
          {
            name: form.name.trim(),
            description: nullable(
              form.description,
            ),
            address: nullable(
              form.address,
            ),
            city: nullable(form.city),
            phone: nullable(form.phone),
            email: nullable(form.email),
            website: nullable(
              form.website,
            ),
            latitude: coordinate(
              form.latitude,
            ),
            longitude: coordinate(
              form.longitude,
            ),
            logo_url: logoUrl,
            image_url: imageUrl,
          },
        );

      setStores((current) =>
        current.map((store) =>
          store.id === updated.id
            ? updated
            : store,
        ),
      );

      setLogoFile(null);
      setCoverFile(null);
      setEditing(false);
      setSaved(true);
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Could not save store.",
      );
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <div className="mt-6 grid min-h-48 place-items-center rounded-[1.5rem] bg-white">
        <LoaderCircle
          size={24}
          className="animate-spin text-[#6F7D43]"
          aria-hidden="true"
        />
      </div>
    );
  }

  if (!selectedStore || !form) {
    return (
      <div className="mt-6 rounded-[1.5rem] bg-white px-5 py-10 text-center">
        <Store
          size={30}
          className="mx-auto text-[#6F7D43]"
          aria-hidden="true"
        />

        <h2 className="mt-4 text-lg font-black">
          No store assigned
        </h2>
      </div>
    );
  }

  return (
    <>
      {stores.length > 1 ? (
        <div className="-mx-4 mt-5 flex gap-2 overflow-x-auto px-4 pb-1">
          {stores.map((store) => (
            <button
              key={store.id}
              type="button"
              onClick={() =>
                setSelectedId(store.id)
              }
              className={[
                "min-h-10 shrink-0 rounded-full px-4 text-sm font-black",
                selectedStore.id ===
                store.id
                  ? "bg-[#18392B] text-white"
                  : "bg-white text-black/50",
              ].join(" ")}
            >
              {store.name}
            </button>
          ))}
        </div>
      ) : null}

      <section className="relative mt-6 overflow-hidden rounded-[1.5rem] border border-black/[0.07] bg-white">
        <div className="relative h-40 bg-[#DDE4CC]">
          {coverPreview ? (
            <img
              src={coverPreview}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="grid h-full place-items-center text-[#6F7D43]">
              <Camera
                size={30}
                aria-hidden="true"
              />
            </div>
          )}

          {editing ? (
            <label className="absolute right-3 top-3 flex min-h-10 cursor-pointer items-center gap-2 rounded-full bg-white px-4 text-xs font-black shadow">
              <ImagePlus
                size={16}
                aria-hidden="true"
              />
              Store photo

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(event) =>
                  selectImage(
                    event,
                    "cover",
                  )
                }
              />
            </label>
          ) : null}
        </div>

        <div className="relative px-4 pb-4 pt-12">
          <div className="absolute -top-10 left-4 h-20 w-20 overflow-hidden rounded-[1.25rem] border-4 border-white bg-[#E9EDDD]">
            {logoPreview ? (
              <img
                src={logoPreview}
                alt={`${selectedStore.name} logo`}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="grid h-full place-items-center font-black text-[#18392B]">
                CE
              </div>
            )}

            {editing ? (
              <label className="absolute inset-0 grid cursor-pointer place-items-center bg-black/35 text-white opacity-0 transition hover:opacity-100">
                <ImagePlus
                  size={20}
                  aria-hidden="true"
                />

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(event) =>
                    selectImage(
                      event,
                      "logo",
                    )
                  }
                />
              </label>
            ) : null}
          </div>

          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="truncate text-xl font-black">
                  {selectedStore.name}
                </h2>

                {selectedStore.verified ? (
                  <BadgeCheck
                    size={18}
                    className="text-[#6F7D43]"
                    aria-label="Verified"
                  />
                ) : null}
              </div>

              <p className="mt-1 text-sm text-black/45">
                {selectedStore.city ||
                  "Location not set"}
              </p>
            </div>

            {!editing ? (
              <button
                type="button"
                onClick={() =>
                  setEditing(true)
                }
                className="flex min-h-10 shrink-0 items-center gap-2 rounded-full bg-[#E9EDDD] px-4 text-xs font-black text-[#18392B]"
              >
                <Pencil
                  size={15}
                  aria-hidden="true"
                />
                Edit
              </button>
            ) : null}
          </div>

          <Link
            href={`/stores/${selectedStore.id}`}
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-black text-[#6F7D43]"
          >
            View public profile
            <ExternalLink
              size={15}
              aria-hidden="true"
            />
          </Link>
        </div>
      </section>

      {error ? (
        <div className="mt-4 flex gap-3 rounded-xl bg-[#FFF0EA] p-4 text-[#8A3A20]">
          <CircleAlert
            size={20}
            className="shrink-0"
            aria-hidden="true"
          />
          <p className="text-sm">
            {error}
          </p>
        </div>
      ) : null}

      {saved ? (
        <div className="mt-4 rounded-xl bg-[#E9EDDD] p-4 text-sm font-black text-[#36562B]">
          Store profile saved.
        </div>
      ) : null}

      <section className="mt-4 space-y-4 rounded-[1.5rem] border border-black/[0.07] bg-white p-4">
        <Field label="Business name">
          <input
            value={form.name}
            disabled={!editing}
            onChange={(event) =>
              setField(
                "name",
                event.target.value,
              )
            }
            className={inputClass}
          />
        </Field>

        <Field label="Description">
          <textarea
            value={form.description}
            disabled={!editing}
            onChange={(event) =>
              setField(
                "description",
                event.target.value,
              )
            }
            rows={4}
            className={`${inputClass} py-3`}
          />
        </Field>

        <Field label="Address">
          <input
            value={form.address}
            disabled={!editing}
            onChange={(event) =>
              setField(
                "address",
                event.target.value,
              )
            }
            className={inputClass}
          />
        </Field>

        <Field label="City">
          <input
            value={form.city}
            disabled={!editing}
            onChange={(event) =>
              setField(
                "city",
                event.target.value,
              )
            }
            className={inputClass}
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Latitude">
            <input
              value={form.latitude}
              disabled={!editing}
              inputMode="decimal"
              onChange={(event) =>
                setField(
                  "latitude",
                  event.target.value,
                )
              }
              className={inputClass}
            />
          </Field>

          <Field label="Longitude">
            <input
              value={form.longitude}
              disabled={!editing}
              inputMode="decimal"
              onChange={(event) =>
                setField(
                  "longitude",
                  event.target.value,
                )
              }
              className={inputClass}
            />
          </Field>
        </div>

        <Field label="Phone">
          <input
            value={form.phone}
            disabled={!editing}
            type="tel"
            onChange={(event) =>
              setField(
                "phone",
                event.target.value,
              )
            }
            className={inputClass}
          />
        </Field>

        <Field label="Email">
          <input
            value={form.email}
            disabled={!editing}
            type="email"
            onChange={(event) =>
              setField(
                "email",
                event.target.value,
              )
            }
            className={inputClass}
          />
        </Field>

        <Field label="Website">
          <input
            value={form.website}
            disabled={!editing}
            type="url"
            onChange={(event) =>
              setField(
                "website",
                event.target.value,
              )
            }
            className={inputClass}
          />
        </Field>
      </section>

      {editing ? (
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => {
              setForm(
                getForm(selectedStore),
              );
              setLogoFile(null);
              setCoverFile(null);
              setLogoPreview(
                selectedStore.logo_url,
              );
              setCoverPreview(
                selectedStore.image_url,
              );
              setEditing(false);
            }}
            disabled={busy}
            className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-black/[0.06] text-sm font-black text-black/55"
          >
            <X size={17} />
            Cancel
          </button>

          <button
            type="button"
            onClick={() =>
              void saveStore()
            }
            disabled={busy}
            className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#18392B] text-sm font-black text-white disabled:opacity-50"
          >
            {busy ? (
              <RefreshCw
                size={17}
                className="animate-spin"
              />
            ) : (
              <Save size={17} />
            )}

            {busy ? "Saving…" : "Save"}
          </button>
        </div>
      ) : null}
    </>
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
      <span className="text-[10px] font-black uppercase tracking-[0.08em] text-black/35">
        {label}
      </span>
      {children}
    </label>
  );
}
