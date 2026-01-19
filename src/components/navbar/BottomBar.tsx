// src/components/navbar/BottomBar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomBar() {
  const pathname = usePathname();

  const footerLinks = [
    { href: "/privacy-policy", label: "سياسة الخصوصية" },
    { href: "/terms-conditions", label: "شروط الاستخدام" },
  ];

  return (
    <footer className="bg-white border-t border-gray-200 px-6 py-4 mt-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors pb-1 ${
                pathname === link.href
                  ? "text-gray-900 border-b-2 border-blue-500"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
        {/* Far Right - App Name */}
        <div>
          <p className="text-sm font-semibold text-gray-900">الحارس</p>
        </div>
      </div>
    </footer>
  );
}
