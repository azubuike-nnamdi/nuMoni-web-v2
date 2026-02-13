"use client";

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
  const startIndex = currentPage * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalRows);

  const getPageNumbers = () => {
    const pages = [];
    const showMax = 5;

    if (totalPages <= showMax) {
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(0);

      const start = Math.max(1, currentPage - 1);
      const end = Math.min(totalPages - 2, currentPage + 1);

      if (start > 1) {
        pages.push("ellipsis-start");
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 2) {
        pages.push("ellipsis-end");
      }

      // Always show last page
      pages.push(totalPages - 1);
    }
    return pages;
  };

  return (
    <div className="p-4 border-t border-gray-200 bg-gray-50">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Row Count and Page Size Selector */}
        <div className="flex items-center gap-6">
          <div className="text-sm text-gray-600 font-medium whitespace-nowrap">
            Showing <span className="text-gray-900">{totalRows > 0 ? startIndex + 1 : 0}-{endIndex}</span> of <span className="text-gray-900">{totalRows}</span>
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
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600 font-medium whitespace-nowrap">
            Page <span className="text-gray-900">{currentPage + 1}</span> of <span className="text-gray-900">{totalPages || 1}</span>
          </span>
          <Pagination className="mx-0 w-auto">
            <PaginationContent className="gap-1">
              <PaginationItem>
                <PaginationPrevious
                  className={`cursor-pointer ${currentPage === 0 ? "pointer-events-none opacity-50" : ""}`}
                  onClick={() => currentPage > 0 && onPageChange(currentPage - 1)}
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
                      isActive={currentPage === page}
                      onClick={() => onPageChange(page)}
                    >
                      {page + 1}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              <PaginationItem>
                <PaginationNext
                  className={`cursor-pointer ${currentPage >= totalPages - 1 || totalPages === 0 ? "pointer-events-none opacity-50" : ""}`}
                  onClick={() => currentPage < totalPages - 1 && onPageChange(currentPage + 1)}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}

