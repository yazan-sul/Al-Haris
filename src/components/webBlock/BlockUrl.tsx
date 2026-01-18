"use client";

import { useState, useEffect } from "react";

export default function BlockedSitesList() {
  const [blockedSites, setBlockedSites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlockedSites();
  }, []);

  const fetchBlockedSites = async () => {
    try {
      const token = localStorage.getItem("access_token");

      const response = await fetch("/api/parent/settings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setBlockedSites(data.blocked_urls || []);
      }
    } catch (error) {
      console.error("Failed to fetch blocked sites:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnblock = async (site: string) => {
    try {
      const token = localStorage.getItem("auth_token");

      const response = await fetch("/api/parent/unblock-url", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ url: site }),
      });

      if (response.ok) {
        fetchBlockedSites(); // Refresh the list
      }
    } catch (error) {
      console.error("Failed to unblock:", error);
    }
  };

  if (loading) {
    return (
      <p className="text-center text-sm text-gray-500 py-4">جارٍ التحميل...</p>
    );
  }

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-medium text-start">المواقع المحظورة</h2>

      {blockedSites.length === 0 ? (
        <p className="text-center text-sm text-gray-500 py-4">
          لا توجد مواقع محظورة
        </p>
      ) : (
        <ul className="space-y-2">
          {blockedSites.map((site, index) => (
            <li
              key={index}
              className="flex items-center justify-between rounded-lg border bg-gray-50 px-4 py-3"
            >
              <span className="text-sm truncate flex-1">{site}</span>
              <button
                onClick={() => handleUnblock(site)}
                className="text-red-600 hover:text-red-800 text-sm mr-3"
              >
                إلغاء الحظر
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
