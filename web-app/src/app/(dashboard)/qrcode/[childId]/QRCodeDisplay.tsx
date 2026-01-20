// /web-app/src/app/(dashboard)/qrcode/[childId]/QRCodeDisplay.tsx
"use client";

import { QRCodeCanvas } from "qrcode.react";
import { useRef } from "react";

type Props = {
  token: string;
  childId: string;
};

export default function QRCodeDisplay({ token, childId }: Props) {
  const canvasRef = useRef<HTMLDivElement>(null);

  return (
    <div className="text-center space-y-6 p-8 bg-white rounded-2xl shadow-xl border border-gray-100 max-w-sm w-full">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-800">QR Code</h2>
        <p className="text-gray-500 text-sm">قم بمسح الكود لتسجيل</p>
      </div>

      <div
        ref={canvasRef}
        className="flex justify-center p-4 bg-white border-2 border-dashed border-gray-200 rounded-xl"
      >
        <QRCodeCanvas value={token} size={256} level="H" includeMargin={true} />
      </div>
    </div>
  );
}
