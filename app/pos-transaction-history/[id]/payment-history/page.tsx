"use client";

import { PaymentHistory } from "@/components/dashboard/open-dashboard/payment-history";
import { PaymentHistoryTable } from "@/components/dashboard/open-dashboard/payment-history-table";
import { useSearchParams } from "next/navigation";

export default function Page() {
  const searchParams = useSearchParams();
  const merchantId = searchParams.get("merchantId") || "";

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Payments Overview</h1>
          <p className="text-gray-500 mt-1 font-medium">Monitor your sales, payouts, and service fees in real-time.</p>
        </div>
      </div>

      <div className="space-y-8 mt-6">
        <PaymentHistory
          merchantId={merchantId}
        />

        <PaymentHistoryTable
          merchantId={merchantId}
        />
      </div>
    </div>
  )
}