"use client";

import Link from "next/link";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import mapboxgl from "mapbox-gl";
import type {
  FeatureCollection,
  Point,
} from "geojson";

import type { MapDeal } from "@/lib/types";
import {
  categoryLabel,
  formatMoney,
  formatPickupWindow,
  getSavingPercent,
  inferMapCategory,
} from "@/lib/utils/format";

type Coordinates = {
  lat: number;
  lng: number;
};

type DealMapProps = {
  deals: MapDeal[];
  selectedDealId: string | null;
  onSelectDeal: (dealId: string | null) => void;
  heightClassName?: string;
  fullBleed?: boolean;
  focusLocation?: Coordinates | null;
  radiusKm?: number;
};

type MappableDeal = MapDeal & {
  lat: number;
  lng: number;
};

type DealMapProperties = {
  id: string;
  selected: boolean;
};

const DEFAULT_CENTER: [number, number] = [
  24.505,
  58.384,
];

const DEFAULT_ZOOM = 12.4;

const SOURCE_ID = "claimeat-deals";

const CLUSTER_HALO_LAYER_ID =
  "claimeat-deal-cluster-halo";

const CLUSTER_LAYER_ID =
  "claimeat-deal-clusters";

const CLUSTER_COUNT_LAYER_ID =
  "claimeat-deal-cluster-count";

const PIN_LAYER_ID =
  "claimeat-deal-pins";

const SELECTED_PIN_LAYER_ID =
  "claimeat-selected-deal-pin";

const DEFAULT_PIN_IMAGE_ID =
  "claimeat-deal-pin-default";

const SELECTED_PIN_IMAGE_ID =
  "claimeat-deal-pin-selected";

const mapboxToken =
  process.env.NEXT_PUBLIC_MAPBOX_TOKEN ||
  process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

function toMappableDeal(
  deal: MapDeal,
): MappableDeal | null {
  if (
    deal.latitude === null ||
    deal.latitude === undefined ||
    deal.longitude === null ||
    deal.longitude === undefined
  ) {
    return null;
  }

  const lat = Number(deal.latitude);
  const lng = Number(deal.longitude);

  if (
    !Number.isFinite(lat) ||
    !Number.isFinite(lng)
  ) {
    return null;
  }

  return {
    ...deal,
    lat,
    lng,
  };
}

function getMapZoomForRadius(
  radiusKm: number,
) {
  if (radiusKm <= 2) return 14;
  if (radiusKm <= 5) return 13;
  if (radiusKm <= 10) return 12;
  if (radiusKm <= 25) return 10.8;
  if (radiusKm <= 50) return 9.6;
  if (radiusKm <= 75) return 8.8;

  return 8;
}

function createDealPinImage(
  selected: boolean,
): ImageData {
  const width = selected ? 46 : 40;
  const height = selected ? 56 : 50;

  const canvas =
    document.createElement("canvas");

  canvas.width = width;
  canvas.height = height;

  const context =
    canvas.getContext("2d");

  if (!context) {
    throw new Error(
      "Could not create deal pin image",
    );
  }

  const centerX = width / 2;
  const centerY = selected ? 18 : 17;
  const radius = selected ? 15 : 13;

  context.clearRect(
    0,
    0,
    width,
    height,
  );

  context.save();

  context.shadowColor =
    "rgba(24, 57, 43, 0.24)";

  context.shadowBlur = selected
    ? 9
    : 7;

  context.shadowOffsetY = 4;

  context.beginPath();

  context.moveTo(
    centerX,
    height - 3,
  );

  context.bezierCurveTo(
    centerX - 3,
    height - 12,
    centerX - radius,
    centerY + radius * 0.72,
    centerX - radius,
    centerY,
  );

  context.arc(
    centerX,
    centerY,
    radius,
    Math.PI,
    0,
    false,
  );

  context.bezierCurveTo(
    centerX + radius,
    centerY + radius * 0.72,
    centerX + 3,
    height - 12,
    centerX,
    height - 3,
  );

  context.closePath();

  context.fillStyle = selected
    ? "#C76F56"
    : "#18392B";

  context.fill();

  context.restore();

  context.lineWidth = selected
    ? 3
    : 2.5;

  context.strokeStyle = "#FFFFFF";
  context.stroke();

  context.beginPath();

  context.arc(
    centerX,
    centerY,
    selected ? 6 : 5.5,
    0,
    Math.PI * 2,
  );

  context.fillStyle = "#FFFFFF";
  context.fill();

  return context.getImageData(
    0,
    0,
    width,
    height,
  );
}

