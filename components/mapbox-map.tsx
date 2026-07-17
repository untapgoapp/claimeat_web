"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { MapDeal } from "@/lib/types";

function formatTime(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function createMarkerElement(price: number) {
  const element = document.createElement("div");

  element.style.height = "42px";
  element.style.minWidth = "56px";
  element.style.padding = "0 10px";
  element.style.borderRadius = "999px";
  element.style.background = "#6f7d43";
  element.style.color = "white";
  element.style.display = "flex";
  element.style.alignItems = "center";
  element.style.justifyContent = "center";
  element.style.fontWeight = "800";
  element.style.fontSize = "14px";
  element.style.boxShadow = "0 10px 25px rgba(0,0,0,0.25)";
  element.style.border = "3px solid white";
  element.style.cursor = "pointer";
  element.innerText = `€${price.toFixed(2)}`;

  return element;
}

function popupHtml(deal: MapDeal) {
  return `
    <div style="width: 230px; font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;">
      <p style="margin: 0; font-size: 11px; font-weight: 800; text-transform: uppercase; color: #6f7d43;">
        ${deal.businessName}
      </p>

      <h3 style="margin: 6px 0 0; font-size: 17px; line-height: 1.2;">
        ${deal.title}
      </h3>

      <p style="margin: 6px 0 0; font-size: 13px; color: rgba(0,0,0,0.6);">
        ${deal.address}, ${deal.city}
      </p>

      <div style="display: flex; align-items: end; justify-content: space-between; margin-top: 14px;">
        <div>
          <p style="margin: 0; font-size: 22px; font-weight: 900; color: #5d6d32;">
            €${deal.price.toFixed(2)}
          </p>
          <p style="margin: 0; font-size: 12px; color: rgba(0,0,0,0.4); text-decoration: line-through;">
            €${deal.originalPrice.toFixed(2)}
          </p>
        </div>

        <p style="margin: 0; font-size: 12px; font-weight: 700; color: rgba(0,0,0,0.55);">
          ${deal.quantityLeft} left
        </p>
      </div>

      <p style="margin: 10px 0 0; font-size: 12px; color: rgba(0,0,0,0.55);">
        Pickup ${formatTime(deal.pickupStart)}-${formatTime(deal.pickupEnd)}
      </p>

      <a
        href="/deals/${deal.id}"
        style="
          display: block;
          margin-top: 12px;
          border-radius: 14px;
          background: #6f7d43;
          color: white;
          padding: 10px 12px;
          text-align: center;
          text-decoration: none;
          font-weight: 800;
          font-size: 14px;
        "
      >
        View deal
      </a>
    </div>
  `;
}

export function MapboxMap({ deals }: { deals: MapDeal[] }) {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

    if (!containerRef.current || !token || mapRef.current) return;

    mapboxgl.accessToken = token;

    const center: [number, number] =
      deals.length > 0
        ? [deals[0].longitude, deals[0].latitude]
        : [24.4971, 58.3859];

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center,
      zoom: 13,
    });

    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    const bounds = new mapboxgl.LngLatBounds();

    deals.forEach((deal) => {
      const lngLat: [number, number] = [deal.longitude, deal.latitude];

      bounds.extend(lngLat);

      const marker = new mapboxgl.Marker({
        element: createMarkerElement(deal.price),
        anchor: "bottom",
      })
        .setLngLat(lngLat)
        .setPopup(
          new mapboxgl.Popup({
            offset: 24,
            closeButton: true,
            maxWidth: "280px",
          }).setHTML(popupHtml(deal))
        )
        .addTo(map);
    });

    if (deals.length > 1) {
      map.fitBounds(bounds, {
        padding: 80,
        maxZoom: 14,
      });
    }

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [deals]);

  return (
    <div className="overflow-hidden rounded-[1.75rem] bg-white shadow-[0_10px_30px_rgba(95,78,55,0.08)] ring-1 ring-[#DDD2C2] dark:bg-[#241f1a] dark:ring-white/10">
      <div ref={containerRef} className="h-[620px] w-full" />
    </div>
  );
}
