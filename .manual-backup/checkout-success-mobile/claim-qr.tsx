"use client";

import { QRCodeSVG } from "qrcode.react";

export function ClaimQr({ value }: { value: string }) {
  return (
    <div className="inline-flex rounded-3xl bg-white p-4">
      <QRCodeSVG value={value} size={150} />
    </div>
  );
}
