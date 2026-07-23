"use client";

import Link from "next/link";
import {
  ArrowLeft,
  BriefcaseBusiness,
  LoaderCircle,
  LockKeyhole,
  Store,
} from "lucide-react";
import type {
  PropsWithChildren,
  ReactNode,
} from "react";

import { useAuth } from "@/components/auth/auth-provider";

export function BusinessGate({
  children,
}: PropsWithChildren) {
  const {
    user,
    loading,
    isBusiness,
  } = useAuth();

  if (loading) {
    return (
      <BusinessGateLoading />
    );
  }

  /*
   * The global route gate normally handles
   * this state. This remains as a fallback.
   */
  if (!user) {
    return (
      <BusinessAccessCard
        icon={<LockKeyhole size={28} />}
        eyebrow="Sign in required"
        title="Log in to ClaimEat"
        text="You need an authenticated business account to open these tools."
        primaryHref="/login?next=/business"
        primaryLabel="Log in"
      />
    );
  }

  if (!isBusiness) {
    return (
      <BusinessAccessCard
        icon={
          <BriefcaseBusiness
            size={28}
          />
        }
        eyebrow="Business access"
        title="Business account required"
        text="This area is reserved for shops, cafés, bakeries and other ClaimEat partners."
        primaryHref="/for-businesses"
        primaryLabel="Business information"
        secondaryHref="/deals"
        secondaryLabel="Return to deals"
      />
    );
  }

  return <>{children}</>;
}

function BusinessGateLoading() {
  return (
    <main className="grid min-h-[100dvh] place-items-center bg-[#F5F2EB] px-6">
      <div className="text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-[1.35rem] bg-[#18392B] text-white">
          <Store
            size={27}
            aria-hidden="true"
          />
        </span>

        <LoaderCircle
          size={22}
          className="mx-auto mt-5 animate-spin text-[#6F7D43]"
          aria-hidden="true"
        />

        <p className="mt-3 text-sm font-black text-[#18392B]">
          Checking business access…
        </p>
      </div>
    </main>
  );
}

function BusinessAccessCard({
  icon,
  eyebrow,
  title,
  text,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
}: {
  icon: ReactNode;
  eyebrow: string;
  title: string;
  text: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}) {
  return (
    <main className="grid min-h-[100dvh] place-items-center bg-[#F5F2EB] px-5 py-10">
      <section className="w-full max-w-sm rounded-[1.8rem] border border-black/[0.07] bg-white p-6 text-center shadow-[0_14px_38px_rgba(35,39,31,0.08)]">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-[1.35rem] bg-[#E9EDDD] text-[#18392B]">
          {icon}
        </span>

        <p className="mt-5 text-[10px] font-black uppercase tracking-[0.12em] text-[#6F7D43]">
          {eyebrow}
        </p>

        <h1 className="mt-2 text-2xl font-black tracking-[-0.04em] text-[#23271F]">
          {title}
        </h1>

        <p className="mt-3 text-sm leading-6 text-black/50">
          {text}
        </p>

        <Link
          href={primaryHref}
          className="mt-6 flex min-h-12 w-full items-center justify-center rounded-xl bg-[#18392B] px-5 text-sm font-black text-white"
        >
          {primaryLabel}
        </Link>

        {secondaryHref &&
        secondaryLabel ? (
          <Link
            href={secondaryHref}
            className="mt-2 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-black/[0.05] px-5 text-sm font-black text-black/55"
          >
            <ArrowLeft
              size={16}
              aria-hidden="true"
            />

            {secondaryLabel}
          </Link>
        ) : null}
      </section>
    </main>
  );
}
