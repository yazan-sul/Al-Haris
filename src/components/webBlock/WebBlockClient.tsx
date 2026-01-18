"use client";

import { useState, useEffect } from "react";
import BlockUrl from "./BlockUrl";
import CategoriesComponent from "./Categories";

export default function WebBlockClient() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [blockedSites, setBlockedSites] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("access_token");

    console.log("Token from localStorage:", token);

    if (!token) {
      setMessage("غير مصرح: لم يتم تسجيل الدخول");
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/parent/block-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({ url }),
      });

      if (!res.ok) throw new Error();

      const data = await res.json();
      setMessage(data);
      setUrl("");
    } catch {
      setMessage("فشل في حظر الموقع");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <CategoriesComponent />

      <h1 className="text-xl font-semibold text-start">حظر موقع إلكتروني</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="url"
          required
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full rounded-lg border px-4 py-2"
        />

        <button
          disabled={loading}
          className="w-full rounded-lg bg-red-600 py-2 cursor-pointer text-white disabled:opacity-50"
        >
          {loading ? "جارٍ الحظر..." : "حظر الموقع"}
        </button>
      </form>

      {message && (
        <p className="text-center text-sm text-green-600">{message}</p>
      )}

      <BlockUrl />
    </div>
  );
}
