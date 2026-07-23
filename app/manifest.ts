import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ClaimEat",
    short_name: "ClaimEat",
    description: "Find and rescue good food nearby.",
    start_url: "/deals",
    scope: "/",
    display: "standalone",
    background_color: "#FBFAF6",
    theme_color: "#6A8A5E",
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
