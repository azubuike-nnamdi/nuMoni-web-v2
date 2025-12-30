'use client';

import { ErrorState } from "@/components/ui/error-state";
import TransactionFiltersHeader from "./transaction-filters-header";
import CustomDurationPicker from "./custom-duration-picker";
import { DateRangeOption } from "../utils/date-range-utils";
import { StatusOption } from "./status-filter";
import { CategoryOption } from "./category-filter";

interface TransactionErrorStateProps {
  selectedStatus: StatusOption;
  selectedCategory: CategoryOption;
  selectedRange: DateRangeOption;
  customStartDate: Date | undefined;
  customEndDate: Date | undefined;
  error: Error | null;
  onStatusChange: (status: StatusOption) => void;
  onCategoryChange: (category: CategoryOption) => void;
  onRangeChange: (range: DateRangeOption) => void;
  onCustomStartDateChange: (date: Date | undefined) => void;
  onCustomEndDateChange: (date: Date | undefined) => void;
  onRetry: () => void;
}

export default function TransactionErrorState({
  selectedStatus,
  selectedCategory,
  selectedRange,
  customStartDate,
  customEndDate,
  error,
  onStatusChange,
  onCategoryChange,
  onRangeChange,
  onCustomStartDateChange,
  onCustomEndDateChange,
  onRetry,
}: TransactionErrorStateProps) {
  return (
    <main className="bg-white rounded-2xl p-6 my-4">
      <TransactionFiltersHeader
        selectedStatus={selectedStatus}
        selectedCategory={selectedCategory}
        selectedRange={selectedRange}
        onStatusChange={onStatusChange}
        onCategoryChange={onCategoryChange}
        onRangeChange={onRangeChange}
      />
      {selectedRange === 'Custom Duration' && (
        <CustomDurationPicker
          startDate={customStartDate}
          endDate={customEndDate}
          onStartDateChange={onCustomStartDateChange}
          onEndDateChange={onCustomEndDateChange}
        />
      )}
      <ErrorState
        title="Error loading transactions"
        message={error?.message || "Failed to load transaction history. Please try again."}
        onRetry={onRetry}
      />
    </main>
  );
}

