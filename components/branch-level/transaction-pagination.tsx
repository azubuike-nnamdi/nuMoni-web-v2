import { formatNumber } from "@/lib/helper";
import { ChevronLeft, ChevronRight, Download, Info, Trash2 } from "lucide-react";

interface TransactionPaginationProps {
  currentPage: number;
  totalPages: number;
  totalRows: number;
  currentPageDataLength: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onDownload?: () => void;
  onInfo?: () => void;
  onDelete?: () => void;
}

export default function TransactionPagination({
  currentPage,
  totalPages,
  totalRows,
  currentPageDataLength,
  pageSize,
  onPageChange,
  onDownload,
  onInfo,
  onDelete
}: Readonly<TransactionPaginationProps>) {
  // Calculate start and end indices (0-based to 1-based for display)
  const startIndex = (currentPage || 0) * (pageSize || 0);
  const endIndex = Math.min(startIndex + (currentPageDataLength || 0), totalRows || 0);

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      onPageChange(currentPage + 1);
    }
  };



  return (
    <div className="p-4 border-t border-gray-200 bg-gray-50">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Showing {totalRows > 0 ? startIndex + 1 : 0}-{endIndex} of {formatNumber(totalRows || 0)}
        </div>

        <div className="flex items-center gap-4">
          {/* Action Buttons */}
          {onDownload && (
            <button
              onClick={onDownload}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              title="Download"
            >
              <Download className="h-4 w-4" />
            </button>
          )}

          {onInfo && (
            <button
              onClick={onInfo}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              title="Information"
            >
              <Info className="h-4 w-4" />
            </button>
          )}

          {onDelete && (
            <button
              onClick={onDelete}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 0}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages - 1}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
