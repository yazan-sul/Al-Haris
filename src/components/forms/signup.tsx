"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  CheckCircle2,
  Circle,
} from "lucide-react";
import LogoBoard from "./logoBoard";

export default function SignupForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const passwordRules = [
    { label: "8+ أحرف", met: formData.password.length >= 8 },
    { label: "حرف كبير", met: /[A-Z]/.test(formData.password) },
    { label: "رمز خاص", met: /[^A-Za-z0-9]/.test(formData.password) },
  ];

  const isPasswordValid = passwordRules.every((rule) => rule.met);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isPasswordValid) {
      setError("يرجى استيفاء شروط كلمة المرور");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("كلمات المرور غير متطابقة");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.name,
        }),
      });
      if (!response.ok) throw new Error("فشل إنشاء الحساب");
      router.push(`/verify?email=${encodeURIComponent(formData.email)}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex shadow-lg">
      <div className="bg-white rounded-lg pl-4 py-8 pr-8 flex-[1.5]">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            إنشاء حساب جديد
          </h2>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-center text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name & Email (Full Width) */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                الاسم الكامل
              </label>
              <div className="relative">
                <User className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-right outline-none"
                  placeholder="أدخل اسمك الكامل"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-right outline-none"
                  placeholder="example@email.com"
                />
              </div>
            </div>
          </div>

          {/* Password Section - Side-by-Side Layout */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
              كلمة المرور
            </label>
            <div className="flex flex-row-reverse items-start gap-4">
              {/* Input Field (Takes 65% width) */}
              <div className="w-[65%] relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pr-10 pl-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-right outline-none"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Validation Checklist (Takes 35% width, vertically centered with input) */}
              <div className="w-[35%] pt-1 space-y-2">
                {passwordRules.map((rule, i) => (
                  <div
                    key={i}
                    className={`flex items-center justify-end gap-2 text-[10px] sm:text-[11px] transition-colors ${rule.met ? "text-green-600 font-bold" : "text-gray-400"}`}
                  >
                    <span className="text-right">{rule.label}</span>
                    {rule.met ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : (
                      <Circle className="w-3.5 h-3.5" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Confirm Password (Matches Input Width) */}
          <div className="flex flex-row-reverse">
            <div className="w-[65%]">
              <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                تأكيد كلمة المرور
              </label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pr-10 pl-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-right outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>
            <div className="w-[35%]"></div> {/* Empty spacer for alignment */}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? "جاري إنشاء حساب..." : "إنشاء حساب"}
          </button>
        </form>

        {/* ... Bottom Links and Google Button ... */}
      </div>
      <LogoBoard />
    </div>
  );
}
