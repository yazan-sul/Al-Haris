"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "../../components/Sidebar/SideBar";
import { ThemeProvider } from "../../context/ThemeContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const pathname = usePathname();

  const pageTitles: Record<string, string> = {
    "/dashboard": "لوحة التحكم",
    "/addchild": "إضافة طفل",
    "/reports": "التقارير",
    "/settings": "الإعدادات",
    "/categories": "الفئات المحظورة",
    "/webBlock": "حظر المواقع",
  };

  const getPageTitle = () => {
    return pageTitles[pathname];
  };

  return (
    <html lang="ar" dir="rtl">
      <head />
      <body>
        <ThemeProvider>
          <div className="flex bg-white min-h-screen">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

            <div className="flex-1 flex flex-col">
              <div
                className="
  sticky top-0 z-40 w-full 
  bg-white dark:bg-gray-800 
  border-b border-gray-200 dark:border-gray-700 
  transition-all duration-300 ease-in-out 
  flex items-center px-8"
              >
                <div className="py-4 flex items-center gap-2">
                  <span className="text-gray-500 text-base">الرئيسية /</span>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {getPageTitle()}
                  </h1>
                </div>
              </div>
              <main className="flex-1 overflow-auto p-8 bg-white dark:bg-gray-800 flex">
                <div className="w-full max-w-7xl">{children}</div>
              </main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
