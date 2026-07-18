"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

/* eslint-disable @next/next/no-img-element */

const exploreLinks = [
  { href: "/deals", label: "Deals" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/for-businesses", label: "For businesses" },
];

const companyLinks = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/business", label: "Business dashboard" },
];

const legalLinks = [
  { href: "/terms", label: "Terms" },
  { href: "/privacy", label: "Privacy" },
  { href: "/refunds", label: "Refunds" },
];

const footerSections = [
  {
    title: "Explore",
    links: exploreLinks,
  },
  {
    title: "Company",
    links: companyLinks,
  },
  {
    title: "Legal",
    links: legalLinks,
  },
];

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <p className="text-sm font-black uppercase tracking-[0.16em] text-[#6F7D43] dark:text-[#E1E9B8]">
        {title}
      </p>

      <div className="mt-4 grid gap-3">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-sm font-semibold text-black/55 transition hover:text-black dark:text-white/50 dark:hover:text-white"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export function SiteFooter() {
  const [openSection, setOpenSection] =
    useState<string | null>(null);

  return (
    <footer className="mx-auto max-w-6xl px-4 pb-10 pt-14">
      <div className="border-t border-black/10 pt-6 dark:border-white/10">

        <div className="grid gap-10 md:grid-cols-[1.3fr_0.7fr_0.7fr_0.7fr]">

          {/* Logo */}
          <div>

            <Link href="/" className="inline-flex">
              <img
                src="/brand/claim-eat-logo-no-back.png"
                alt="ClaimEat"
                className="h-auto w-36"
              />
            </Link>

            {/* Mobile accordion */}
            <div className="mt-6 border-t border-black/10 md:hidden dark:border-white/10">
              {footerSections.map((section) => {

                const open =
                  openSection === section.title;

                return (
                  <div key={section.title}>

                    <button
                      type="button"
                      onClick={() =>
                        setOpenSection(
                          open
                            ? null
                            : section.title
                        )
                      }
                      className="
                        flex
                        w-full
                        items-center
                        justify-between
                        py-5
                        text-left
                        text-sm
                        font-black
                      "
                    >
                      {section.title}

                      <ChevronDown
                        className={`
                          h-4
                          w-4
                          transition-transform
                          duration-200
                          ${
                            open
                              ? "rotate-180"
                              : ""
                          }
                        `}
                      />

                    </button>

                    <div
                      className={`
                        grid
                        overflow-hidden
                        transition-[grid-template-rows,opacity]
                        duration-300
                        ease-out
                        ${
                          open
                            ? "grid-rows-[1fr] opacity-100"
                            : "grid-rows-[0fr] opacity-0"
                        }
                      `}
                    >

                      <div className="min-h-0 pb-4 pt-1">

                        <div className="grid gap-3">

                          {section.links.map((link) => (
                            <Link
                              key={link.href}
                              href={link.href}
                              className="
                                text-sm
                                font-semibold
                                text-black/55
                                transition
                                hover:text-black
                                dark:text-white/50
                                dark:hover:text-white
                              "
                            >
                              {link.label}
                            </Link>
                          ))}

                        </div>

                      </div>

                    </div>

                  </div>
                );

              })}
            </div>

          </div>

          {/* Desktop */}
          <div className="hidden md:block">
            <FooterColumn
              title="Explore"
              links={exploreLinks}
            />
          </div>

          <div className="hidden md:block">
            <FooterColumn
              title="Company"
              links={companyLinks}
            />
          </div>

          <div className="hidden md:block">
            <FooterColumn
              title="Legal"
              links={legalLinks}
            />
          </div>

        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-black/10 pt-6 text-sm text-black/40 dark:border-white/10 dark:text-white/35 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} ClaimEat.
          </p>

          <p>
            Less waste. Better value. Local pickup.
          </p>
        </div>

      </div>
    </footer>
  );
}