"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";
import mapboxgl from "mapbox-gl";

import type { MapBusiness } from "@/lib/types";

type StoreMapProps = {
  businesses: MapBusiness[];
  selectedStoreId: string | null;
  onSelectStore: (storeId: string | null) => void;
  fullBleed?: boolean;
};

const mapboxToken =
  process.env.NEXT_PUBLIC_MAPBOX_TOKEN ||
  process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

function getBusinessInitials(name: string) {
  const words = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 0) {
    return "CE";
  }

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return `${words[0][0]}${words[1][0]}`.toUpperCase();
}

function businessesAreTooSpreadOut(
  businesses: MapBusiness[],
) {
  if (businesses.length <= 1) {
    return false;
  }

  const latitudes = businesses.map((business) =>
    Number(business.latitude),
  );

  const longitudes = businesses.map((business) =>
    Number(business.longitude),
  );

  const minLatitude = Math.min(...latitudes);
  const maxLatitude = Math.max(...latitudes);
  const minLongitude = Math.min(...longitudes);
  const maxLongitude = Math.max(...longitudes);

  return (
    maxLatitude - minLatitude > 8 ||
    maxLongitude - minLongitude > 12
  );
}

function createStoreMarker(
  business: MapBusiness,
  selected: boolean,
) {
  const markerElement = document.createElement("button");

  markerElement.type = "button";

  markerElement.className = [
    "grid h-11 w-11 place-items-center rounded-full border-[3px] border-white text-xs font-black text-white shadow-[0_8px_24px_rgba(0,0,0,0.25)] transition duration-150",
    selected
      ? "scale-110 bg-[#C76F56] ring-4 ring-[#C76F56]/25"
      : "bg-[#18392B] hover:scale-105 hover:bg-[#10271D]",
  ].join(" ");

  markerElement.style.transform = "translateZ(0)";
  markerElement.style.willChange = "auto";

  markerElement.setAttribute(
    "aria-label",
    `View ${business.name}`,
  );

  markerElement.innerText = getBusinessInitials(
    business.name,
  );

  return markerElement;
}

export default function StoreMap({
  businesses,
  selectedStoreId,
  onSelectStore,
  fullBleed = false,
}: StoreMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  const validBusinesses = useMemo(() => {
    return businesses.filter((business) => {
      const latitude = Number(business.latitude);
      const longitude = Number(business.longitude);

      return (
        Number.isFinite(latitude) &&
        Number.isFinite(longitude)
      );
    });
  }, [businesses]);

  const selectedStore = useMemo(() => {
    return (
      validBusinesses.find(
        (business) =>
          business.id === selectedStoreId,
      ) || null
    );
  }, [selectedStoreId, validBusinesses]);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    if (!mapboxToken) {
      return;
    }

    if (mapRef.current) {
      return;
    }

    mapboxgl.accessToken = mapboxToken;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [24.4971, 58.3859],
      zoom: 12,
      minZoom: 3.5,
      projection: "mercator",
      attributionControl: false,
    });

    map.addControl(
      new mapboxgl.NavigationControl({
        showCompass: false,
      }),
      "top-right",
    );

    map.addControl(
      new mapboxgl.AttributionControl({
        compact: true,
      }),
      "bottom-right",
    );

    mapRef.current = map;

    return () => {
      markersRef.current.forEach((marker) => {
        marker.remove();
      });

      markersRef.current = [];

      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;

    if (!map) {
      return;
    }

    function handleBackgroundClick() {
      onSelectStore(null);
    }

    map.on("click", handleBackgroundClick);

    return () => {
      map.off("click", handleBackgroundClick);
    };
  }, [onSelectStore]);

  useEffect(() => {
    const map = mapRef.current;

    if (!map) {
      return;
    }

    markersRef.current.forEach((marker) => {
      marker.remove();
    });

    markersRef.current = [];

    if (validBusinesses.length === 0) {
      onSelectStore(null);
      return;
    }

    validBusinesses.forEach((business) => {
      const latitude = Number(business.latitude);
      const longitude = Number(business.longitude);

      const markerElement = createStoreMarker(
        business,
        selectedStoreId === business.id,
      );

      markerElement.addEventListener(
        "click",
        (event) => {
          event.stopPropagation();

          onSelectStore(business.id);

          map.easeTo({
            center: [longitude, latitude],
            zoom: Math.max(map.getZoom(), 14),
            duration: 500,
          });
        },
      );

      const marker = new mapboxgl.Marker({
        element: markerElement,
        anchor: "center",
      })
        .setLngLat([longitude, latitude])
        .addTo(map);

      markersRef.current.push(marker);
    });

    if (selectedStore) {
      map.easeTo({
        center: [
          Number(selectedStore.longitude),
          Number(selectedStore.latitude),
        ],
        zoom: Math.max(map.getZoom(), 14),
        duration: 500,
      });

      return;
    }

    const firstBusiness = validBusinesses[0];

    if (
      validBusinesses.length === 1 ||
      businessesAreTooSpreadOut(validBusinesses)
    ) {
      map.easeTo({
        center: [
          Number(firstBusiness.longitude),
          Number(firstBusiness.latitude),
        ],
        zoom: 13,
        duration: 500,
      });

      return;
    }

    const bounds = new mapboxgl.LngLatBounds();

    validBusinesses.forEach((business) => {
      bounds.extend([
        Number(business.longitude),
        Number(business.latitude),
      ]);
    });

    map.fitBounds(bounds, {
      padding: fullBleed ? 120 : 80,
      maxZoom: 14,
      duration: 600,
    });
  }, [
    fullBleed,
    onSelectStore,
    selectedStore,
    selectedStoreId,
    validBusinesses,
  ]);

  useEffect(() => {
    if (!selectedStoreId) {
      return;
    }

    const stillVisible = validBusinesses.some(
      (business) =>
        business.id === selectedStoreId,
    );

    if (!stillVisible) {
      onSelectStore(null);
    }
  }, [
    onSelectStore,
    selectedStoreId,
    validBusinesses,
  ]);

  if (!mapboxToken) {
    return (
      <div className="grid h-screen w-screen place-items-center bg-[#FBFAF6] text-sm text-zinc-500">
        Missing Mapbox token.
      </div>
    );
  }

  return (
    <div
      className={[
        "relative overflow-hidden bg-[#FBFAF6]",
        fullBleed
          ? "h-screen w-screen"
          : "h-[620px] rounded-[1.5rem] border border-black/10",
      ].join(" ")}
    >
      <div
        ref={containerRef}
        className="h-full w-full"
      />

      {selectedStore ? (
        <StorePreviewCard
          business={selectedStore}
          onClose={() => onSelectStore(null)}
          fullBleed={fullBleed}
        />
      ) : null}
    </div>
  );
}

