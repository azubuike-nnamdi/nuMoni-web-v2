"use client";

import SearchInput from "@/components/common/search-input";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency, formatDateTime } from "@/lib/helper";
import { TransactionData } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { PaginationInfo } from "../transactions-table";

const pointsRedeemedColumns: ColumnDef<TransactionData>[] = [
  {
    accessorKey: "transactionReferenceId",
    header: "Transaction Reference",
    cell: ({ row }) => {
      const ref = row.original.transactionReferenceId;
      const truncatedRef = ref ? `${ref.substring(0, 8)}...` : "";
      const handleCopy = async () => {
        await navigator.clipboard.writeText(ref);
        toast.success("Transaction Reference copied to clipboard");
      };
      return (
        <div className="flex items-center gap-2">
          <div className="font-mono text-sm" title={ref}>
            {truncatedRef || "—"}
          </div>
          {ref && (
            <Button
              type="button"
              size="sm"
              className="h-8 w-8 p-0 bg-theme-dark-green"
              onClick={handleCopy}
              title="Copy Transaction Reference"
            >
              <Copy className="h-4 w-4" />
            </Button>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "posId",
    header: "POS ID",
    cell: ({ row }) => {
      const ref = row.original.posId;
      const truncatedRef = ref ? `${ref.substring(0, 8)}...` : "";
      const handleCopy = async () => {
        await navigator.clipboard.writeText(ref || "");
        toast.success("POS ID copied to clipboard");
      };
      return (
        <div className="flex items-center gap-2">
          <div className="font-mono text-sm" title={ref || ""}>
            {truncatedRef || "—"}
          </div>
          <Button
            type="button"
            size="sm"
            className="h-8 w-8 p-0 bg-theme-dark-green"
            onClick={handleCopy}
            title="Copy POS ID"
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
  {
    accessorKey: "customerName",
    header: "Customer",
    cell: ({ row }) => <div>{row.original.customerName || "—"}</div>,
  },
  {
    accessorKey: "totalAmountPaid",
    header: "Total Amount Paid",
    cell: ({ row }) => {
      const amount = row.original.totalAmountPaid;
      return <div className="font-semibold">{formatCurrency(amount || 0)}</div>;
    },
  },
  {
    accessorKey: "paidInNumoniPoints",
    header: "Amount in nuPoints",
    cell: ({ row }) => {
      const points = row.original.paidInNumoniPoints;
      return (
        <div className="font-semibold">{points?.toLocaleString() || "—"}</div>
      );
    },
  },
  {
    accessorKey: "paidInBrandPoints",
    header: "Amount in Brand Points",
    cell: ({ row }) => {
      const points = row.original.paidInBrandPoints;
      return (
        <div className="font-semibold">{points?.toLocaleString() || "—"}</div>
      );
    },
  },
  {
    accessorKey: "settled",
    header: "Settled Amount",
    cell: ({ row }) => {
      const amount = row.original.settled;
      return (
        <div className="font-semibold">{amount?.toLocaleString() || "—"}</div>
      );
    },
  },
  {
    accessorKey: "transactionCategory",
    header: "Category",
    cell: ({ row }) => {
      const category = row.original.transactionCategory;
      return (
        <div className="font-semibold text-sm">
          {category?.replaceAll("_", " ") || "—"}
        </div>
      );
    },
  },
  {
    accessorKey: "posLocation",
    header: "POS Location",
    cell: ({ row }) => <div>{row.original.posLocation || "—"}</div>,
  },
  {
    accessorKey: "posBankName",
    header: "POS Bank Name",
    cell: ({ row }) => {
      const posBankName = row.original.posBankName;
      return <div>{posBankName || "—"}</div>;
    },
  },
  {
    accessorKey: "posAccountNumber",
    header: "POS Account Number",
    cell: ({ row }) => {
      const posAccountNumber = row.original.posAccountNumber;
      return <div>{posAccountNumber || "—"}</div>;
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
    accessorKey: "branchName",
    header: "Branch",
    cell: ({ row }) => <div>{row.original.branchName || "—"}</div>,
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.original.type;
      return (
        <div
          className={`px-2 py-1 rounded-full text-xs font-medium inline-block ${type === "ISSUE"
            ? "bg-red-100 text-red-700"
            : "bg-green-100 text-green-700"
            }`}
        >
          {type ?? "—"}
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
        SUCCESSFUL: "bg-green-100 text-green-700",
        COMPLETED: "bg-blue-100 text-blue-700",
        PENDING: "bg-yellow-100 text-yellow-700",
        FAILED: "bg-red-100 text-red-700",
      };
      const colorClass = statusColors[status] || "bg-gray-100 text-gray-700";
      return (
        <div
          className={`px-2 py-1 rounded-full text-xs font-medium inline-block ${colorClass}`}
        >
          {status ?? "—"}
        </div>
      );
    },
  },
  {
    id: "date",
    header: "Date",
    cell: ({ row }) => {
      const date = row.original.createdDt || row.original.timestamp;
      return (
        <div className="text-sm">{date ? formatDateTime(date) : "—"}</div>
      );
    },
  },
];

interface PointsRedeemedTableProps {
  data: TransactionData[];
  title?: string;
  pagination?: PaginationInfo;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  searchType?: string;
  onSearchTypeChange?: (value: string) => void;
  dateSelector?: React.ReactNode;
  exportButton?: React.ReactNode;
}

export default function PointsRedeemedTable({
  data,
  title = "Points Redeemed",
  pagination,
  currentPage = 0,
  onPageChange,
  onPageSizeChange,
  searchValue = "",
  onSearchChange,
  searchPlaceholder = "Search transactions...",
  searchType,
  onSearchTypeChange,
  dateSelector,
  exportButton,
}: Readonly<PointsRedeemedTableProps>) {
  return (
    <div className="bg-white rounded-2xl p-4 my-4">
      <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-4">
        <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
        <div className="flex flex-col md:flex-row items-center gap-2 w-full md:w-auto">
          {dateSelector}
          {exportButton}
          {onSearchTypeChange && (
            <Select value={searchType} onValueChange={onSearchTypeChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="transactionReference">
                  Transaction Reference
                </SelectItem>
                <SelectItem value="posId">POS ID</SelectItem>
                <SelectItem value="customerName">Customer Name</SelectItem>
                <SelectItem value="posLocation">POS Location</SelectItem>
              </SelectContent>
            </Select>
          )}
          {onSearchChange && (
            <SearchInput
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={onSearchChange}
              maxWidth="max-w-xs"
            />
          )}
        </div>
      </div>
      <div className="overflow-x-auto border-t border-gray-100">
        <DataTable columns={pointsRedeemedColumns} data={data} />
      </div>
      {pagination && onPageChange && data.length > 0 && (
        <DataTablePagination
          currentPage={currentPage}
          totalPages={pagination.totalPages}
          totalRows={pagination.totalElements}
          pageSize={pagination.pageSize}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange || (() => { })}
        />
      )}
    </div>
  );
}
