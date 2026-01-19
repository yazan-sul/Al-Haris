// src/components/navbar/Navbar.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/signup", label: "انشاء حساب" },
    { href: "/login", label: "تسحيل الدخول" },
    { href: "/support", label: "اتصل بنا" },
    { href: "/dashboard", label: "لوحة التحكم" },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          {navLinks.map((link) => (
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
        <div className="flex items-center gap-3">
          <Image
            src="/logo.webp"
            alt="Al-Haris Logo"
            width={60}
            height={60}
            className="object-contain"
          />
          <h1 className="text-xl font-bold text-gray-900">الحارس</h1>
        </div>
      </div>
    </nav>
  );
}
