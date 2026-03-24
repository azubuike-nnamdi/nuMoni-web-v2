"use client";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { formatCurrency, formatDateTime, formatSnakeCase, getStatusColor } from "@/lib/helper";
import { TransactionHistoryData } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpRight, Copy } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { PaginationInfo } from "../transactions-table";

const transactionHistoryColumns: ColumnDef<TransactionHistoryData>[] = [
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
      const posId = row.original.posId;
      return <div>{posId || "—"}</div>;
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
    accessorKey: "amountPaid",
    header: "Total Amount Paid",
    cell: ({ row }) => {
      const amount = row.original.amountPaid;
      return <div className="font-semibold">{formatCurrency(amount || 0)}</div>;
    },
  },
  {
    accessorKey: "numoniPoints",
    header: "Amount in nuPoints",
    cell: ({ row }) => {
      const points = row.original.numoniPoints;
      return (
        <div className="font-semibold">{points?.toLocaleString() || "—"}</div>
      );
    },
  },
  {
    accessorKey: "brandPoints",
    header: "Amount in Brand Points",
    cell: ({ row }) => {
      const points = row.original.brandPoints;
      return (
        <div className="font-semibold">{points?.toLocaleString() || "—"}</div>
      );
    },
  },
  {
    accessorKey: "settledAmount",
    header: "Settled Amount",
    cell: ({ row }) => {
      const amount = row.original.settledAmount;
      return (
        <div className="font-semibold">{amount?.toLocaleString() || "—"}</div>
      );
    },
  },
  {
    accessorKey: "transactionCategory",
    header: "Transaction Category",
    cell: ({ row }) => {
      return <div>{formatSnakeCase(row.original.transactionCategory)}</div>;
    },
  },
  {
    accessorKey: "posLocation",
    header: "POS Location",
    cell: ({ row }) => {
      const posLocation = row.original.posLocation;
      return <div>{posLocation || "—"}</div>;
    },
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
    cell: ({ row }) => {
      const branchName = row.original.branchName;
      return <div>{branchName || "—"}</div>;
    },
  },

  {
    accessorKey: "issuedPoints",
    header: "Issued Points",
    cell: ({ row }) => {
      const points = row.original.issuedPoints;
      return (
        <div className="font-semibold">{points?.toLocaleString() || "—"}</div>
      );
    },
  },
  {
    accessorKey: "walletType",
    header: "Wallet Type",
    cell: ({ row }) => {
      return <div>{formatSnakeCase(row.original.walletType)}</div>;
    },
  },
  {
    accessorKey: "confirmPayment",
    header: "Confirm Payment",
    cell: ({ row }) => {
      const merchantName = row.original.merchantName;
      const merchantId = row.original.merchantId;

      const handleCopyLink = async () => {
        try {
          const baseUrl = globalThis.window ? globalThis.window.location.origin : '';
          const encodedMerchantName = encodeURIComponent(merchantName || '');
          const transactionLink = `${baseUrl}/payment-transaction-history?merchantName=${encodedMerchantName}&merchantId=${merchantId}`;
          await navigator.clipboard.writeText(transactionLink);
          toast.success("Transaction link copied to clipboard");
        } catch {
          toast.error("Failed to copy link");
        }
      };

      return (
        <div className="flex items-center gap-2">
          <Link href={`/payment-transaction-history?merchantName=${encodeURIComponent(merchantName || '')}&merchantId=${merchantId}`} target="_blank">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              title="View Transactions"
            >
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </Link>
          <Button
            type="button"
            size="sm"
            className="h-8 w-8 p-0 bg-theme-dark-green"
            onClick={handleCopyLink}
            title="Copy Transaction Link"
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <div
          className={`px-2 py-1 rounded-full text-xs font-medium inline-block border ${status ? getStatusColor(status) : "bg-gray-100 text-gray-800 border-gray-200"}`}
        >
          {status ?? "—"}
        </div>
      );
    },
  },
  {
    accessorKey: "createdDt",
    header: "Date",
    cell: ({ row }) => {
      const date = row.original.createdDt;
      return (
        <div className="text-sm">{date ? formatDateTime(date) : "—"}</div>
      );
    },
  },
];

interface TransactionHistoryTableProps {
  data: TransactionHistoryData[];
  pagination?: PaginationInfo;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

export default function TransactionHistoryTable({
  data,
  pagination,
  currentPage = 0,
  onPageChange,
  onPageSizeChange,
}: Readonly<TransactionHistoryTableProps>) {
  return (
    <div className="overflow-x-auto border-t border-gray-100">
      <DataTable columns={transactionHistoryColumns} data={data} />
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
