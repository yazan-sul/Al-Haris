// /web-app/src/app/(dashboard)/qrcode/[childId]/page.tsx
"use client"; // <--- THIS IS THE KEY

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import QRCodeDisplay from "./QRCodeDisplay";

export default function QRCodePage() {
  const params = useParams();
  const childId = params.childId as string;

  const [qrToken, setQrToken] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const res = await fetch("/api/auth/generate-qr-token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ child_id: parseInt(childId) }),
        });

        if (!res.ok) {
          setError(true);
          return;
        }

        const data = await res.json();
        setQrToken(data);
      } catch (err) {
        console.error(err);
        setError(true);
      }
    };

    if (childId) fetchToken();
  }, [childId]);

  if (error) return <div className="p-10 text-center">خطأ في جلب البيانات</div>;
  if (!qrToken) return <div className="p-10 text-center">جاري التحميل...</div>;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 items-center justify-center p-4">
      <QRCodeDisplay token={qrToken} childId={childId} />
    </div>
  );
}
