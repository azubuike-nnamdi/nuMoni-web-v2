'use client';

import { ErrorState } from "@/components/ui/error-state";
import useGetPaymentHistory from "@/hooks/query/useGetPaymentHistory";
import { useState } from "react";
import { SummaryDateRangeOption } from "./components/summary-date-range-filter";
import TransactionMetricsGrid from "./components/transaction-metrics-grid";
import TransactionSummaryHeader from "./components/transaction-summary-header";
import TransactionSummaryLoading from "./components/transaction-summary-loading";
import { getSummaryDateRange } from "./utils/summary-date-range-utils";
import { getTransactionMetrics, PaymentHistoryData } from "./utils/transaction-metrics";

export default function TransactionSummary() {
  const [selectedRange, setSelectedRange] = useState<SummaryDateRangeOption>('Today');
  const dateRange = getSummaryDateRange(selectedRange);

  const { data, isPending, isError, error, refetch } = useGetPaymentHistory({
    fromDate: dateRange.fromDate,
    toDate: dateRange.toDate,
  });

  const paymentHistoryData: PaymentHistoryData = data?.data?.data ?? {};

  const handleDateRangeChange = (option: SummaryDateRangeOption) => {
    setSelectedRange(option);
  };

  // Loading skeleton
  if (isPending) {
    return <TransactionSummaryLoading />;
  }

  // Error state
  if (isError) {
    return (
      <ErrorState
        title="Error loading payment history"
        message={error?.message || "Failed to load payment history data. Please try again."}
        onRetry={refetch}
      />
    );
  }

  const metrics = getTransactionMetrics(paymentHistoryData);

  return (
    <div>
      <TransactionSummaryHeader
        selectedRange={selectedRange}
        onRangeChange={handleDateRangeChange}
      />
      <TransactionMetricsGrid metrics={metrics} />
    </div>
  );
}