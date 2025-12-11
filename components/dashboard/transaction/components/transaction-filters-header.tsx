'use client';

import DateRangeFilter from "./date-range-filter";
import StatusFilter, { StatusOption } from "./status-filter";
import { DateRangeOption } from "../utils/date-range-utils";

interface TransactionFiltersHeaderProps {
  selectedStatus: StatusOption;
  selectedRange: DateRangeOption;
  onStatusChange: (status: StatusOption) => void;
  onRangeChange: (range: DateRangeOption) => void;
}

export default function TransactionFiltersHeader({
  selectedStatus,
  selectedRange,
  onStatusChange,
  onRangeChange,
}: TransactionFiltersHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h1 className="text-lg font-semibold text-gray-900">Recent Transactions</h1>
      <div className="flex items-center gap-2">
        <StatusFilter selectedStatus={selectedStatus} onStatusChange={onStatusChange} />
        <DateRangeFilter selectedRange={selectedRange} onRangeChange={onRangeChange} />
      </div>
    </div>
  );
}

