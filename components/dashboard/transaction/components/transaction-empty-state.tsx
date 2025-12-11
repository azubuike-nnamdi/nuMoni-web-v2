'use client';

import EmptyState from "@/components/common/empty-state";
import TransactionFiltersHeader from "./transaction-filters-header";
import CustomDurationPicker from "./custom-duration-picker";
import { DateRangeOption } from "../utils/date-range-utils";
import { StatusOption } from "./status-filter";

interface TransactionEmptyStateProps {
  selectedStatus: StatusOption;
  selectedRange: DateRangeOption;
  customStartDate: Date | undefined;
  customEndDate: Date | undefined;
  onStatusChange: (status: StatusOption) => void;
  onRangeChange: (range: DateRangeOption) => void;
  onCustomStartDateChange: (date: Date | undefined) => void;
  onCustomEndDateChange: (date: Date | undefined) => void;
}

export default function TransactionEmptyState({
  selectedStatus,
  selectedRange,
  customStartDate,
  customEndDate,
  onStatusChange,
  onRangeChange,
  onCustomStartDateChange,
  onCustomEndDateChange,
}: TransactionEmptyStateProps) {
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
      <EmptyState title="No data yet" description="No transaction history found" />
    </main>
  );
}

