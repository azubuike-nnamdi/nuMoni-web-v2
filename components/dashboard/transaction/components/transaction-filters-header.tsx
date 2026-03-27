"use client";

import { Button } from "@/components/ui/button";
import useGetMerchant from "@/hooks/query/useGetMerchant";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
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

  const { data: merchantData, isPending: isMerchantPending } = useGetMerchant()
  const merchantInfo = merchantData?.data?.data;
  const { merchantId, businessName } = merchantInfo ?? {}


  return (
    <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between mb-6">
      <h1 className="text-xl font-bold text-gray-900 shrink-0">
        Recent Transactions
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap lg:items-center gap-3 w-full lg:w-auto">
        <div className="sm:col-span-2 lg:contents">
          <Link
            href={isMerchantPending || !merchantId ? "#" : `/payment-transaction-history?merchantName=${encodeURIComponent(businessName || '')}&merchantId=${merchantId}`}
            target={isMerchantPending || !merchantId ? undefined : "_blank"}
            className={`w-full lg:w-auto ${isMerchantPending || !merchantId ? "pointer-events-none opacity-50" : ""}`}
          >
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full h-10 px-4 shadow-none flex items-center justify-center gap-2 border-theme-dark-green text-theme-dark-green hover:bg-theme-green/5"
              title="View Transactions"
              disabled={isMerchantPending || !merchantId}
            >
              <span className="whitespace-nowrap font-medium">Confirm Payment</span>
              <ArrowUpRight className="h-4 w-4 shrink-0" />
            </Button>
          </Link>
        </div>

        <Button
          className="bg-theme-dark-green hover:bg-theme-dark-green/90 text-white h-10 shadow-none px-6 w-full sm:w-auto"
          onClick={() => setOpenExportModal(true)}
        >
          Export
        </Button>

        <div className="grid grid-cols-2 sm:contents gap-2">
          <CategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={onCategoryChange}
          />
          <StatusFilter
            selectedStatus={selectedStatus}
            onStatusChange={onStatusChange}
          />
        </div>

        <div className="sm:col-span-2 lg:contents">
          <DateRangeFilter
            selectedRange={selectedRange}
            onRangeChange={onRangeChange}
          />
        </div>
      </div>
      <ExportTransaction
        isOpen={openExportModal}
        onClose={() => setOpenExportModal(false)}
      />

    </div>
  );
}
