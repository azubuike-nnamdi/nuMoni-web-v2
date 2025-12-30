"use client";

import OpenNavbar from "@/components/common/open-navbar";
import PosTransactionStatisticsCard from "@/components/dashboard/point-of-sale/pos-transaction-statistics-card";
import PosTransactionTable from "@/components/dashboard/point-of-sale/pos-transaction-table";
import { useParams, useSearchParams } from "next/navigation";

export default function Page() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const merchantName = searchParams.get("merchantName");
  const posName = searchParams.get("posName");
  const merchantId = searchParams.get("merchantId");
  return <main>
    <OpenNavbar />
    <section className="p-8">
      <h1 className="text-2xl font-bold">Welcome to {merchantName}&apos;s POS Transaction History</h1>
      <p className="text-gray-500">View the transaction history for {posName}</p>
    </section>
    <PosTransactionStatisticsCard posId={id as string} />
    <PosTransactionTable posId={id as string} merchantId={merchantId as string} />
  </main>;
}