import Link from "next/link";
import { LogoutButton } from "@/components/auth/logout-button";

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
          <Link
            href="/my-claims"
            className="profile-menu__link"
          >
            My claims
          </Link>
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

      <div className="profile-section">
        <h2>Account</h2>

        <div className="profile-menu">
          <LogoutButton />
        </div>
      </div>
    </section>
  );
}