function StorePreviewCard({
  business,
  onClose,
  fullBleed,
}: {
  business: MapBusiness;
  onClose: () => void;
  fullBleed: boolean;
}) {
  const address = [
    business.address,
    business.city,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div
      className={[
        "absolute z-20 w-[min(390px,calc(100vw-32px))] overflow-hidden rounded-[1.5rem] border border-black/10 bg-[#FFFEFA] shadow-[0_18px_48px_rgba(0,0,0,0.16)]",
        fullBleed
          ? "bottom-28 left-4 sm:left-6"
          : "bottom-4 left-4",
      ].join(" ")}
    >
      <div className="relative grid h-32 place-items-center overflow-hidden bg-[#E8D8BE]">
        {business.logoUrl ? (
          <img
            src={business.logoUrl}
            alt={`${business.name} logo`}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-5xl font-black tracking-[-0.06em] text-[#18392B]">
            {getBusinessInitials(business.name)}
          </span>
        )}

        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-lg leading-none text-black shadow-sm"
          aria-label="Close business preview"
        >
          ×
        </button>

        {business.verified ? (
          <span className="absolute bottom-3 left-3 rounded-full bg-[#E7B83D] px-3 py-1 text-xs font-black text-[#18392B]">
            Verified
          </span>
        ) : null}
      </div>

      <div className="p-5">
        <h3 className="text-xl font-black tracking-tight text-[#18392B]">
          {business.name}
        </h3>

        {address ? (
          <p className="mt-2 text-sm leading-6 text-black/55">
            {address}
          </p>
        ) : null}

        {business.description ? (
          <p className="mt-3 line-clamp-2 text-sm leading-6 text-black/55">
            {business.description}
          </p>
        ) : null}

        <div className="mt-5 flex items-center justify-between gap-3">
          {business.googleMapsUrl ? (
            <a
              href={business.googleMapsUrl}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-bold text-[#6A8A5E] underline underline-offset-4"
            >
              Directions
            </a>
          ) : (
            <span />
          )}

          <Link
            href={`/stores/${encodeURIComponent(
              business.id,
            )}`}
            className="rounded-full bg-[#18392B] px-4 py-2 text-sm font-black text-white transition hover:bg-[#10271D]"
          >
            View business
          </Link>
        </div>
      </div>
    </div>
  );
}