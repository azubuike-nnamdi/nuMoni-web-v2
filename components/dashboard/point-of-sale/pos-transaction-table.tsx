'use client';

import TransactionPagination from "@/components/branch-level/transaction-pagination";
import EmptyState from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { ErrorState } from "@/components/ui/error-state";
import LoadingSpinner from "@/components/ui/loading-spinner";
import useGetPosTransactionList from "@/hooks/query/useGetPosTransactionList";
import { extractErrorMessage, formatCurrency, formatDateTime } from "@/lib/helper";
import { TransactionData } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { Copy } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { PaginationInfo } from "../transactions-table";
import TransactionTableHeader from "./transaction-table-header";
import { useDateFilter } from "./use-date-filter";


// Extended TransactionData type for POS transactions
type PosTransactionData = TransactionData & {
  posName?: string;
  posLocation?: string | null;
};

const columns: ColumnDef<PosTransactionData>[] = [
  {
    accessorKey: "transactionReferenceId",
    header: "Transaction Reference",
    cell: ({ row }) => {
      const handleCopyLink = async () => {
        await navigator.clipboard.writeText(row.original.transactionReferenceId);
        toast.success("Transaction reference copied to clipboard");
      }
      const ref = row.original.transactionReferenceId;
      const truncatedRef = ref ? `${ref.substring(0, 8)}...` : "";
      return <div className="flex items-center gap-2">
        <div className="font-mono text-sm" title={ref}>{truncatedRef || "—"}</div>
        <Button
          type="button"
          size="sm"
          className="h-8 w-8 p-0 bg-theme-dark-green"
          onClick={handleCopyLink}
          title="Copy Transaction Link"
        >
          <Copy className="h-4 w-4" />
        </Button>
      </div>;
    },
  },
  {
    accessorKey: "amountPaid",
    header: "Amount Paid",
    cell: ({ row }) => {
      const amount = row.original.amountPaid;
      return <div className="font-semibold">{formatCurrency(amount || 0)}</div>;
    },
  },
  {
    accessorKey: "settledAmount",
    header: "Settled Amount",
    cell: ({ row }) => {
      const amount = row.original.settledAmount;
      return <div className="font-semibold">{formatCurrency(amount || 0)}</div>;
    },
  },
  {
    accessorKey: "customerName",
    header: "Customer",
    cell: ({ row }) => {
      const customerName = row.original.customerName;
      return <div>{customerName || "—"}</div>;
    },
  },
  {
    accessorKey: "date",
    header: "Date & Time",
    cell: ({ row }) => {
      const date = row.original.date;
      return <div className="text-sm">{formatDateTime(date)}</div>;
    },
  },
  {
    accessorKey: "numoniPoints",
    header: "Numoni Points",
    cell: ({ row }) => {
      const points = row.original.numoniPoints;
      return <div className="font-semibold">{points?.toLocaleString() || "—"}</div>;
    },
  },
  {
    accessorKey: "operationType",
    header: "Operation Type",
    cell: ({ row }) => {
      const type = row.original.operationType;
      return (
        <div className={`px-2 py-1 rounded-full text-xs font-medium inline-block ${type === "PAY_OUT" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
          }`}>
          {type}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const statusColors: Record<string, string> = {
        "SUCCESSFUL": "bg-green-100 text-green-700",
        "COMPLETED": "bg-blue-100 text-blue-700",
        "PENDING": "bg-yellow-100 text-yellow-700",
        "FAILURE": "bg-red-100 text-red-700",
        "FAILED": "bg-red-100 text-red-700",
      };
      const colorClass = statusColors[status] || "bg-gray-100 text-gray-700";
      return (
        <div className={`px-2 py-1 rounded-full text-xs font-medium inline-block ${colorClass}`}>
          {status}
        </div>
      );
    },
  },
  {
    accessorKey: "transactionType",
    header: "Transaction Type",
    cell: ({ row }) => {
      const type = row.original.transactionType;
      return (
        <div className={`px-2 py-1 rounded-full text-xs font-medium inline-block ${type === "DEBIT" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
          }`}>
          {type}
        </div>
      );
    },
  }
];

export default function PosTransactionTable({ posId, merchantId }: { readonly posId: string, readonly merchantId: string }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const pageSize = 50;

  // Use date filter hook to manage date range and conversion
  const { dateRange, dateParams, setDateRange, handleCustomDatesChange } = useDateFilter();

  const { data, isPending, isError, error, refetch } = useGetPosTransactionList({
    posId,
    merchantId,
    page: currentPage,
    size: pageSize,
    ...dateParams,
  });

  // Reset to first page when search query or date range changes
  useEffect(() => {
    setCurrentPage(0);
  }, [searchQuery, dateRange, dateParams]);

  // Extract transaction data and pagination info from API response
  const allTransactionData = data?.data?.pageData as PosTransactionData[] | undefined;

  // Apply search filter to transaction data
  const transactionListData = useMemo(() => {
    if (!allTransactionData) return undefined;

    if (!searchQuery.trim()) {
      return allTransactionData;
    }

    const searchLower = searchQuery.toLowerCase().trim();
    return allTransactionData.filter((transaction) => {
      const customerName = transaction.customerName?.toLowerCase() || "";
      const customerEmail = transaction.customerEmail?.toLowerCase() || "";
      const customerPhoneNo = transaction.customerPhoneNo?.toLowerCase() || "";
      const transactionRef = transaction.transactionReferenceId?.toLowerCase() || "";
      const description = transaction.description?.toLowerCase() || "";
      const title = transaction.title?.toLowerCase() || "";
      const posName = transaction.posName?.toLowerCase() || "";
      const status = transaction.status?.toLowerCase() || "";
      const transactionType = transaction.transactionType?.toLowerCase() || "";
      const operationType = transaction.operationType?.toLowerCase() || "";
      const category = transaction.transactionCategory?.toLowerCase() || "";
      const amount = formatCurrency(transaction.amount || 0).toLowerCase();
      const amountPaid = formatCurrency(transaction.amountPaid || 0).toLowerCase();

      return (
        customerName.includes(searchLower) ||
        customerEmail.includes(searchLower) ||
        customerPhoneNo.includes(searchLower) ||
        transactionRef.includes(searchLower) ||
        description.includes(searchLower) ||
        title.includes(searchLower) ||
        posName.includes(searchLower) ||
        status.includes(searchLower) ||
        transactionType.includes(searchLower) ||
        operationType.includes(searchLower) ||
        category.includes(searchLower) ||
        amount.includes(searchLower) ||
        amountPaid.includes(searchLower)
      );
    });
  }, [allTransactionData, searchQuery]);

  const paginationData = data?.data;

  // Map API pagination response to PaginationInfo format
  const pagination: PaginationInfo | undefined = paginationData ? {
    isFirst: paginationData.isFirst,
    isLast: paginationData.isLast,
    currentPageElements: transactionListData?.length || 0,
    totalPages: paginationData.totalPages,
    pageSize: paginationData.pageSize,
    hasPrevious: paginationData.hasPrevious,
    hasNext: paginationData.hasNext,
    currentPage: paginationData.currentPage,
    totalElements: paginationData.totalElements,
  } : undefined;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (isPending) {
    return (
      <div className="bg-white rounded-2xl p-4 my-4">
        <LoadingSpinner size="lg" message="Loading transaction list..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white rounded-2xl p-4 my-4">
        <ErrorState
          title="Error loading transaction list"
          message={extractErrorMessage(error) || "Failed to load transaction list data. Please try again."}
          onRetry={refetch}
        />
      </div>
    );
  }

  if (!transactionListData || transactionListData.length === 0) {
    return (
      <div className="bg-gray-50 rounded-2xl p-4 m-8">
        <TransactionTableHeader
          title="POS Transactions"
          dateRange={dateRange}
          searchQuery={searchQuery}
          onDateRangeChange={setDateRange}
          onSearchChange={setSearchQuery}
          onDatesChange={handleCustomDatesChange}
          posId={posId}
          merchantId={merchantId}
        />
        <EmptyState
          title={searchQuery ? "No matching transactions found" : "No transactions found"}
          description={searchQuery ? "Try adjusting your search query" : "No transactions found for the selected date range"}
        />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 rounded-2xl p-4 m-8">
      <TransactionTableHeader
        title="POS Transactions"
        dateRange={dateRange}
        searchQuery={searchQuery}
        onDateRangeChange={setDateRange}
        onSearchChange={setSearchQuery}
        posId={posId}
        merchantId={merchantId}
      />
      <div className="overflow-x-auto">
        <DataTable columns={columns} data={transactionListData} />
      </div>
      {pagination && (
        <TransactionPagination
          currentPage={currentPage}
          totalPages={pagination.totalPages}
          totalRows={pagination.totalElements}
          currentPageDataLength={pagination.currentPageElements}
          pageSize={pagination.pageSize}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
