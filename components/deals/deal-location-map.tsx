"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

type DealLocationMapProps = {
  latitude: number;
  longitude: number;
  businessName: string;
};

const mapboxToken =
  process.env.NEXT_PUBLIC_MAPBOX_TOKEN ||
  process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

function createMarkerElement() {
  const marker = document.createElement("div");

  marker.className =
    "grid h-12 w-12 place-items-center rounded-full border-4 border-white bg-[#18392B] shadow-[0_10px_28px_rgba(0,0,0,0.25)]";

  marker.innerHTML = `
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      fill="none"
      stroke="white"
      stroke-width="2.4"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"></path>
      <circle cx="12" cy="10" r="2.5"></circle>
    </svg>
  `;

  return marker;
}

export function DealLocationMap({
  latitude,
  longitude,
  businessName,
}: DealLocationMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

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
      center: [longitude, latitude],
      zoom: 14.4,
      interactive: false,
      attributionControl: false,
    });

    const markerElement = createMarkerElement();

    markerElement.setAttribute(
      "aria-label",
      `${businessName} location`,
    );

    new mapboxgl.Marker({
      element: markerElement,
      anchor: "bottom",
    })
      .setLngLat([longitude, latitude])
      .addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [
    businessName,
    latitude,
    longitude,
  ]);

  if (!mapboxToken) {
    return (
      <div className="grid h-56 place-items-center bg-[#EEF1E3] text-sm font-semibold text-[#6B6258]">
        Map unavailable
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="h-56 w-full bg-[#EEF1E3]"
    />
  );
}