function ensurePinImages(
  map: mapboxgl.Map,
) {
  if (!map.hasImage(DEFAULT_PIN_IMAGE_ID)) {
    map.addImage(
      DEFAULT_PIN_IMAGE_ID,
      createDealPinImage(false),
    );
  }

  if (!map.hasImage(SELECTED_PIN_IMAGE_ID)) {
    map.addImage(
      SELECTED_PIN_IMAGE_ID,
      createDealPinImage(true),
    );
  }
}

function buildDealGeoJson(
  deals: MappableDeal[],
  selectedDealId: string | null,
): FeatureCollection<
  Point,
  DealMapProperties
> {
  return {
    type: "FeatureCollection",

    features: deals.map((deal) => ({
      type: "Feature",
      id: deal.id,

      geometry: {
        type: "Point",
        coordinates: [
          deal.lng,
          deal.lat,
        ],
      },

      properties: {
        id: deal.id,
        selected:
          deal.id === selectedDealId,
      },
    })),
  };
}

function addDealLayers(
  map: mapboxgl.Map,
) {
  if (
    !map.getLayer(CLUSTER_HALO_LAYER_ID)
  ) {
    map.addLayer({
      id: CLUSTER_HALO_LAYER_ID,
      type: "circle",
      source: SOURCE_ID,

      filter: [
        "has",
        "point_count",
      ],

      paint: {
        "circle-color": "#18392B",

        "circle-radius": [
          "step",
          ["get", "point_count"],
          24,
          10,
          28,
          25,
          32,
        ],

        "circle-opacity": 0.14,
      },
    });
  }

  if (!map.getLayer(CLUSTER_LAYER_ID)) {
    map.addLayer({
      id: CLUSTER_LAYER_ID,
      type: "circle",
      source: SOURCE_ID,

      filter: [
        "has",
        "point_count",
      ],

      paint: {
        "circle-color": "#18392B",

        "circle-radius": [
          "step",
          ["get", "point_count"],
          17,
          10,
          20,
          25,
          23,
        ],

        "circle-stroke-width": 2.5,
        "circle-stroke-color": "#FFFFFF",
        "circle-opacity": 0.97,
      },
    });
  }

  if (
    !map.getLayer(
      CLUSTER_COUNT_LAYER_ID,
    )
  ) {
    map.addLayer({
      id: CLUSTER_COUNT_LAYER_ID,
      type: "symbol",
      source: SOURCE_ID,

      filter: [
        "has",
        "point_count",
      ],

      layout: {
        "text-field": [
          "get",
          "point_count_abbreviated",
        ],

        "text-size": 12,

        "text-font": [
          "DIN Offc Pro Bold",
          "Arial Unicode MS Bold",
        ],

        "text-allow-overlap": true,
        "text-ignore-placement": true,
      },

      paint: {
        "text-color": "#FFFFFF",
      },
    });
  }

  if (!map.getLayer(PIN_LAYER_ID)) {
    map.addLayer({
      id: PIN_LAYER_ID,
      type: "symbol",
      source: SOURCE_ID,

      filter: [
        "all",
        [
          "!",
          ["has", "point_count"],
        ],
        [
          "==",
          ["get", "selected"],
          false,
        ],
      ],

      layout: {
        "icon-image": DEFAULT_PIN_IMAGE_ID,
        "icon-anchor": "bottom",
        "icon-size": 1,
        "icon-allow-overlap": false,
        "icon-ignore-placement": false,
      },
    });
  }

  if (
    !map.getLayer(
      SELECTED_PIN_LAYER_ID,
    )
  ) {
    map.addLayer({
      id: SELECTED_PIN_LAYER_ID,
      type: "symbol",
      source: SOURCE_ID,

      filter: [
        "all",
        [
          "!",
          ["has", "point_count"],
        ],
        [
          "==",
          ["get", "selected"],
          true,
        ],
      ],

      layout: {
        "icon-image": SELECTED_PIN_IMAGE_ID,
        "icon-anchor": "bottom",
        "icon-size": 1,
        "icon-allow-overlap": true,
        "icon-ignore-placement": true,
      },
    });
  }
}

