'use client';

import EmptyState from "@/components/common/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import useGetMerchantTransactionStats from "@/hooks/query/useGetMerchantTransactionStats";
import { extractErrorMessage, getTimelineDates } from "@/lib/helper";
import { format } from "date-fns";
import { useMemo, useState } from "react";
import { PaymentHistoryFiltersState } from "./payment-history-filters";
import { PaymentHistoryLoading } from "./payment-history-loading";
import { PaymentHistoryStats } from "./payment-history-stats";

interface PaymentHistoryProps {
  merchantId: string;
}

export function PaymentHistory({ merchantId }: Readonly<PaymentHistoryProps>) {
  const [filters] = useState<PaymentHistoryFiltersState>({
    filterType: 'customerEmail',
    searchValue: "",
    debouncedSearchValue: "",
    dateRangeOption: 'Today',
  });

  const { startDate, endDate } = useMemo(() => {
    if (filters.dateRangeOption === 'Custom Range') {
      return {
        startDate: filters.customStartDate ? format(filters.customStartDate, "dd-MM-yyyy") : undefined,
        endDate: filters.customEndDate ? format(filters.customEndDate, "dd-MM-yyyy") : undefined,
      };
    }
    return getTimelineDates(filters.dateRangeOption || 'Today');
  }, [filters.dateRangeOption, filters.customStartDate, filters.customEndDate]);

  const hookParams = {
    merchantId,
    startDate,
    endDate,
    customerEmail: filters.filterType === 'customerEmail' && filters.debouncedSearchValue ? filters.debouncedSearchValue : undefined,
    customerPhoneNo: filters.filterType === 'customerPhoneNo' && filters.debouncedSearchValue ? filters.debouncedSearchValue : undefined,
    customerId: filters.filterType === 'customerId' && filters.debouncedSearchValue ? filters.debouncedSearchValue : undefined,
  };

  const { isPending, data, isError, refetch, error } = useGetMerchantTransactionStats(hookParams);

  const stats = data?.data?.data;

  return (
    <div>
      {/* <h2 className="text-lg font-bold text-gray-900 mb-2">Transaction Metrics</h2> */}
      {/* <PaymentHistoryFilters onFiltersChange={setFilters} /> */}

      <div className="mt-4">
        {isPending && <PaymentHistoryLoading />}

        {isError && (
          <ErrorState
            title="Failed to load transaction statistics"
            message={extractErrorMessage(error)}
            onRetry={refetch}
          />
        )}

        {!isPending && !isError && !stats && (
          <EmptyState
            title="No transaction statistics found"
            description="Try adjusting your search filters or date range."
          />
        )}

        {!isPending && !isError && stats && (
          <PaymentHistoryStats
            sales={stats.sales}
          // payouts={stats.payouts}
          // serviceFees={stats.serviceFees}
          />
        )}
      </div>
    </div>
  );
}