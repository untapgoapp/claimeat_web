"use client";

import Link from "next/link";
import { PropsWithChildren } from "react";
import { useAuth } from "@/components/auth/auth-provider";

export function BusinessGate({ children }: PropsWithChildren) {
  const { user, loading, isBusiness } = useAuth();

  if (loading) {
    return (
      <div className="rounded-[1.75rem] bg-white p-8 text-center shadow-[0_10px_30px_rgba(95,78,55,0.08)] ring-1 ring-[#DDD2C2] dark:bg-[#241f1a] dark:ring-white/10">
        <p className="text-xl font-black">Checking access...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <AccessCard
        title="Log in to access business tools"
        text="Business dashboards are only available to logged-in business users."
        href="?auth=login"
        label="Log in"
      />
    );
  }

  if (!isBusiness) {
    return (
      <AccessCard
        title="Business account required"
        text="This area is for shops, cafes, bakeries, and other ClaimEat business partners."
        href="/for-businesses"
        label="Learn about selling"
      />
    );
  }

  return <>{children}</>;
}

function AccessCard({
  title,
  text,
  href,
  label,
}: {
  title: string;
  text: string;
  href: string;
  label: string;
}) {
  return (
    <div className="mx-auto max-w-xl rounded-[1.75rem] bg-white p-8 text-center shadow-[0_10px_30px_rgba(95,78,55,0.08)] ring-1 ring-[#DDD2C2] dark:bg-[#241f1a] dark:ring-white/10">
      <p className="text-3xl font-black tracking-tight">{title}</p>
      <p className="mt-3 leading-7 text-black/55 dark:text-white/45">{text}</p>

      <Link
        href={href}
        className="mt-6 inline-flex rounded-full bg-[#6F7D43] px-6 py-3 font-black text-white dark:bg-[#9baa6a] dark:text-[#2F261F]"
      >
        {label}
      </Link>
    </div>
  );
}