type ClusterExpansionFunction = (
  clusterId: number,
  callback?: (
    error: Error | null,
    zoom: number,
  ) => void,
) => Promise<number> | void;

function getClusterExpansionZoom(
  source: mapboxgl.GeoJSONSource,
  clusterId: number,
): Promise<number> {
  return new Promise(
    (resolve, reject) => {
      let settled = false;

      function resolveOnce(
        zoom: number,
      ) {
        if (settled) return;

        settled = true;
        resolve(zoom);
      }

      function rejectOnce(
        error: unknown,
      ) {
        if (settled) return;

        settled = true;

        reject(
          error instanceof Error
            ? error
            : new Error(
                "Could not expand map cluster",
              ),
        );
      }

      try {
        const expansionFunction =
          source.getClusterExpansionZoom.bind(
            source,
          ) as unknown as ClusterExpansionFunction;

        const result =
          expansionFunction(
            clusterId,
            (
              error: Error | null,
              zoom: number,
            ) => {
              if (error) {
                rejectOnce(error);
                return;
              }

              resolveOnce(zoom);
            },
          );

        if (
          result &&
          typeof result.then === "function"
        ) {
          result
            .then(resolveOnce)
            .catch(rejectOnce);
        }
      } catch (error) {
        rejectOnce(error);
      }
    },
  );
}

