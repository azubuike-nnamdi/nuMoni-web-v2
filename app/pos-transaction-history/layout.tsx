'use client'

import DynamicSidebar from "@/components/common/dynamic-sidebar";
import OpenNavbar from "@/components/common/open-navbar";
import React from "react";

export default function PosTransactionHistoryLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <DynamicSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-col flex-1">
        <OpenNavbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="pt-16 lg:ml-64">
          {children}
        </main>
      </div>
    </div>
  );
}