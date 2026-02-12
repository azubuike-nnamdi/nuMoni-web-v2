"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import ExportTransaction from "../export-transaction";
import { DateRangeOption } from "../utils/date-range-utils";
import CategoryFilter, { CategoryOption } from "./category-filter";
import DateRangeFilter from "./date-range-filter";
import StatusFilter, { StatusOption } from "./status-filter";

interface TransactionFiltersHeaderProps {
  selectedStatus: StatusOption;
  selectedCategory: CategoryOption;
  selectedRange: DateRangeOption;
  onStatusChange: (status: StatusOption) => void;
  onCategoryChange: (category: CategoryOption) => void;
  onRangeChange: (range: DateRangeOption) => void;
}

export default function TransactionFiltersHeader({
  selectedStatus,
  selectedCategory,
  selectedRange,
  onStatusChange,
  onCategoryChange,
  onRangeChange,
}: Readonly<TransactionFiltersHeaderProps>) {
  const [openExportModal, setOpenExportModal] = useState<boolean>(false);

  return (
    <div className="md:flex items-center justify-between mb-4">
      <h1 className="text-lg font-semibold text-gray-900">
        Recent Transactions
      </h1>

      <div className="md:flex items-center gap-2 space-y-2 md:space-y-0 space-x-2 grid grid-cols-2 ">
        <Button
          className="bg-theme-dark-green"
          onClick={() => setOpenExportModal(true)}
        >
          Export
        </Button>
        <CategoryFilter
          selectedCategory={selectedCategory}
          onCategoryChange={onCategoryChange}
        />
        <StatusFilter
          selectedStatus={selectedStatus}
          onStatusChange={onStatusChange}
        />
        <DateRangeFilter
          selectedRange={selectedRange}
          onRangeChange={onRangeChange}
        />
      </div>
      <ExportTransaction
        isOpen={openExportModal}
        onClose={() => setOpenExportModal(false)}
      />
    </div>
  );
}
