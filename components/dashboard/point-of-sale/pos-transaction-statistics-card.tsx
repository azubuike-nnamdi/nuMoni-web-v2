import { ErrorState } from "@/components/ui/error-state";
import useGetPosTransactionStatistics from "@/hooks/query/useGetPosTransactionStatistics";
import { Banknote, ShoppingCart, Wallet } from "lucide-react";
import TransactionSummaryLoading from "../transaction/components/transaction-summary-loading";
import POSStatisticsCard from "./pos-statistics-card";

interface TransactionStatisticsData {
  payouts: {
    periodAmount: number;
    totalAmount: number;
    periodCount: number;
    totalCount: number;
  };
  serviceFees: {
    periodAmount: number;
    totalAmount: number;
    periodCount: number;
    totalCount: number;
  };
  sales: {
    periodAmount: number;
    totalAmount: number;
    periodCount: number;
    totalCount: number;
  };
}

export default function PosTransactionStatisticsCard({ posId }: { posId: string }) {
  const { data, isPending, isError, error, refetch } = useGetPosTransactionStatistics({
    posId,
    // merchantId: merchantId,
  });

  if (isPending) {
    return <section className="px-8 py-6">  <TransactionSummaryLoading /></section>

  }

  if (isError) {
    return (
      <ErrorState
        title="Error loading transaction statistics"
        message={error?.message || "Failed to load transaction statistics data. Please try again."}
        onRetry={refetch}
      />
    );
  }

  const statisticsData = data?.data as TransactionStatisticsData | undefined;

  if (!statisticsData) {
    return (
      <div className="bg-white rounded-2xl p-6">
        <p className="text-gray-500">No statistics data available</p>
      </div>
    );
  }

  return (
    <main className="p-8">
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sales Card */}
        <POSStatisticsCard
          title="Sales"
          data={statisticsData.sales}
          icon={ShoppingCart}
          bgColor="bg-[#DFFDDB]"
          iconBgColor="bg-black"
        />

        {/* Payouts Card */}
        <POSStatisticsCard
          title="Payouts"
          data={statisticsData.payouts}
          icon={Wallet}
          bgColor="bg-[#E3EAFD]"
          iconBgColor="bg-black"
        />

        {/* Service Fees Card */}
        <POSStatisticsCard
          title="Service Fees"
          data={statisticsData.serviceFees}
          icon={Banknote}
          bgColor="bg-[#FFFBDA]"
          iconBgColor="bg-black"
        />
      </section>
    </main>
  );
}