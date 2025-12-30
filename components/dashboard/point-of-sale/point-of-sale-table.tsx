'use client';

import SearchInput from "@/components/common/search-input";
import { DataTable } from "@/components/ui/data-table";
import { PointOfSaleData } from "@/lib/types";
import { useMemo, useState } from "react";
import { pointOfSaleColumns } from "./point-of-sale-column";

interface PointOfSaleTableProps {
  title?: string;
  onSearchChange?: (value: string) => void;
  searchValue?: string;
  searchPlaceholder?: string;
  data: PointOfSaleData[];
}

export default function PointOfSaleTable({ 
  title = "Point of Sale History", 
  onSearchChange, 
  searchValue: externalSearchValue, 
  searchPlaceholder = "Search by POS name...", 
  data 
}: PointOfSaleTableProps) {
  const [internalSearchValue, setInternalSearchValue] = useState("");

  // Use external search value if provided, otherwise use internal state
  const searchValue = externalSearchValue !== undefined ? externalSearchValue : internalSearchValue;
  const handleSearchChange = onSearchChange || setInternalSearchValue;

  // Filter data by posName (case-insensitive)
  const filteredData = useMemo(() => {
    if (!searchValue.trim()) {
      return data;
    }

    const searchLower = searchValue.toLowerCase().trim();
    return data.filter((pos) => 
      pos.posName?.toLowerCase().includes(searchLower)
    );
  }, [data, searchValue]);

  return (
    <div className="bg-white rounded-2xl p-4 my-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
        <SearchInput
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={handleSearchChange}
          maxWidth="max-w-xs"
        />
      </div>

      <div className="overflow-x-auto">
        <DataTable columns={pointOfSaleColumns} data={filteredData} />
      </div>
    </div>
  );
}