export default function DealMap({
  deals,
  selectedDealId,
  onSelectDeal,
  heightClassName = "h-[620px]",
  fullBleed = false,
  focusLocation = null,
  radiusKm = 25,
}: DealMapProps) {
  const containerRef =
    useRef<HTMLDivElement | null>(
      null,
    );

  const mapRef =
    useRef<mapboxgl.Map | null>(
      null,
    );

  const viewportInitializedRef =
    useRef(false);

  const [mapReady, setMapReady] =
    useState(false);

  const mappableDeals = useMemo(
    () => {
      return deals
        .map(toMappableDeal)
        .filter(
          (
            deal,
          ): deal is MappableDeal =>
            deal !== null,
        );
    },
    [deals],
  );

  const selectedDeal = useMemo(
    () => {
      return (
        mappableDeals.find(
          (deal) =>
            deal.id === selectedDealId,
        ) || null
      );
    },
    [
      mappableDeals,
      selectedDealId,
    ],
  );

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

    mapboxgl.accessToken =
      mapboxToken;

    const map =
      new mapboxgl.Map({
        container:
          containerRef.current,

        style:
          "mapbox://styles/mapbox/light-v11",

        center: DEFAULT_CENTER,
        zoom: DEFAULT_ZOOM,
        minZoom: 4,
        maxZoom: 18,

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

    function handleLoad() {
      setMapReady(true);
    }

    map.on("load", handleLoad);

    mapRef.current = map;

    return () => {
      map.off(
        "load",
        handleLoad,
      );

      map.remove();

      mapRef.current = null;
      viewportInitializedRef.current =
        false;
    };
  }, []);

  useEffect(() => {
    const currentMap = mapRef.current;

    if (!currentMap || !mapReady) {
      return;
    }

    const map: mapboxgl.Map =
      currentMap;

    ensurePinImages(map);

    const geoJson =
      buildDealGeoJson(
        mappableDeals,
        selectedDealId,
      );

    const existingSource =
      map.getSource(
        SOURCE_ID,
      ) as
        | mapboxgl.GeoJSONSource
        | undefined;

    if (existingSource) {
      existingSource.setData(
        geoJson,
      );
    } else {
      map.addSource(SOURCE_ID, {
        type: "geojson",
        data: geoJson,

        cluster: true,
        clusterRadius: 58,
        clusterMaxZoom: 15,
      });
    }

    addDealLayers(map);

    if (
      mappableDeals.length === 0
    ) {
      onSelectDeal(null);
      return;
    }

    if (selectedDeal) {
      map.easeTo({
        center: [
          selectedDeal.lng,
          selectedDeal.lat,
        ],

        zoom: Math.max(
          map.getZoom(),
          14,
        ),

        duration: 450,
      });

      return;
    }

    if (focusLocation) {
      map.easeTo({
        center: [
          focusLocation.lng,
          focusLocation.lat,
        ],

        zoom:
          getMapZoomForRadius(
            radiusKm,
          ),

        duration: 550,
      });

      viewportInitializedRef.current =
        true;

      return;
    }

    if (
      viewportInitializedRef.current
    ) {
      return;
    }

    viewportInitializedRef.current =
      true;

    if (fullBleed) {
      map.easeTo({
        center: DEFAULT_CENTER,
        zoom: DEFAULT_ZOOM,
        duration: 450,
      });

      return;
    }

    const firstDeal =
      mappableDeals[0];

    if (
      mappableDeals.length === 1
    ) {
      map.easeTo({
        center: [
          firstDeal.lng,
          firstDeal.lat,
        ],

        zoom: 14,
        duration: 450,
      });

      return;
    }

    const bounds =
      new mapboxgl.LngLatBounds();

    mappableDeals.forEach(
      (deal) => {
        bounds.extend([
          deal.lng,
          deal.lat,
        ]);
      },
    );

    map.fitBounds(bounds, {
      padding: 80,
      maxZoom: 13.5,
      duration: 550,
    });
  }, [
    focusLocation,
    fullBleed,
    mapReady,
    mappableDeals,
    onSelectDeal,
    radiusKm,
    selectedDeal,
    selectedDealId,
  ]);

  useEffect(() => {
    const currentMap = mapRef.current;

    if (!currentMap || !mapReady) {
      return;
    }

    const map: mapboxgl.Map =
      currentMap;

    function getInteractiveLayers() {
      return [
        CLUSTER_COUNT_LAYER_ID,
        CLUSTER_LAYER_ID,
        SELECTED_PIN_LAYER_ID,
        PIN_LAYER_ID,
      ].filter((layerId) =>
        Boolean(
          map.getLayer(layerId),
        ),
      );
    }

    async function handleMapClick(
      event: mapboxgl.MapMouseEvent,
    ) {
      const layers =
        getInteractiveLayers();

      if (layers.length === 0) {
        onSelectDeal(null);
        return;
      }

      const features =
        map.queryRenderedFeatures(
          event.point,
          {
            layers,
          },
        );

      const feature =
        features[0];

      if (!feature) {
        onSelectDeal(null);
        return;
      }

      const layerId =
        feature.layer?.id;

      const isCluster =
        layerId ===
          CLUSTER_LAYER_ID ||
        layerId ===
          CLUSTER_COUNT_LAYER_ID ||
        Boolean(
          feature.properties
            ?.point_count,
        );

      if (isCluster) {
        if (
          feature.geometry.type !==
          "Point"
        ) {
          return;
        }

        const clusterId = Number(
          feature.properties
            ?.cluster_id,
        );

        const coordinates =
          feature.geometry
            .coordinates as [
            number,
            number,
          ];

        onSelectDeal(null);

        const source =
          map.getSource(
            SOURCE_ID,
          ) as
            | mapboxgl.GeoJSONSource
            | undefined;

        if (
          !source ||
          !Number.isFinite(clusterId)
        ) {
          map.easeTo({
            center: coordinates,
            zoom: Math.min(
              map.getZoom() + 2,
              17,
            ),
            duration: 450,
          });

          return;
        }

        try {
          const expansionZoom =
            await getClusterExpansionZoom(
              source,
              clusterId,
            );

          map.easeTo({
            center: coordinates,

            zoom: Math.min(
              expansionZoom,
              17,
            ),

            duration: 450,
          });
        } catch {
          map.easeTo({
            center: coordinates,

            zoom: Math.min(
              map.getZoom() + 2,
              17,
            ),

            duration: 450,
          });
        }

        return;
      }

      const rawDealId =
        feature.properties?.id;

      if (
        rawDealId === null ||
        rawDealId === undefined
      ) {
        return;
      }

      onSelectDeal(
        String(rawDealId),
      );
    }

    function handleMouseMove(
      event: mapboxgl.MapMouseEvent,
    ) {
      const layers =
        getInteractiveLayers();

      if (layers.length === 0) {
        map.getCanvas().style.cursor =
          "";

        return;
      }

      const features =
        map.queryRenderedFeatures(
          event.point,
          {
            layers,
          },
        );

      map.getCanvas().style.cursor =
        features.length > 0
          ? "pointer"
          : "";
    }

    function handleMouseLeave() {
      map.getCanvas().style.cursor =
        "";
    }

    map.on(
      "click",
      handleMapClick,
    );

    map.on(
      "mousemove",
      handleMouseMove,
    );

    map.on(
      "mouseleave",
      handleMouseLeave,
    );

    return () => {
      map.off(
        "click",
        handleMapClick,
      );

      map.off(
        "mousemove",
        handleMouseMove,
      );

      map.off(
        "mouseleave",
        handleMouseLeave,
      );
    };
  }, [
    mapReady,
    onSelectDeal,
  ]);

  useEffect(() => {
    if (!selectedDealId) {
      return;
    }

    const stillVisible =
      mappableDeals.some(
        (deal) =>
          deal.id === selectedDealId,
      );

    if (!stillVisible) {
      onSelectDeal(null);
    }
  }, [
    mappableDeals,
    onSelectDeal,
    selectedDealId,
  ]);

  if (!mapboxToken) {
    return (
      <div
        className={[
          "grid place-items-center bg-white text-center text-sm text-zinc-500 dark:bg-[#241f1a] dark:text-white/45",

          fullBleed
            ? "h-screen w-screen"
            : `rounded-[1.5rem] border border-black/10 dark:border-white/10 ${heightClassName}`,
        ].join(" ")}
      >
        Missing Mapbox token.
      </div>
    );
  }

  return (
    <div
      className={[
        "relative overflow-hidden bg-white dark:bg-[#241f1a]",

        fullBleed
          ? "h-screen w-screen"
          : `rounded-[1.5rem] border border-black/10 dark:border-white/10 ${heightClassName}`,
      ].join(" ")}
    >
      <div
        ref={containerRef}
        className="h-full w-full"
      />

      {selectedDeal ? (
        <PreviewCard
          deal={selectedDeal}
          fullBleed={fullBleed}
          onClose={() =>
            onSelectDeal(null)
          }
        />
      ) : null}
    </div>
  );
}

