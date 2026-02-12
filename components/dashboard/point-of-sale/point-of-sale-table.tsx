'use client';

import SearchInput from "@/components/common/search-input";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { PointOfSaleData } from "@/lib/types";
import { FileDown } from "lucide-react";
import { useMemo, useState } from "react";
import ExportPOS from "./export-pos";
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
}: Readonly<PointOfSaleTableProps>) {
  const [internalSearchValue, setInternalSearchValue] = useState("");
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Use external search value if provided, otherwise use internal state
  const searchValue = externalSearchValue ?? internalSearchValue;
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
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="gap-2 bg-theme-dark-green text-white py-5 shadow-none"
            onClick={() => setIsExportOpen(true)}
          >
            <FileDown className="h-4 w-4" />
            Export
          </Button>
          <SearchInput
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={handleSearchChange}
            maxWidth="max-w-xs"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <DataTable columns={pointOfSaleColumns} data={filteredData} />
      </div>

      <ExportPOS
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />
    </div>
  );
}