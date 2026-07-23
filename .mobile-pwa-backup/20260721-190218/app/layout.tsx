import { Suspense } from "react";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import "mapbox-gl/dist/mapbox-gl.css";
import { AuthProvider } from "@/components/auth/auth-provider";
import { AuthModal } from "@/components/auth/auth-modal";

export const metadata: Metadata = {
  title: {
    default: "ClaimEat",
    template: "%s | ClaimEat",
  },
  description: "Good food nearby, claimed in time.",
  applicationName: "ClaimEat",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico?v=4", sizes: "any" },
      { url: "/favicon-32x32.png?v=4", sizes: "32x32", type: "image/png" },
      { url: "/favicon-64x64.png?v=4", sizes: "64x64", type: "image/png" },
      { url: "/icon.png?v=4", sizes: "512x512", type: "image/png" },
    ],
    shortcut: [{ url: "/favicon.ico?v=4" }],
    apple: [
      { url: "/apple-icon.png?v=4", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    title: "ClaimEat",
    description: "Good food nearby, claimed in time.",
    siteName: "ClaimEat",
    type: "website",
    images: [
      {
        url: "/brand/claim-eat-logo.png",
        width: 1200,
        height: 630,
        alt: "ClaimEat",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ClaimEat",
    description: "Good food nearby, claimed in time.",
    images: ["/brand/claim-eat-logo.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#6f7d43",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body><AuthProvider>
          {children}
          <Suspense fallback={null}>
          <AuthModal />
        </Suspense>
        </AuthProvider></body>
    </html>
  );
}
