'use client';

import TransactionPagination from "@/components/branch-level/transaction-pagination";
import SearchInput from "@/components/common/search-input";
import { DataTable } from "@/components/ui/data-table";
import { formatCurrency, formatDateTime } from "@/lib/helper";
import { ColumnDef } from "@tanstack/react-table";
import { PointsDistributedData } from "./types";
import { PaginationInfo } from "../transactions-table";

const columns: ColumnDef<PointsDistributedData>[] = [
  {
    accessorKey: "transactionReference",
    header: "Transaction Reference",
    cell: ({ row }) => {
      const ref = row.getValue("transactionReference") as string;
      const truncatedRef = ref ? `${ref.substring(0, 8)}...` : "";
      return <div className="font-mono text-sm" title={ref}>{truncatedRef || "—"}</div>;
    },
  },
  {
    accessorKey: "customerName",
    header: "Customer",
    cell: ({ row }) => {
      const customerName = row.getValue("customerName") as string;
      return <div>{customerName || "—"}</div>;
    },
  },
  {
    accessorKey: "source",
    header: "Source",
    cell: ({ row }) => {
      const source = row.getValue("source") as string;
      return <div className="max-w-xs truncate" title={source}>{source || "—"}</div>;
    },
  },
  {
    accessorKey: "merchantName",
    header: "Merchant",
    cell: ({ row }) => {
      const merchantName = row.getValue("merchantName") as string;
      return <div>{merchantName || "—"}</div>;
    },
  },
  {
    accessorKey: "branchName",
    header: "Branch",
    cell: ({ row }) => {
      const branchName = row.getValue("branchName") as string;
      return <div>{branchName || "—"}</div>;
    },
  },
  {
    accessorKey: "transactionCategory",
    header: "Category",
    cell: ({ row }) => {
      const category = row.getValue("transactionCategory") as string;
      return <div className="font-semibold text-sm">{category || "—"}</div>;
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue("type") as string;
      return (
        <div className={`px-2 py-1 rounded-full text-xs font-medium inline-block ${
          type === "ISSUE" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
        }`}>
          {type}
        </div>
      );
    },
  },
  {
    accessorKey: "totalAmountPaid",
    header: "Amount Paid",
    cell: ({ row }) => {
      const amount = row.getValue("totalAmountPaid") as number;
      return <div className="font-semibold">{formatCurrency(amount || 0)}</div>;
    },
  },
  {
    accessorKey: "settled",
    header: "Settled",
    cell: ({ row }) => {
      const settled = row.getValue("settled") as number;
      return <div>{formatCurrency(settled || 0)}</div>;
    },
  },
  {
    accessorKey: "fees",
    header: "Fees",
    cell: ({ row }) => {
      const fees = row.getValue("fees") as number;
      return <div>{formatCurrency(fees || 0)}</div>;
    },
  },
  {
    accessorKey: "paidInNumoniPoints",
    header: "Numoni Points",
    cell: ({ row }) => {
      const points = row.getValue("paidInNumoniPoints") as number;
      return <div className="font-semibold">{points?.toLocaleString() || "—"}</div>;
    },
  },
  {
    accessorKey: "paidInBrandPoints",
    header: "Brand Points",
    cell: ({ row }) => {
      const points = row.getValue("paidInBrandPoints") as number;
      return <div className="font-semibold">{points?.toLocaleString() || "—"}</div>;
    },
  },
  {
    accessorKey: "issuedPoints",
    header: "Issued Points",
    cell: ({ row }) => {
      const points = row.getValue("issuedPoints") as number;
      return <div className="font-semibold">{points?.toLocaleString() || "—"}</div>;
    },
  },
  {
    accessorKey: "timestamp",
    header: "Date",
    cell: ({ row }) => {
      const date = row.getValue("timestamp") as string;
      return <div className="text-sm">{formatDateTime(date)}</div>;
    },
  },
];

interface PointsDistributedTableProps {
  data: PointsDistributedData[];
  title?: string;
  pagination?: PaginationInfo;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
}

export default function PointsDistributedTable({
  data,
  title = "Points Distributed",
  pagination,
  currentPage = 0,
  onPageChange,
  searchValue = "",
  onSearchChange,
  searchPlaceholder = "Search by merchant, branch, deal...",
}: PointsDistributedTableProps) {
  return (
    <div className="bg-white rounded-2xl p-4 my-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
        {onSearchChange && (
          <SearchInput
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={onSearchChange}
            maxWidth="max-w-xs"
          />
        )}
      </div>
      <div className="overflow-x-auto">
        <DataTable columns={columns} data={data} />
      </div>
      {pagination && onPageChange && data.length > 0 && (
        <TransactionPagination
          currentPage={currentPage}
          totalPages={pagination.totalPages}
          totalRows={pagination.totalElements}
          currentPageDataLength={pagination.currentPageElements}
          pageSize={pagination.pageSize}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}

