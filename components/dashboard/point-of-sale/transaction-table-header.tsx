'use client';

import SearchInput from "@/components/common/search-input";
import { Button } from "@/components/ui/button";
import { DateRangeOption, DateRangeSelector } from "@/components/ui/date-range-selector";
import { FileDown } from "lucide-react";
import { useState } from "react";
import ExportPOS from "./export-pos";

interface TransactionTableHeaderProps {
  title: string;
  dateRange: DateRangeOption;
  searchQuery: string;
  onDateRangeChange: (range: DateRangeOption) => void;
  onSearchChange: (query: string) => void;
  onDatesChange?: (startDate: Date | undefined, endDate: Date | undefined) => void;
  posId?: string;
  merchantId?: string;
}

export default function TransactionTableHeader({
  title,
  dateRange,
  searchQuery,
  onDateRangeChange,
  onSearchChange,
  onDatesChange,
  posId,
  merchantId
}: Readonly<TransactionTableHeaderProps>) {
  const [isExportOpen, setIsExportOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
        <div className="flex items-center gap-2">
          <DateRangeSelector
            value={dateRange}
            onValueChange={onDateRangeChange}
            onDatesChange={onDatesChange}
            showAllTime={true}
            showCustomRange={true}
            placeholder="Select Date Range"
          />
          <Button
            variant="outline"
            className="gap-2 bg-theme-dark-green text-white py-5 shadow-none"
            onClick={() => setIsExportOpen(true)}
          >
            <FileDown className="h-4 w-4" />
            Export
          </Button>
          <SearchInput
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={onSearchChange}
            maxWidth="max-w-xs"
          />
        </div>
      </div>
      <ExportPOS
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        posId={posId}
        merchantId={merchantId}
      />
    </>
  );
}

export type { DateRangeOption };

