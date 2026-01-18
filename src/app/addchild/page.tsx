"use client";

import { useState } from "react";

interface Child {
  id: number;
  name: string;
  device_name: string;
}

interface FormData {
  name: string;
  device_name: string;
}

export default function AddChildPage() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    device_name: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [children, setChildren] = useState<Child[]>([]);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/parent/child", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage("تمت إضافة الطفل بنجاح");
        setFormData({ name: "", device_name: "" });
        fetchChildren();
      } else {
        setMessage("فشلت إضافة الطفل");
      }
    } catch (error) {
      setMessage("حدث خطأ أثناء الإضافة");
      console.error("Error adding child:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchChildren = async () => {
    try {
      const response = await fetch("/api/parent/children");
      const data = await response.json();
      setChildren(data.children || []);
    } catch (error) {
      console.error("Failed to fetch children:", error);
    }
  };

  const handleDelete = async (childId: number) => {
    if (!confirm("هل أنت متأكد من حذف هذا الطفل؟")) return;

    try {
      const response = await fetch(`/api    /parent/child/${childId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchChildren();
      }
    } catch (error) {
      console.error("Failed to delete child:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 p-6">
      <h1 className="text-2xl font-bold text-start">إضافة طفل جديد</h1>

      <div
        onSubmit={handleSubmit}
        className="bg-white rounded-lg border p-6 space-y-5"
      >
        <div className="space-y-2">
          <label className="block text-sm font-medium text-start">الاسم</label>
          <input
            type="text"
            required
            placeholder="أدخل اسم الطفل"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full rounded-lg border px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-start">
            اسم الجهاز
          </label>
          <input
            type="text"
            required
            placeholder="أدخل اسم الجهاز"
            value={formData.device_name}
            onChange={(e) =>
              setFormData({ ...formData, device_name: e.target.value })
            }
            className="w-full rounded-lg border px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full rounded-lg bg-blue-600 py-3 text-white font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "جارٍ الإضافة..." : "إضافة الطفل"}
        </button>

        {message && (
          <p
            className={`text-center text-sm ${message.includes("نجاح") ? "text-green-600" : "text-red-600"}`}
          >
            {message}
          </p>
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-start">الأطفال المسجلون</h2>

        {children.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">لا يوجد أطفال مسجلون بعد</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {children.map((child) => (
              <div
                key={child.id}
                className="bg-white rounded-lg border p-5 flex items-center justify-between hover:shadow-md transition-shadow"
              >
                <div className="space-y-1">
                  <h3 className="font-semibold text-lg">{child.name}</h3>
                  <div className="text-sm text-gray-600">
                    <span>الجهاز: {child.device_name}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      (window.location.href = `/child/${child.id}/settings`)
                    }
                    className="px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    الإعدادات
                  </button>
                  <button
                    onClick={() => handleDelete(child.id)}
                    className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    حذف
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
