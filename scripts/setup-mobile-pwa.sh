#!/usr/bin/env bash

set -euo pipefail

if [[ ! -f "package.json" || ! -d "app" ]]; then
  echo "❌ Ejecuta este script desde la raíz de claimeat_web."
  exit 1
fi

STAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP_DIR=".mobile-pwa-backup/$STAMP"

mkdir -p "$BACKUP_DIR"

backup_file() {
  local file="$1"

  if [[ -e "$file" ]]; then
    mkdir -p "$BACKUP_DIR/$(dirname "$file")"
    cp -R "$file" "$BACKUP_DIR/$file"
    echo "↪ Backup: $file"
  fi
}

create_file() {
  local file="$1"

  if [[ -e "$file" ]]; then
    echo "⏭ Ya existe, no se toca: $file"
    cat >/dev/null
    return 0
  fi

  mkdir -p "$(dirname "$file")"
  cat > "$file"
  echo "✅ Creado: $file"
}

echo ""
echo "📱 Montando ClaimEat mobile app shell..."
echo ""

# -------------------------------------------------------------------
# Component: Bottom Navigation
# -------------------------------------------------------------------

create_file "components/app-shell/BottomNavigation.tsx" <<'TSX'
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Heart,
  MapPinned,
  ShoppingBag,
  UserRound,
  type LucideIcon,
} from "lucide-react";

type NavigationItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

const navigationItems: NavigationItem[] = [
  {
    href: "/deals",
    label: "Deals",
    icon: ShoppingBag,
  },
  {
    href: "/discover",
    label: "Discover",
    icon: MapPinned,
  },
  {
    href: "/favourites",
    label: "Favourites",
    icon: Heart,
  },
  {
    href: "/profile",
    label: "Profile",
    icon: UserRound,
  },
];

function isRouteActive(pathname: string, href: string): boolean {
  if (href === "/deals") {
    return pathname === "/deals" || pathname.startsWith("/deals/");
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="bottom-navigation" aria-label="Main navigation">
      <div className="bottom-navigation__inner">
        {navigationItems.map(({ href, label, icon: Icon }) => {
          const active = isRouteActive(pathname, href);

          return (
            <Link
              key={href}
              href={href}
              className={`bottom-navigation__item ${
                active ? "bottom-navigation__item--active" : ""
              }`}
              aria-current={active ? "page" : undefined}
            >
              <Icon
                className="bottom-navigation__icon"
                strokeWidth={active ? 2.5 : 2}
                aria-hidden="true"
              />

              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
TSX

# -------------------------------------------------------------------
# Component: Service Worker Registration
# -------------------------------------------------------------------

create_file "components/pwa/ServiceWorkerRegistration.tsx" <<'TSX'
"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if (
      process.env.NODE_ENV !== "production" ||
      !("serviceWorker" in navigator)
    ) {
      return;
    }

    navigator.serviceWorker.register("/sw.js").catch((error: unknown) => {
      console.error("ClaimEat service worker registration failed:", error);
    });
  }, []);

  return null;
}
TSX

# -------------------------------------------------------------------
# Component: Install ClaimEat
# -------------------------------------------------------------------

create_file "components/pwa/InstallClaimEat.tsx" <<'TSX'
"use client";

import { useEffect, useState } from "react";
import { Download, Share } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
}

type NavigatorWithStandalone = Navigator & {
  standalone?: boolean;
};

export default function InstallClaimEat() {
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      Boolean((navigator as NavigatorWithStandalone).standalone);

    setIsInstalled(standalone);
    setIsIOS(/iphone|ipad|ipod/i.test(navigator.userAgent));

    const handleInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    };

    const handleInstalled = () => {
      setInstallPrompt(null);
      setIsInstalled(true);
    };

    window.addEventListener("beforeinstallprompt", handleInstallPrompt);
    window.addEventListener("appinstalled", handleInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleInstallPrompt);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  async function installApp() {
    if (!installPrompt) {
      return;
    }

    await installPrompt.prompt();
    await installPrompt.userChoice;
    setInstallPrompt(null);
  }

  if (isInstalled) {
    return (
      <section className="profile-card">
        <div className="profile-card__icon">
          <Download size={20} aria-hidden="true" />
        </div>

        <div>
          <strong>ClaimEat is installed</strong>
          <p>You are using the app version.</p>
        </div>
      </section>
    );
  }

  if (installPrompt) {
    return (
      <button
        type="button"
        className="install-app-button"
        onClick={installApp}
      >
        <Download size={20} aria-hidden="true" />

        <span>
          <strong>Install ClaimEat</strong>
          <small>Add ClaimEat to your home screen</small>
        </span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <section className="profile-card">
        <div className="profile-card__icon">
          <Share size={20} aria-hidden="true" />
        </div>

        <div>
          <strong>Install ClaimEat</strong>
          <p>
            Tap Share in Safari, then choose “Add to Home Screen”.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="profile-card">
      <div className="profile-card__icon">
        <Download size={20} aria-hidden="true" />
      </div>

      <div>
        <strong>Install ClaimEat</strong>
        <p>Open your browser menu and select “Install app”.</p>
      </div>
    </section>
  );
}
TSX

# -------------------------------------------------------------------
# Component: App Shell
# -------------------------------------------------------------------

create_file "components/app-shell/AppShell.tsx" <<'TSX'
import type { ReactNode } from "react";

import ServiceWorkerRegistration from "../pwa/ServiceWorkerRegistration";
import BottomNavigation from "./BottomNavigation";

type AppShellProps = {
  children: ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="claim-app-shell">
      <ServiceWorkerRegistration />

      <main className="claim-app-content">{children}</main>

      <BottomNavigation />
    </div>
  );
}
TSX

