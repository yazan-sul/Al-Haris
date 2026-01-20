"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { QRCodeCanvas } from "qrcode.react";

export default function QRCodePage() {
  const [childName, setChildName] = useState("");
  const [token, setToken] = useState("");

  const searchParams = useSearchParams();
  const childId = searchParams.get("childId");

  useEffect(() => {
    if (!childId) return;

    const generateQR = async () => {
      try {
        const res = await fetch("/api/auth/generate-qr-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ child_id: parseInt(childId) }),
        });

        if (!res.ok) return;

        const data = await res.json();
        setChildName(data.child_name);
        setToken(data.token);
      } catch (error) {
        console.error("can't generate QR:", error);
      }
    };

    generateQR();
    const interval = setInterval(generateQR, 180000);

    return () => clearInterval(interval);
  }, [childId]);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-4">
          {childName && (
            <h2 className="text-xl font-bold">رمز QR لـ {childName}</h2>
          )}
          {token && <QRCodeCanvas value={token} size={300} />}
        </div>
      </main>
    </div>
  );
}
