"use client";

import OpenNavbar from "@/components/common/open-navbar";
import DirectSalesLanding from "@/components/dashboard/point-of-sale/direct-sales-landing";
import PosTransactionStatisticsCard from "@/components/dashboard/point-of-sale/pos-transaction-statistics-card";
import PosTransactionTable from "@/components/dashboard/point-of-sale/pos-transaction-table";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { useParams, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function Page() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const merchantName = searchParams.get("merchantName");
  const posName = searchParams.get("posName");
  const merchantId = searchParams.get("merchantId");

  // config tab for view full report and direct sales report

  const [activeTab, setActiveTab] = useState<"view-full-report" | "direct-sales-report">("direct-sales-report");
  const tabs = [
    { id: "direct-sales-report", label: "Direct Sales Report" },
    { id: "view-full-report", label: "View Full Report" },
  ];

  // Show only the button for the opposite tab
  const oppositeTab = activeTab === "direct-sales-report"
    ? tabs.find(tab => tab.id === "view-full-report")
    : tabs.find(tab => tab.id === "direct-sales-report");

  const handleTabSwitch = () => {
    setActiveTab(activeTab === "direct-sales-report" ? "view-full-report" : "direct-sales-report");
  };

  return <main>
    <OpenNavbar />
    <section className="p-8 md:flex justify-between items-center">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Welcome to {merchantName}&apos;s POS Transaction History</h1>
        <p className="text-gray-500">View the transaction history for {posName}</p>
      </div>
      {oppositeTab && (
        <div className="flex flex-row gap-2 md:mt-0 mt-4">
          <Button
            onClick={handleTabSwitch}
            variant="outline"
            className="bg-theme-dark-green text-white border-theme-dark-green rounded-md"
          >
            {oppositeTab.label}
          </Button>
        </div>
      )}
    </section>
    <AnimatePresence mode="wait">
      {activeTab === "view-full-report" ? (
        <motion.div
          key="view-full-report"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <PosTransactionStatisticsCard posId={id as string} />
          <PosTransactionTable posId={id as string} merchantId={merchantId as string} />
        </motion.div>
      ) : (
        <motion.div
          key="direct-sales-report"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="p-8"
        >
          <DirectSalesLanding posId={id as string} merchantId={merchantId as string} />
        </motion.div>
      )}
    </AnimatePresence>
  </main>;
}