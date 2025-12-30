'use client';

import TransactionsTable, { PaginationInfo } from "@/components/dashboard/transactions-table";
import useGetTransaction from "@/hooks/query/useGetTransaction";
import { TransactionData } from "@/lib/types";
import CustomDurationPicker from "./components/custom-duration-picker";
import TransactionEmptyState from "./components/transaction-empty-state";
import TransactionErrorState from "./components/transaction-error-state";
import TransactionFiltersHeader from "./components/transaction-filters-header";
import TransactionLoadingState from "./components/transaction-loading-state";
import { useTransactionFilters } from "./hooks/use-transaction-filters";

export default function TransactionHistory() {
  const {
    currentPage,
    selectedRange,
    selectedStatus,
    selectedCategory,
    customStartDate,
    customEndDate,
    dateRange,
    handlePageChange,
    handleDateRangeChange,
    handleStatusChange,
    handleCategoryChange,
    handleCustomStartDateSelect,
    handleCustomEndDateSelect,
  } = useTransactionFilters();

  const { data, isPending, isError, error, refetch } = useGetTransaction({
    fromDate: dateRange.fromDate,
    toDate: dateRange.toDate,
    page: currentPage,
    status: selectedStatus,
    category: selectedCategory,
  });

  const transactionData: TransactionData[] = data?.data ?? [];
  const pagination: PaginationInfo | undefined = data?.pagination;

  // Loading state
  if (isPending) {
    return (
      <TransactionLoadingState
        selectedStatus={selectedStatus}
        selectedCategory={selectedCategory}
        selectedRange={selectedRange}
        onStatusChange={handleStatusChange}
        onCategoryChange={handleCategoryChange}
        onRangeChange={handleDateRangeChange}
      />
    );
  }

  // Error state
  if (isError) {
    return (
      <TransactionErrorState
        selectedStatus={selectedStatus}
        selectedCategory={selectedCategory}
        selectedRange={selectedRange}
        customStartDate={customStartDate}
        customEndDate={customEndDate}
        error={error}
        onStatusChange={handleStatusChange}
        onCategoryChange={handleCategoryChange}
        onRangeChange={handleDateRangeChange}
        onCustomStartDateChange={handleCustomStartDateSelect}
        onCustomEndDateChange={handleCustomEndDateSelect}
        onRetry={refetch}
      />
    );
  }

  // Empty state
  if (!transactionData || transactionData.length === 0) {
    return (
      <TransactionEmptyState
        selectedStatus={selectedStatus}
        selectedCategory={selectedCategory}
        selectedRange={selectedRange}
        customStartDate={customStartDate}
        customEndDate={customEndDate}
        onStatusChange={handleStatusChange}
        onCategoryChange={handleCategoryChange}
        onRangeChange={handleDateRangeChange}
        onCustomStartDateChange={handleCustomStartDateSelect}
        onCustomEndDateChange={handleCustomEndDateSelect}
      />
    );
  }

  return (
    <main className="bg-white rounded-2xl p-6 my-4">
      <TransactionFiltersHeader
        selectedStatus={selectedStatus}
        selectedCategory={selectedCategory}
        selectedRange={selectedRange}
        onStatusChange={handleStatusChange}
        onCategoryChange={handleCategoryChange}
        onRangeChange={handleDateRangeChange}
      />

      {selectedRange === 'Custom Duration' && (
        <CustomDurationPicker
          startDate={customStartDate}
          endDate={customEndDate}
          onStartDateChange={handleCustomStartDateSelect}
          onEndDateChange={handleCustomEndDateSelect}
        />
      )}

      <TransactionsTable
        data={transactionData}
        title=""
        pagination={pagination}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </main>
  );
}