# -------------------------------------------------------------------
# Shared layouts for app routes
# -------------------------------------------------------------------

for route in deals discover favourites profile stores; do
  file="app/$route/layout.tsx"

  if [[ -e "$file" ]]; then
    echo "⏭ Ya existe, no se toca: $file"
    continue
  fi

  mkdir -p "$(dirname "$file")"

  cat > "$file" <<'TSX'
import type { ReactNode } from "react";

import AppShell from "../../components/app-shell/AppShell";

type AppRouteLayoutProps = {
  children: ReactNode;
};

export default function AppRouteLayout({
  children,
}: AppRouteLayoutProps) {
  return <AppShell>{children}</AppShell>;
}
TSX

  echo "✅ Creado: $file"
done

# -------------------------------------------------------------------
# Deals page
# Temporary: reuses current homepage without deleting it.
# -------------------------------------------------------------------

if [[ ! -e "app/deals/page.tsx" ]]; then
  mkdir -p "app/deals"

  cat > "app/deals/page.tsx" <<'TSX'
export { default } from "../page";
TSX

  echo "✅ Creado: app/deals/page.tsx"
else
  echo "⏭ Ya existe, no se toca: app/deals/page.tsx"
fi

# -------------------------------------------------------------------
# Discover page
# Reuses /map if it already exists. Otherwise creates placeholder.
# -------------------------------------------------------------------

if [[ ! -e "app/discover/page.tsx" ]]; then
  mkdir -p "app/discover"

  if [[ -e "app/map/page.tsx" ]]; then
    cat > "app/discover/page.tsx" <<'TSX'
export { default } from "../map/page";
TSX
  else
    cat > "app/discover/page.tsx" <<'TSX'
import { LocateFixed, MapPinned } from "lucide-react";

export default function DiscoverPage() {
  return (
    <section className="mobile-page mobile-page--map">
      <header className="mobile-page__header">
        <div>
          <span className="mobile-page__eyebrow">Pärnu</span>
          <h1>Discover</h1>
        </div>

        <button
          type="button"
          className="mobile-icon-button"
          aria-label="Use my location"
        >
          <LocateFixed size={21} aria-hidden="true" />
        </button>
      </header>

      <div className="map-placeholder">
        <MapPinned size={38} aria-hidden="true" />

        <strong>The ClaimEat map goes here</strong>

        <p>
          We will move the current store and deal map into this screen.
        </p>
      </div>
    </section>
  );
}
TSX
  fi

  echo "✅ Creado: app/discover/page.tsx"
else
  echo "⏭ Ya existe, no se toca: app/discover/page.tsx"
fi

# -------------------------------------------------------------------
# Favourites page
# -------------------------------------------------------------------

