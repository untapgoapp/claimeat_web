import {
  Clock3,
  ImageIcon,
  MapPin,
  Phone,
  Store,
} from "lucide-react";

import { BusinessGate } from "@/components/business/business-gate";

export default function BusinessStorePage() {
  return (
    <BusinessGate>
      <section className="business-mobile-page">
        <header className="business-page-heading">
          <p>Your public profile</p>
          <h1>Store</h1>

          <span>
            Manage how customers see your business in ClaimEat.
          </span>
        </header>

        <div className="business-store-placeholder">
          <div className="business-store-placeholder__icon">
            <Store
              size={28}
              aria-hidden="true"
            />
          </div>

          <div>
            <h2>Store profile</h2>

            <p>
              Business information will be connected here next.
            </p>
          </div>
        </div>

        <div className="business-store-fields">
          <div>
            <ImageIcon
              size={19}
              aria-hidden="true"
            />
            <span>Logo and cover image</span>
          </div>

          <div>
            <MapPin
              size={19}
              aria-hidden="true"
            />
            <span>Address and map location</span>
          </div>

          <div>
            <Phone
              size={19}
              aria-hidden="true"
            />
            <span>Contact information</span>
          </div>

          <div>
            <Clock3
              size={19}
              aria-hidden="true"
            />
            <span>Opening and pickup hours</span>
          </div>
        </div>
      </section>
    </BusinessGate>
  );
}
