'use client';

import { ErrorState } from "@/components/ui/error-state";
import TransactionFiltersHeader from "./transaction-filters-header";
import CustomDurationPicker from "./custom-duration-picker";
import { DateRangeOption } from "../utils/date-range-utils";
import { StatusOption } from "./status-filter";

interface TransactionErrorStateProps {
  selectedStatus: StatusOption;
  selectedRange: DateRangeOption;
  customStartDate: Date | undefined;
  customEndDate: Date | undefined;
  error: Error | null;
  onStatusChange: (status: StatusOption) => void;
  onRangeChange: (range: DateRangeOption) => void;
  onCustomStartDateChange: (date: Date | undefined) => void;
  onCustomEndDateChange: (date: Date | undefined) => void;
  onRetry: () => void;
}

export default function TransactionErrorState({
  selectedStatus,
  selectedRange,
  customStartDate,
  customEndDate,
  error,
  onStatusChange,
  onRangeChange,
  onCustomStartDateChange,
  onCustomEndDateChange,
  onRetry,
}: TransactionErrorStateProps) {
  return (
    <main className="bg-white rounded-2xl p-6 my-4">
      <TransactionFiltersHeader
        selectedStatus={selectedStatus}
        selectedRange={selectedRange}
        onStatusChange={onStatusChange}
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

