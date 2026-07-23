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
