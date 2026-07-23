import { BusinessStoreProfile } from "@/components/business/store/business-store-profile";

export default function BusinessStorePage() {
  return (
    <section className="business-mobile-page">
        <header className="business-page-heading">
          <p>Customer-facing profile</p>

          <h1>Store</h1>

          <span>
            Review the information customers
            see when they open your store.
          </span>
        </header>

        <BusinessStoreProfile />
      </section>
  );
}
