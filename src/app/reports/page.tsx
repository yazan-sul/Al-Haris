"use client";

import { Eye, X } from "lucide-react";
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
        credentials: "include",
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
        <p className="text-center text-gray-500 py-8 font-medium italic">
          جارٍ التحميل...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-start text-gray-800">
          التقارير
        </h1>
        <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          إجمالي التقارير: {reports.length}
        </div>
      </div>

      {reports.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
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
              className="bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 group/card"
            >
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-100">
                        ⚠️ محاولة وصول
                      </span>
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                        👤 {report.child_name}
                      </span>
                    </div>

                    <div className="text-start">
                      <h3 className="font-bold text-lg text-gray-900 mb-1 break-all">
                        {report.website_url}
                      </h3>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        🕐 {formatDate(report.timestamp)}
                      </p>
                    </div>
                  </div>

                  {report.screenshot_url && (
                    <div className="flex-shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedReport(report);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-blue-600 hover:text-white border border-gray-200 hover:border-blue-600 rounded-lg text-gray-600 transition-all duration-200 group"
                      >
                        <span className="text-sm font-bold">عرض اللقطة</span>
                        <Eye className="w-4 h-4 transition-transform group-hover:scale-110" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedReport && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200"
          onClick={() => setSelectedReport(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b flex items-center justify-between bg-gray-50">
              <div className="text-start">
                <h3 className="font-bold text-gray-900">
                  {selectedReport.website_url}
                </h3>
                <p className="text-xs text-gray-500">
                  {selectedReport.child_name} •{" "}
                  {formatDate(selectedReport.timestamp)}
                </p>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="p-2 overflow-auto bg-gray-100 flex items-center justify-center">
              <img
                src={selectedReport.screenshot_url}
                alt="Screenshot"
                className="max-w-full h-auto rounded-lg shadow-sm border border-gray-200"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
