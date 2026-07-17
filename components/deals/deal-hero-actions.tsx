"use client";

import {
  ArrowLeft,
  Check,
  Heart,
  Share2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useState,
} from "react";

const FAVORITES_STORAGE_KEY =
  "claimeat:favourite-deals";

type DealHeroActionsProps = {
  dealId: string;
  title: string;
};

function readFavorites(): string[] {
  try {
    const stored = window.localStorage.getItem(
      FAVORITES_STORAGE_KEY,
    );

    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored);

    return Array.isArray(parsed)
      ? parsed.filter(
          (value): value is string =>
            typeof value === "string",
        )
      : [];
  } catch {
    return [];
  }
}

export function DealHeroActions({
  dealId,
  title,
}: DealHeroActionsProps) {
  const router = useRouter();

  const [favorite, setFavorite] =
    useState(false);

  const [copied, setCopied] =
    useState(false);

  useEffect(() => {
    setFavorite(
      readFavorites().includes(dealId),
    );
  }, [dealId]);

  function handleBack() {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push("/deals");
  }

  function toggleFavorite() {
    const currentFavorites =
      readFavorites();

    const nextFavorites =
      currentFavorites.includes(dealId)
        ? currentFavorites.filter(
            (id) => id !== dealId,
          )
        : [...currentFavorites, dealId];

    window.localStorage.setItem(
      FAVORITES_STORAGE_KEY,
      JSON.stringify(nextFavorites),
    );

    setFavorite(
      nextFavorites.includes(dealId),
    );
  }

  async function handleShare() {
    const url = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title,
          text: `Take a look at this rescue offer on ClaimEat.`,
          url,
        });

        return;
      }

      await navigator.clipboard.writeText(
        url,
      );

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch (error) {
      if (
        error instanceof DOMException &&
        error.name === "AbortError"
      ) {
        return;
      }

      console.error(
        "Could not share deal:",
        error,
      );
    }
  }

  const actionClassName =
    "grid h-11 w-11 place-items-center rounded-full border border-white/45 bg-white/92 text-[#18392B] shadow-[0_8px_28px_rgba(0,0,0,0.18)] backdrop-blur-md transition hover:scale-105 hover:bg-white active:scale-95";

  return (
    <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between p-4 sm:p-5">
      <button
        type="button"
        onClick={handleBack}
        className={actionClassName}
        aria-label="Go back"
      >
        <ArrowLeft size={21} />
      </button>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={toggleFavorite}
          className={[
            actionClassName,
            favorite
              ? "text-[#C76F56]"
              : "",
          ].join(" ")}
          aria-label={
            favorite
              ? "Remove from favorites"
              : "Add to favorites"
          }
          aria-pressed={favorite}
        >
          <Heart
            size={21}
            fill={
              favorite
                ? "currentColor"
                : "none"
            }
          />
        </button>

        <button
          type="button"
          onClick={handleShare}
          className={actionClassName}
          aria-label="Share offer"
        >
          {copied ? (
            <Check size={21} />
          ) : (
            <Share2 size={21} />
          )}
        </button>
      </div>
    </div>
  );
}