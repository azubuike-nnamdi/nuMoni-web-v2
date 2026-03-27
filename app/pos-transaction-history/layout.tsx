'use client'


import OpenNavbar from "@/components/common/open-navbar";
import React from "react";

export default function PosTransactionHistoryLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">

      <div className="flex flex-col flex-1">
        <OpenNavbar />
        <main className="pt-16">
          {children}
        </main>
      </div>
    </div>
  );
}