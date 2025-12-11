'use client';

import { Skeleton } from "@/components/ui/skeleton";
import TransactionFiltersHeader from "./transaction-filters-header";
import { DateRangeOption } from "../utils/date-range-utils";
import { StatusOption } from "./status-filter";

interface TransactionLoadingStateProps {
  selectedStatus: StatusOption;
  selectedRange: DateRangeOption;
  onStatusChange: (status: StatusOption) => void;
  onRangeChange: (range: DateRangeOption) => void;
}

export default function TransactionLoadingState({
  selectedStatus,
  selectedRange,
  onStatusChange,
  onRangeChange,
}: TransactionLoadingStateProps) {
  return (
    <main className="bg-white rounded-2xl p-6 my-4">
      <TransactionFiltersHeader
        selectedStatus={selectedStatus}
        selectedRange={selectedRange}
        onStatusChange={onStatusChange}
        onRangeChange={onRangeChange}
      />
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex items-center gap-4 p-4 border-b border-gray-100">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>
    </main>
  );
}