create_file "app/favourites/page.tsx" <<'TSX'
import { Heart } from "lucide-react";

export default function FavouritesPage() {
  return (
    <section className="mobile-page">
      <header className="mobile-page__header">
        <div>
          <span className="mobile-page__eyebrow">Saved for later</span>
          <h1>Favourites</h1>
        </div>
      </header>

      <div className="mobile-empty-state">
        <div className="mobile-empty-state__icon">
          <Heart size={30} aria-hidden="true" />
        </div>

        <h2>No favourites yet</h2>

        <p>
          Save stores and deals to find them quickly when new food is
          available.
        </p>

        <a href="/deals" className="mobile-primary-button">
          Browse deals
        </a>
      </div>
    </section>
  );
}
TSX

# -------------------------------------------------------------------
# Profile page
# -------------------------------------------------------------------

create_file "app/profile/page.tsx" <<'TSX'
import InstallClaimEat from "../../components/pwa/InstallClaimEat";

export default function ProfilePage() {
  return (
    <section className="mobile-page">
      <header className="mobile-page__header">
        <div>
          <span className="mobile-page__eyebrow">ClaimEat account</span>
          <h1>Profile</h1>
        </div>
      </header>

      <div className="profile-section">
        <h2>App</h2>
        <InstallClaimEat />
      </div>

      <div className="profile-section">
        <h2>Your ClaimEat</h2>

        <div className="profile-menu">
          <button type="button">My claims</button>
          <button type="button">Notifications</button>
          <button type="button">Location</button>
          <button type="button">Payment methods</button>
        </div>
      </div>

      <div className="profile-section">
        <h2>Information</h2>

        <div className="profile-information">
          <details>
            <summary>How ClaimEat works</summary>

            <div>
              <p>
                Find good food nearby, claim it before it is gone and
                collect it during the pickup window.
              </p>
            </div>
          </details>

          <details>
            <summary>About ClaimEat</summary>

            <div>
              <p>
                ClaimEat helps local businesses sell food that is still
                good instead of throwing it away.
              </p>
            </div>
          </details>

          <details>
            <summary>Help and support</summary>

            <div>
              <p>
                Support information and contact options will appear here.
              </p>
            </div>
          </details>
        </div>
      </div>
    </section>
  );
}
TSX

# -------------------------------------------------------------------
# Offline page
# -------------------------------------------------------------------

create_file "app/offline/page.tsx" <<'TSX'
import { WifiOff } from "lucide-react";

export default function OfflinePage() {
  return (
    <main className="offline-page">
      <div className="offline-page__icon">
        <WifiOff size={36} aria-hidden="true" />
      </div>

      <h1>You are offline</h1>

      <p>
        Check your connection and try again. Previously loaded information
        may still be available.
      </p>

      <a href="/deals" className="mobile-primary-button">
        Try again
      </a>
    </main>
  );
}
TSX

# -------------------------------------------------------------------
# PWA Manifest
# -------------------------------------------------------------------

create_file "app/manifest.ts" <<'TS'
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/deals",
    name: "ClaimEat",
    short_name: "ClaimEat",
    description: "Find and rescue good food nearby.",
    start_url: "/deals",
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#F7F3EA",
    theme_color: "#6F7D43",
    categories: ["food", "shopping", "lifestyle"],
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-maskable-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-maskable-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "Deals",
        short_name: "Deals",
        url: "/deals",
      },
      {
        name: "Discover",
        short_name: "Discover",
        url: "/discover",
      },
      {
        name: "Favourites",
        short_name: "Favourites",
        url: "/favourites",
      },
    ],
  };
}
TS

# -------------------------------------------------------------------
# Service worker
# -------------------------------------------------------------------

create_file "public/sw.js" <<'JS'
const CACHE_NAME = "claimeat-shell-v1";
const OFFLINE_URL = "/offline";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.add(OFFLINE_URL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter(
              (cacheName) =>
                cacheName.startsWith("claimeat-shell-") &&
                cacheName !== CACHE_NAME
            )
            .map((cacheName) => caches.delete(cacheName))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (
    event.request.method !== "GET" ||
    event.request.mode !== "navigate"
  ) {
    return;
  }

  event.respondWith(
    fetch(event.request).catch(() => caches.match(OFFLINE_URL))
  );
});
JS

