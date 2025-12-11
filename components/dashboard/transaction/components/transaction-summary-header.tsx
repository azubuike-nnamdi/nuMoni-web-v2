'use client';

import SummaryDateRangeFilter, { SummaryDateRangeOption } from "./summary-date-range-filter";

interface TransactionSummaryHeaderProps {
  selectedRange: SummaryDateRangeOption;
  onRangeChange: (range: SummaryDateRangeOption) => void;
}

export default function TransactionSummaryHeader({
  selectedRange,
  onRangeChange,
}: TransactionSummaryHeaderProps) {
  return (
    <div className="flex items-center justify-between my-4">
      <h2 className="text-lg font-semibold text-gray-900">Transaction Summary</h2>
      <SummaryDateRangeFilter selectedRange={selectedRange} onRangeChange={onRangeChange} />
    </div>
  );
}

