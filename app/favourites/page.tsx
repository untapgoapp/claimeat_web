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
