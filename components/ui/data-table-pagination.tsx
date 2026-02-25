"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DataTablePaginationProps {
  currentPage: number;
  totalPages: number;
  totalRows: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export function DataTablePagination({
  currentPage,
  totalPages,
  totalRows,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: Readonly<DataTablePaginationProps>) {
  const safeCurrentPage = currentPage || 0;
  const safeTotalPages = totalPages || 0;
  const safeTotalRows = totalRows || 0;
  const safePageSize = pageSize || 10;

  const [jumpPage, setJumpPage] = useState("");

  const handleJumpPage = (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    const pageNum = Number.parseInt(jumpPage, 10);
    if (!Number.isNaN(pageNum) && pageNum > 0 && pageNum <= safeTotalPages) {
      onPageChange(pageNum - 1);
      setJumpPage("");
    }
  };

  const startIndex = safeCurrentPage * safePageSize;
  const endIndex = Math.min(startIndex + safePageSize, safeTotalRows);

  const getPageNumbers = () => {
    const pages = [];
    const showMax = 5;

    if (safeTotalPages <= showMax) {
      for (let i = 0; i < safeTotalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(0);

      const start = Math.max(1, safeCurrentPage - 1);
      const end = Math.min(safeTotalPages - 2, safeCurrentPage + 1);

      if (start > 1) {
        pages.push("ellipsis-start");
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < safeTotalPages - 2) {
        pages.push("ellipsis-end");
      }

      // Always show last page
      pages.push(safeTotalPages - 1);
    }
    return pages;
  };

  return (
    <div className="p-4 border-t border-gray-200 bg-gray-50">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Row Count and Page Size Selector */}
        <div className="flex items-center gap-6">
          <div className="text-sm text-gray-600 font-medium whitespace-nowrap">
            Showing <span className="text-gray-900">{safeTotalRows > 0 ? startIndex + 1 : 0}-{endIndex}</span> of <span className="text-gray-900">{safeTotalRows}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap">Rows per page:</span>
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => onPageSizeChange(Number(value))}
            >
              <SelectTrigger className="h-9 w-20 bg-white border-gray-300">
                <SelectValue placeholder={pageSize.toString()} />
              </SelectTrigger>
              <SelectContent>
                {[10, 20, 50, 100].map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Shadcn Pagination Controls */}
        <div className="flex flex-col-reverse sm:flex-row items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap">Go to page:</span>
            <form onSubmit={handleJumpPage} className="flex items-center gap-1">
              <Input
                type="number"
                min={1}
                max={safeTotalPages || 1}
                value={jumpPage}
                onChange={(e) => setJumpPage(e.target.value)}
                className="h-8 w-16 px-2 py-1 text-center bg-white border-gray-300 [&::-webkit-inner-spin-button]:appearance-none"
                placeholder="No."
              />
              <Button type="submit" variant="outline" size="sm" className="h-8 border-gray-300">
                Go
              </Button>
            </form>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 font-medium whitespace-nowrap">
              Page <span className="text-gray-900">{safeCurrentPage + 1}</span> of <span className="text-gray-900">{safeTotalPages || 1}</span>
            </span>
            <Pagination className="mx-0 w-auto">
              <PaginationContent className="gap-1">
                <PaginationItem>
                  <PaginationPrevious
                    className={`cursor-pointer ${safeCurrentPage === 0 ? "pointer-events-none opacity-50" : ""}`}
                    onClick={() => safeCurrentPage > 0 && onPageChange(safeCurrentPage - 1)}
                  />
                </PaginationItem>

                {getPageNumbers().map((page, index) => {
                  if (typeof page === "string") {
                    return (
                      <PaginationItem key={page}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                  }

                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        className="cursor-pointer"
                        isActive={safeCurrentPage === page}
                        onClick={() => onPageChange(page)}
                      >
                        {page + 1}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}

                <PaginationItem>
                  <PaginationNext
                    className={`cursor-pointer ${safeCurrentPage >= safeTotalPages - 1 || safeTotalPages === 0 ? "pointer-events-none opacity-50" : ""}`}
                    onClick={() => safeCurrentPage < safeTotalPages - 1 && onPageChange(safeCurrentPage + 1)}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>
    </div>
  );
}
