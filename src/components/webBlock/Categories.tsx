"use client";

import { useState, useEffect } from "react";
import CategoryCard from "./CategortyCard";

interface CategorySettings {
  enabled_categories: string[];
  available_categories: string[];
}

export default function CategoriesComponent() {
  const [settings, setSettings] = useState<CategorySettings>({
    enabled_categories: [],
    available_categories: [],
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("access_token")
          : null;
      const response = await fetch("/api/parent/settings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSettings({
          enabled_categories: data.enabled_categories || [],
          available_categories: data.available_categories || [],
        });
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateCategories = async (categories: string[]) => {
    setUpdating(true);
    try {
      const token = localStorage.getItem("access_token");

      const response = await fetch("/api/parent/categories", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ categories }),
      });

      if (response.ok) {
        setSettings((prev) => ({ ...prev, enabled_categories: categories }));
      }
    } catch (error) {
      console.error("Failed to update categories:", error);
    } finally {
      setUpdating(false);
    }
  };

  const toggleCategory = (category: string) => {
    const newCategories = settings.enabled_categories.includes(category)
      ? settings.enabled_categories.filter((c) => c !== category)
      : [...settings.enabled_categories, category];

    updateCategories(newCategories);
  };

  const disableAll = () => {
    updateCategories([]);
  };

  if (loading) {
    return (
      <p className="text-center text-sm text-gray-500 py-4">جارٍ التحميل...</p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-start">الفئات المحظورة</h2>
        <button
          onClick={disableAll}
          disabled={updating || settings.enabled_categories.length === 0}
          className="px-4 py-2 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          إلغاء حظر الكل
        </button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {settings.available_categories.map((category) => (
          <CategoryCard
            key={category}
            category={category}
            isEnabled={settings.enabled_categories.includes(category)}
            onToggle={() => toggleCategory(category)}
            disabled={updating}
          />
        ))}
      </div>

      {updating && (
        <p className="text-center text-sm text-blue-600">جارٍ التحديث...</p>
      )}
    </div>
  );
}