# -------------------------------------------------------------------
# Mobile styles
# -------------------------------------------------------------------

backup_file "app/globals.css"

if ! grep -q "CLAIMEAT MOBILE APP SHELL" "app/globals.css"; then
  cat >> "app/globals.css" <<'CSS'


/* ================================================================
   CLAIM EAT MOBILE APP SHELL
   ================================================================ */

:root {
  --claim-app-background: #f7f3ea;
  --claim-app-surface: #ffffff;
  --claim-app-text: #25271f;
  --claim-app-muted: #737768;
  --claim-app-green: #6f7d43;
  --claim-app-green-dark: #576535;
  --claim-app-brown: #b76e45;
  --claim-app-yellow: #f2c94c;
  --claim-app-border: rgba(37, 39, 31, 0.1);
  --claim-app-nav-height: 72px;
}

html {
  min-height: 100%;
  background: var(--claim-app-background);
}

body {
  min-height: 100%;
  overflow-x: hidden;
  background: var(--claim-app-background);
  color: var(--claim-app-text);
  -webkit-tap-highlight-color: transparent;
}

button,
a {
  touch-action: manipulation;
}

.claim-app-shell {
  position: relative;
  width: 100%;
  min-height: 100dvh;
  margin: 0 auto;
  background: var(--claim-app-background);
}

.claim-app-content {
  min-height: 100dvh;
  padding-bottom: calc(
    var(--claim-app-nav-height) + env(safe-area-inset-bottom) + 16px
  );
}

.bottom-navigation {
  position: fixed;
  z-index: 100;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  background: rgba(255, 255, 255, 0.96);
  border-top: 1px solid var(--claim-app-border);
  box-shadow: 0 -8px 30px rgba(37, 39, 31, 0.07);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
}

.bottom-navigation__inner {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  width: 100%;
  max-width: 768px;
  min-height: var(--claim-app-nav-height);
  margin: 0 auto;
  padding: 6px 8px max(8px, env(safe-area-inset-bottom));
}

.bottom-navigation__item {
  display: flex;
  min-width: 0;
  min-height: 56px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 4px;
  color: #85897d;
  font-size: 10px;
  font-weight: 700;
  line-height: 1;
  letter-spacing: 0.035em;
  text-decoration: none;
  text-transform: uppercase;
  transition:
    color 150ms ease,
    transform 150ms ease;
}

.bottom-navigation__item:active {
  transform: scale(0.96);
}

.bottom-navigation__item--active {
  color: var(--claim-app-green);
}

.bottom-navigation__icon {
  width: 23px;
  height: 23px;
}

.mobile-page {
  width: 100%;
  min-height: calc(
    100dvh - var(--claim-app-nav-height) - env(safe-area-inset-bottom)
  );
  padding: env(safe-area-inset-top) 18px 28px;
}

.mobile-page--map {
  display: flex;
  flex-direction: column;
  padding-right: 0;
  padding-bottom: 0;
  padding-left: 0;
}

.mobile-page--map .mobile-page__header {
  padding-right: 18px;
  padding-left: 18px;
}

.mobile-page__header {
  display: flex;
  min-height: 82px;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding-top: 12px;
  padding-bottom: 12px;
}

.mobile-page__header h1 {
  margin: 2px 0 0;
  font-size: clamp(29px, 8vw, 38px);
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.04em;
}

.mobile-page__eyebrow {
  display: block;
  color: var(--claim-app-muted);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
}

.mobile-icon-button {
  display: inline-flex;
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
  padding: 0;
  color: var(--claim-app-text);
  background: var(--claim-app-surface);
  border: 1px solid var(--claim-app-border);
  border-radius: 50%;
  box-shadow: 0 6px 18px rgba(37, 39, 31, 0.07);
}

.mobile-empty-state,
.map-placeholder,
.offline-page {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  text-align: center;
}

.mobile-empty-state {
  min-height: 58vh;
  padding: 36px 22px;
}

.mobile-empty-state__icon,
.offline-page__icon {
  display: flex;
  width: 72px;
  height: 72px;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  color: var(--claim-app-green);
  background: rgba(111, 125, 67, 0.12);
  border-radius: 50%;
}