function PreviewCard({
  deal,
  fullBleed,
  onClose,
}: {
  deal: MappableDeal;
  fullBleed: boolean;
  onClose: () => void;
}) {
  const savingPercent =
    getSavingPercent(deal);

  const category =
    inferMapCategory(deal);

  return (
    <div
      className={[
        "absolute z-20 w-[min(380px,calc(100vw-32px))] rounded-[1.5rem] border border-black/10 bg-white p-4 shadow-[0_18px_48px_rgba(0,0,0,0.16)] dark:border-white/10 dark:bg-[#241f1a]",

        fullBleed
          ? "bottom-28 left-4 sm:left-6"
          : "bottom-4 left-4",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#6F7D43] dark:text-[#E1E9B8]">
            {categoryLabel[category]}
          </p>

          <h3 className="mt-1 truncate text-lg font-black tracking-tight">
            {deal.title ||
              "Food rescue deal"}
          </h3>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="rounded-full px-2 text-lg leading-none text-zinc-400 hover:text-black dark:hover:text-white"
          aria-label="Close preview"
        >
          ×
        </button>
      </div>

      <div className="mt-3 grid gap-1.5 text-sm text-zinc-600 dark:text-white/55">
        <p className="font-semibold text-black dark:text-white">
          {deal.businessName}
        </p>

        <p className="truncate">
          {deal.address}, {deal.city}
        </p>

        <p>
          {formatPickupWindow(
            deal.pickupStart,
            deal.pickupEnd,
          )}
        </p>
      </div>

      <div className="mt-4 flex items-end justify-between gap-4">
        <div>
          <p className="text-2xl font-black text-[#18392B] dark:text-[#E1E9B8]">
            {formatMoney(deal.price)}
          </p>

          <p className="text-xs text-black/40 line-through dark:text-white/35">
            {formatMoney(
              deal.originalPrice,
            )}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {savingPercent > 0 ? (
            <span className="rounded-full bg-[#C76F56] px-3 py-1 text-xs font-black text-white">
              -{savingPercent}%
            </span>
          ) : null}

          <span className="rounded-full bg-black/[0.055] px-3 py-1 text-sm font-semibold text-zinc-700 dark:bg-white/10 dark:text-white/70">
            {deal.quantityLeft} left
          </span>
        </div>
      </div>

      <Link
        href={`/deals/${deal.id}`}
        className="mt-4 block rounded-full bg-[#18392B] px-4 py-2.5 text-center text-sm font-black text-white transition hover:bg-[#10271D]"
      >
        View deal
      </Link>
    </div>
  );
}