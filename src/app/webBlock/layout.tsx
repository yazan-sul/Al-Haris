"use client";

import React, { useState } from "react";

import Sidebar from "@/components/Sidebar/SideBar";
import { ThemeProvider } from "@/context/ThemeContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <html lang="en" dir="rtl">
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
  flex items-center "
              >
                <div className="px-8 py-4"></div>
              </div>
              <main className="flex-1 overflow-auto p-8 bg-white dark:bg-gray-800 flex items-center justify-center">
                <div className="w-full max-w-7xl">{children}</div>
              </main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