.mobile-empty-state h2,
.offline-page h1 {
  margin: 0 0 10px;
  font-size: 24px;
  letter-spacing: -0.03em;
}

.mobile-empty-state p,
.offline-page p,
.map-placeholder p {
  max-width: 340px;
  margin: 0;
  color: var(--claim-app-muted);
  line-height: 1.55;
}

.mobile-primary-button {
  display: inline-flex;
  min-height: 48px;
  align-items: center;
  justify-content: center;
  margin-top: 24px;
  padding: 0 22px;
  color: #ffffff;
  background: var(--claim-app-green);
  border: 0;
  border-radius: 999px;
  font-size: 15px;
  font-weight: 750;
  text-decoration: none;
}

.mobile-primary-button:active {
  background: var(--claim-app-green-dark);
}

.map-placeholder {
  flex: 1;
  min-height: 62vh;
  gap: 10px;
  padding: 40px 24px;
  color: var(--claim-app-green);
  background:
    radial-gradient(
      circle at 20% 25%,
      rgba(183, 110, 69, 0.12),
      transparent 26%
    ),
    radial-gradient(
      circle at 78% 68%,
      rgba(111, 125, 67, 0.18),
      transparent 28%
    ),
    #ebe9dd;
}

.map-placeholder strong {
  margin-top: 8px;
  color: var(--claim-app-text);
  font-size: 20px;
}

.profile-section {
  margin-top: 26px;
}

.profile-section > h2 {
  margin: 0 0 10px;
  color: var(--claim-app-muted);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.07em;
  text-transform: uppercase;
}

.profile-menu,
.profile-information {
  overflow: hidden;
  background: var(--claim-app-surface);
  border: 1px solid var(--claim-app-border);
  border-radius: 18px;
}

.profile-menu button {
  display: flex;
  width: 100%;
  min-height: 54px;
  align-items: center;
  padding: 0 16px;
  color: var(--claim-app-text);
  background: transparent;
  border: 0;
  border-bottom: 1px solid var(--claim-app-border);
  font: inherit;
  font-weight: 650;
  text-align: left;
}

.profile-menu button:last-child {
  border-bottom: 0;
}

.profile-information details {
  border-bottom: 1px solid var(--claim-app-border);
}

.profile-information details:last-child {
  border-bottom: 0;
}

.profile-information summary {
  min-height: 54px;
  padding: 17px 16px;
  cursor: pointer;
  font-weight: 650;
}

.profile-information details > div {
  padding: 0 16px 18px;
  color: var(--claim-app-muted);
  line-height: 1.55;
}

.profile-information p {
  margin: 0;
}

.profile-card,
.install-app-button {
  display: flex;
  width: 100%;
  min-height: 72px;
  align-items: center;
  gap: 13px;
  padding: 14px;
  color: var(--claim-app-text);
  background: var(--claim-app-surface);
  border: 1px solid var(--claim-app-border);
  border-radius: 18px;
  text-align: left;
}

.install-app-button {
  cursor: pointer;
  font: inherit;
}

.profile-card__icon {
  display: flex;
  width: 42px;
  height: 42px;
  flex: 0 0 42px;
  align-items: center;
  justify-content: center;
  color: var(--claim-app-green);
  background: rgba(111, 125, 67, 0.12);
  border-radius: 13px;
}

.profile-card strong,
.install-app-button strong {
  display: block;
  font-size: 15px;
}

.profile-card p,
.install-app-button small {
  display: block;
  margin: 3px 0 0;
  color: var(--claim-app-muted);
  font-size: 13px;
  font-weight: 500;
  line-height: 1.35;
}

.offline-page {
  min-height: 100dvh;
  padding:
    calc(32px + env(safe-area-inset-top))
    24px
    calc(32px + env(safe-area-inset-bottom));
  background: var(--claim-app-background);
}

@media (min-width: 769px) {
  .claim-app-shell {
    max-width: 768px;
    box-shadow: 0 0 50px rgba(37, 39, 31, 0.1);
  }

  .bottom-navigation {
    right: auto;
    left: 50%;
    max-width: 768px;
    transform: translateX(-50%);
  }
}
CSS

  echo "✅ Añadidos estilos mobile a app/globals.css"
else
  echo "⏭ Los estilos mobile ya estaban añadidos."
