// src/components/navbar/BottomBar.tsx
"use client";

import Link from "next/link";

export default function BottomBar() {
  const footerLinks = [
    { href: "/privacy", label: "سياسة الخصوصية" },
    { href: "/help", label: "المساعدة" },
    { href: "/terms", label: "شروط الاستخدام" },
  ];

  return (
    <footer className="bg-white border-t border-gray-200 px-6 py-4 mt-auto">
      <div className="flex items-center justify-between">
        {/* Far Left - 3 Footer Links */}
        <div className="flex items-center gap-6">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
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
