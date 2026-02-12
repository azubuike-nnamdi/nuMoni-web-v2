import EmptyState from "@/components/common/empty-state";
import { MetricCard } from "@/components/common/metric-card";
import { DateRangeOption, DateRangeSelector } from "@/components/ui/date-range-selector";
import { ErrorState } from "@/components/ui/error-state";
import useGetPosTransactionStatistics from "@/hooks/query/useGetPosTransactionStatistics";
import { formatCurrency } from "@/lib/helper";
import { DirectSalesLandingProps, SalesData } from "@/lib/types";
import { ShoppingCart } from "lucide-react";
import { useMemo, useState } from "react";
import TransactionSummaryLoading from "../transaction/components/transaction-summary-loading";
import { DateRangeOption as UtilityDateRangeOption, getDateRange } from "../transaction/utils/date-range-utils";
import DirectSalesTable from "./direct-sales-table";


export default function DirectSalesLanding({ posId, merchantId }: Readonly<DirectSalesLandingProps>) {
  const [selectedRange, setSelectedRange] = useState<DateRangeOption>('Today');
  const [customStartDate, setCustomStartDate] = useState<Date | undefined>();
  const [customEndDate, setCustomEndDate] = useState<Date | undefined>();

  const dateRange = useMemo(() => {
    // Map 'Custom Range' from Selector to 'Custom Duration' for Utility
    const utilityOption: UtilityDateRangeOption =
      selectedRange === 'Custom Range'
        ? 'Custom Duration'
        : (selectedRange || 'Today') as UtilityDateRangeOption;

    return getDateRange(utilityOption, customStartDate, customEndDate);
  }, [selectedRange, customStartDate, customEndDate]);

  const { data, isPending, isError, error, refetch } = useGetPosTransactionStatistics({
    posId,
    startDate: dateRange.fromDate,
    endDate: dateRange.toDate,
    // merchantId: merchantId,
  });

  const statisticsData = data?.data as { sales: SalesData } | undefined;
  const salesData = statisticsData?.sales;

  const renderStatisticsContent = () => {
    if (isPending) {
      return (
        <div className="mb-8">
          <TransactionSummaryLoading />
        </div>
      );
    }

    if (isError) {
      return (
        <div className="mb-8">
          <ErrorState
            title="Error loading sales statistics"
            message={error?.message || "Failed to load sales data. Please try again."}
            onRetry={refetch}
          />
        </div>
      );
    }

    if (!salesData) {
      return (
        <div className="mb-8">
          <EmptyState
            title="No sales data available"
            description="No sales data available for the selected range."

          />
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Sales Amount"
          value={formatCurrency(salesData.totalAmount)}
          icon={<ShoppingCart className="h-6 w-6 text-gray-200" />}
          bgColor="bg-[#DFFDDB]"
          iconBgColor="bg-black"
        />
        <MetricCard
          title="Total Sales Count"
          value={salesData.totalCount.toLocaleString()}
          icon={<ShoppingCart className="h-6 w-6 text-gray-200" />}
          bgColor="bg-[#FFFBDA]"
          iconBgColor="bg-black"
        />

        <MetricCard
          title="Period Sales Amount"
          value={formatCurrency(salesData.periodAmount)}
          icon={<ShoppingCart className="h-6 w-6 text-gray-200" />}
          bgColor="bg-[#E3EAFD]"
          iconBgColor="bg-black"
        />
        <MetricCard
          title="Period Sales Count"
          value={salesData.periodCount.toLocaleString()}
          icon={<ShoppingCart className="h-6 w-6 text-gray-200" />}
          bgColor="bg-[#FFE5E5]"
          iconBgColor="bg-black"
        />
      </div>
    );
  };

  return (
    <section className="">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Sales Statistics</h2>
        <div className="w-64">
          <DateRangeSelector
            value={selectedRange}
            onValueChange={setSelectedRange}
            onDatesChange={(start, end) => {
              setCustomStartDate(start);
              setCustomEndDate(end);
            }}
            showCustomRange
            placeholder="Select Range"
          />
        </div>
      </div>

      {renderStatisticsContent()}

      <DirectSalesTable posId={posId} merchantId={merchantId} />
    </section>
  );
}