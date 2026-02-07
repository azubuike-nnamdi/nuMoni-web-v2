'use client';

import TransactionPagination from "@/components/branch-level/transaction-pagination";
import SearchInput from "@/components/common/search-input";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { formatCurrency, formatDateTime } from "@/lib/helper";
import { ColumnDef } from "@tanstack/react-table";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { PaginationInfo } from "../transactions-table";
import { PointsDistributedData } from "./types";

const columns: ColumnDef<PointsDistributedData>[] = [
  {
    accessorKey: "transactionReference",
    header: "Transaction Reference",
    cell: ({ row }) => {
      const handleCopyRef = async () => {
        try {
          await navigator.clipboard.writeText(row.original.transactionReference);
          toast.success("Transaction Reference copied to clipboard");
        } catch (err) {
          console.error("Failed to copy reference:", err);
        }
      };
      const ref = row.original.transactionReference;
      const truncatedRef = ref ? `${ref.substring(0, 8)}...` : "";
      return <div className="flex items-center gap-2">
        <div className="font-mono text-sm" title={ref}>{truncatedRef || "—"}</div>
        <Button
          type="button"
          size="sm"
          className="h-8 w-8 p-0 bg-theme-dark-green"
          onClick={handleCopyRef}
          title="Copy Transaction Reference"
        >
          <Copy className="h-4 w-4" />
        </Button>
      </div>;
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
    accessorKey: "branchName",
    header: "Branch",
    cell: ({ row }) => {
      const branchName = row.original.branchName;
      return <div>{branchName || "—"}</div>;
    },
  },
  {
    accessorKey: "transactionCategory",
    header: "Category",
    cell: ({ row }) => {
      const category = row.original.transactionCategory;
      return <div className="font-semibold text-sm">{category || "—"}</div>;
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.original.type;
      return (
        <div className={`px-2 py-1 rounded-full text-xs font-medium inline-block ${type === "ISSUE" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
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
      const amount = row.original.totalAmountPaid;
      return <div className="font-semibold">{formatCurrency(amount || 0)}</div>;
    },
  },
  {
    accessorKey: "settled",
    header: "Settled",
    cell: ({ row }) => {
      const settled = row.original.settled;
      return <div>{formatCurrency(settled || 0)}</div>;
    },
  },
  {
    accessorKey: "fees",
    header: "Commission",
    cell: ({ row }) => {
      const fees = row.original.fees;
      return <div>{formatCurrency(fees || 0)}</div>;
    },
  },
  {
    accessorKey: "paidInNumoniPoints",
    header: "nuPoints",
    cell: ({ row }) => {
      const points = row.original.paidInNumoniPoints;
      return <div className="font-semibold">{points?.toLocaleString() || "—"}</div>;
    },
  },
  {
    accessorKey: "paidInBrandPoints",
    header: "Redeemed Points",
    cell: ({ row }) => {
      const points = row.original.paidInBrandPoints;
      return <div className="font-semibold">{points?.toLocaleString() || "—"}</div>;
    },
  },
  {
    accessorKey: "issuedPoints",
    header: "Issued Points",
    cell: ({ row }) => {
      const points = row.original.issuedPoints;
      return <div className="font-semibold">{points?.toLocaleString() || "—"}</div>;
    },
  },
  {
    accessorKey: "timestamp",
    header: "Date",
    cell: ({ row }) => {
      const date = row.original.timestamp;
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
}: Readonly<PointsDistributedTableProps>) {
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

