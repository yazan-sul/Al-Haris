"use client";

import { useState, useMemo } from "react";
import Card from "@/components/core/Card";
import ToggleBar from "@/components/core/ToggleBar";
import { Ban, Clock, Wifi } from "lucide-react";

export default function DashboardClient() {
  const [isEnabled, setIsEnabled] = useState(false);

  const dateText = useMemo(() => {
    const today = new Date();
    return new Intl.DateTimeFormat("ar-EG", {
      weekday: "long",
      day: "numeric",
      month: "long",
    }).format(today);
  }, []);

  return (
    <div className="flex flex-col space-y-10 w-full" dir="rtl">
      <div className="text-start px-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          لوحة التحكم
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
          نظرة عامة على نشاط يزن لليوم. {dateText}.
        </p>
      </div>

      <div className="flex flex-col space-y-6">
        <h2 className="text-xl font-semibold text-start px-4 text-gray-800 dark:text-gray-200">
          ملخص النشاطات اليومية
        </h2>

        <div className="flex justify-center w-full px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl w-full">
            <Card
              label="تفعيل البرنامج"
              icon={<ToggleBar enabled={isEnabled} onChange={setIsEnabled} />}
              result={isEnabled ? "مفعل" : "غير مفعل"}
            />
            <Card
              label="وقت الشاشة"
              icon={<Clock className="text-blue-500" />}
              result={"٢:١٣ دقيقة"}
            />
            <Card
              label="محاولات محظورة"
              icon={<Ban className="text-red-500" />}
              result={"٣ محاولات"}
            />
            <Card
              label="حالة الأجهزة"
              icon={<Wifi className="text-green-500" />}
              result={"٢ متصل"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
