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
