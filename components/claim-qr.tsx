"use client";

import { QRCodeSVG } from "qrcode.react";

export function ClaimQr({
  value,
  className = "",
}: {
  value: string;
  className?: string;
}) {
  return (
    <div
      className={[
        "mx-auto aspect-square w-full max-w-[260px] rounded-[1.5rem] bg-white p-4 shadow-[0_10px_32px_rgba(35,39,31,0.08)]",
        className,
      ].join(" ")}
    >
      <QRCodeSVG
        value={value}
        size={256}
        level="M"
        role="img"
        aria-label="Pickup QR code"
        className="block h-auto w-full max-w-full"
      />
    </div>
  );
}
