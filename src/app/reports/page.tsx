"use client";

import { useState, useEffect } from "react";

interface Report {
  id: number;
  website_url: string;
  screenshot_url: string;
  timestamp: string;
  child_name: string;
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await fetch("/api/parent/reports", {
        credentials: "include", // ✅ send cookies automatically
      });

      if (response.ok) {
        const data = await response.json();
        setReports(data.reports || []);
      }
    } catch (error) {
      console.error("Failed to fetch reports:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <p className="text-center text-gray-500 py-8">جارٍ التحميل...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-start">التقارير</h1>
        <div className="text-sm text-gray-500">
          إجمالي التقارير: {reports.length}
        </div>
      </div>

      {reports.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">لا توجد تقارير</p>
          <p className="text-gray-400 text-sm mt-2">
            ستظهر التقارير هنا عند محاولة الأطفال الوصول إلى مواقع محظورة
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {reports.map((report) => (
            <div
              key={report.id}
              className="bg-white rounded-lg border hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedReport(report)}
            >
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        ⚠️ محاولة وصول
                      </span>
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        👤 {report.child_name}
                      </span>
                    </div>

                    <div className="text-start">
                      <h3 className="font-semibold text-lg text-gray-900 mb-1">
                        {report.website_url}
                      </h3>
                      <p className="text-sm text-gray-500">
                        🕐 {formatDate(report.timestamp)}
                      </p>
                    </div>
                  </div>

                  {report.screenshot_url && (
                    <div className="flex-shrink-0">
                      <img
                        src={report.screenshot_url}
                        alt="Screenshot"
                        className="w-32 h-20 object-cover rounded-lg border"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Screenshot Modal */}
      {selectedReport && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedReport(null)}
        >
          <div
            className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 text-start">
                  <h2 className="text-xl font-bold mb-2">تفاصيل التقرير</h2>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>
                      <strong>الطفل:</strong> {selectedReport.child_name}
                    </p>
                    <p>
                      <strong>الموقع:</strong> {selectedReport.website_url}
                    </p>
                    <p>
                      <strong>التاريخ:</strong>{" "}
                      {formatDate(selectedReport.timestamp)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              {selectedReport.screenshot_url && (
                <div className="mt-4">
                  <img
                    src={selectedReport.screenshot_url}
                    alt="Screenshot"
                    className="w-full rounded-lg border"
                  />
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setSelectedReport(null)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  إغلاق
                </button>
                <button
                  onClick={() => {
                    // Add block URL functionality here
                    console.log("Block URL:", selectedReport.website_url);
                  }}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  حظر هذا الموقع
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
