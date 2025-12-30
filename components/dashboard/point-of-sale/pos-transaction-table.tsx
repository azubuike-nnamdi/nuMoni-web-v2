'use client';

import TransactionPagination from "@/components/branch-level/transaction-pagination";
import { DataTable } from "@/components/ui/data-table";
import { ErrorState } from "@/components/ui/error-state";
import LoadingSpinner from "@/components/ui/loading-spinner";
import useGetPosTransactionList from "@/hooks/query/useGetPosTransactionList";
import { formatCurrency, formatDateTime } from "@/lib/helper";
import { TransactionData } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { PaginationInfo } from "../transactions-table";

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
      const ref = row.getValue("transactionReferenceId") as string;
      const truncatedRef = ref ? `${ref.substring(0, 8)}...` : "";
      return <div className="font-mono text-sm" title={ref}>{truncatedRef || "—"}</div>;
    },
  },
  {
    accessorKey: "customerName",
    header: "Customer",
    cell: ({ row }) => {
      const customerName = row.getValue("customerName") as string | null;
      return <div>{customerName || "—"}</div>;
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const description = row.getValue("description") as string;
      return <div className="max-w-xs truncate" title={description}>{description || "—"}</div>;
    },
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
      const title = row.getValue("title") as string;
      return <div>{title || "—"}</div>;
    },
  },
  {
    accessorKey: "posName",
    header: "POS Name",
    cell: ({ row }) => {
      const posName = row.original.posName;
      return <div>{posName || "—"}</div>;
    },
  },
  {
    accessorKey: "operationType",
    header: "Operation Type",
    cell: ({ row }) => {
      const operationType = row.getValue("operationType") as string;
      return <div className="text-sm">{operationType?.replace(/_/g, " ") || "—"}</div>;
    },
  },
  {
    accessorKey: "transactionCategory",
    header: "Category",
    cell: ({ row }) => {
      const category = row.getValue("transactionCategory") as string;
      return <div className="font-semibold text-sm">{category?.replace(/_/g, " ") || "—"}</div>;
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = row.getValue("amount") as number;
      return <div className="font-semibold">{formatCurrency(amount || 0)}</div>;
    },
  },
  {
    accessorKey: "amountPaid",
    header: "Amount Paid",
    cell: ({ row }) => {
      const amount = row.getValue("amountPaid") as number;
      return <div className="font-semibold">{formatCurrency(amount || 0)}</div>;
    },
  },
  {
    accessorKey: "settledAmount",
    header: "Settled Amount",
    cell: ({ row }) => {
      const amount = row.getValue("settledAmount") as number | null;
      return <div>{amount ? formatCurrency(amount) : "—"}</div>;
    },
  },
  {
    accessorKey: "fee",
    header: "Fee",
    cell: ({ row }) => {
      const fee = row.getValue("fee") as number | null;
      return <div>{fee ? formatCurrency(fee) : "—"}</div>;
    },
  },
  {
    accessorKey: "numoniPoints",
    header: "Numoni Points",
    cell: ({ row }) => {
      const points = row.getValue("numoniPoints") as number | null;
      return <div className="font-semibold">{points?.toLocaleString() || "—"}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
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
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue("transactionType") as string;
      return (
        <div className={`px-2 py-1 rounded-full text-xs font-medium inline-block ${type === "DEBIT" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
          }`}>
          {type}
        </div>
      );
    },
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const date = row.getValue("date") as string;
      return <div className="text-sm">{formatDateTime(date)}</div>;
    },
  },
];

export default function PosTransactionTable({ posId, merchantId }: { posId: string, merchantId: string }) {
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 50;

  const { data, isPending, isError, error, refetch } = useGetPosTransactionList({
    posId,
    merchantId,
    page: currentPage,
    size: pageSize,
  });

  // Extract transaction data and pagination info from API response
  const transactionListData = data?.data?.pageData as PosTransactionData[] | undefined;
  const paginationData = data?.data;

  // Map API pagination response to PaginationInfo format
  const pagination: PaginationInfo | undefined = paginationData ? {
    isFirst: paginationData.isFirst,
    isLast: paginationData.isLast,
    currentPageElements: paginationData.pageData?.length || 0,
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
          message={error?.message || "Failed to load transaction list data. Please try again."}
          onRetry={refetch}
        />
      </div>
    );
  }

  if (!transactionListData || transactionListData.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-4 my-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-semibold text-gray-900">POS Transactions</h1>
        </div>
        <div className="text-center py-12">
          <p className="text-gray-500">No transactions found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 rounded-2xl p-4 m-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold text-gray-900">POS Transactions</h1>
      </div>
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