fi

# -------------------------------------------------------------------
# Viewport support for iPhone safe areas
# -------------------------------------------------------------------

if [[ -e "app/layout.tsx" ]]; then
  backup_file "app/layout.tsx"

  python3 <<'PY'
from pathlib import Path

path = Path("app/layout.tsx")
text = path.read_text()

if "export const viewport" in text:
    print("⏭ app/layout.tsx ya contiene viewport.")
else:
    marker = "export default"

    viewport = """
export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#6F7D43",
};

"""

    index = text.find(marker)

    if index == -1:
        print("⚠ No se encontró export default en app/layout.tsx.")
        print("  Añade manualmente el export const viewport.")
    else:
        text = text[:index] + viewport + text[index:]
        path.write_text(text)
        print("✅ Añadido viewport-fit=cover a app/layout.tsx.")
PY
else
  echo "⚠ No existe app/layout.tsx."
fi

# -------------------------------------------------------------------
# Temporary PWA icons
# -------------------------------------------------------------------

mkdir -p public/icons

node <<'NODE'
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const outputDirectory = path.join("public", "icons");

fs.mkdirSync(outputDirectory, { recursive: true });

function iconSvg(maskable = false) {
  const margin = maskable ? 72 : 30;

  return `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="512"
      height="512"
      viewBox="0 0 512 512"
    >
      <rect
        width="512"
        height="512"
        rx="${maskable ? 0 : 112}"
        fill="#F7F3EA"
      />

      <circle
        cx="256"
        cy="${maskable ? 210 : 202}"
        r="70"
        fill="#F2C94C"
      />

      <path
        d="
          M${102 + margin / 4} 242
          H${410 - margin / 4}
          C400 338 340 394 256 394
          C172 394 112 338 ${102 + margin / 4} 242
          Z
        "
        fill="#6F7D43"
      />

      <path
        d="M140 250 H372"
        stroke="#B76E45"
        stroke-width="22"
        stroke-linecap="round"
      />

      <path
        d="M192 184 C210 156 232 145 256 145"
        fill="none"
        stroke="#6F7D43"
        stroke-width="15"
        stroke-linecap="round"
      />

      <path
        d="M320 184 C302 156 280 145 256 145"
        fill="none"
        stroke="#6F7D43"
        stroke-width="15"
        stroke-linecap="round"
      />
    </svg>
  `;
}

const files = [
  {
    filename: "icon-192x192.png",
    size: 192,
    maskable: false,
  },
  {
    filename: "icon-512x512.png",
    size: 512,
    maskable: false,
  },
  {
    filename: "icon-maskable-192x192.png",
    size: 192,
    maskable: true,
  },
  {
    filename: "icon-maskable-512x512.png",
    size: 512,
    maskable: true,
  },
  {
    filename: "apple-touch-icon.png",
    size: 180,
    maskable: false,
  },
];

async function generate() {
  for (const file of files) {
    const output = path.join(outputDirectory, file.filename);

    if (fs.existsSync(output)) {
      console.log(`⏭ Ya existe, no se toca: ${output}`);
      continue;
    }

    await sharp(Buffer.from(iconSvg(file.maskable)))
      .resize(file.size, file.size)
      .png()
      .toFile(output);

    console.log(`✅ Creado: ${output}`);
  }

  if (
    !fs.existsSync("app/icon.png") &&
    !fs.existsSync("app/icon.tsx") &&
    !fs.existsSync("app/icon.ts")
  ) {
    fs.copyFileSync(
      path.join(outputDirectory, "icon-512x512.png"),
      "app/icon.png"
    );

    console.log("✅ Creado: app/icon.png");
  }

  if (
    !fs.existsSync("app/apple-icon.png") &&
    !fs.existsSync("app/apple-icon.tsx") &&
    !fs.existsSync("app/apple-icon.ts")
  ) {
    fs.copyFileSync(
      path.join(outputDirectory, "apple-touch-icon.png"),
      "app/apple-icon.png"
    );

    console.log("✅ Creado: app/apple-icon.png");
  }
}

generate().catch((error) => {
  console.error(error);
  process.exit(1);
});
NODE

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ ClaimEat mobile app shell preparado."
echo "📦 Backup guardado en: $BACKUP_DIR"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
