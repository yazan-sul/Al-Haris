import VerifyForm from "@/components/forms/verifyForm";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "تأكيد الحساب | الحارس",
  description: "أدخل رمز التحقق لتفعيل حسابك",
};

export default function VerifyPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Suspense fallback={<div>جاري التحميل...</div>}>
        <VerifyForm />
      </Suspense>
    </main>
  );
}
