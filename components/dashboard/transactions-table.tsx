'use client';

import TransactionPagination from "@/components/branch-level/transaction-pagination";
import SearchInput from "@/components/common/search-input";
import { DataTable } from "@/components/ui/data-table";
import { formatCurrency, formatDateTime } from "@/lib/helper";
import { TransactionData } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";



const columns: ColumnDef<TransactionData>[] = [
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
    accessorKey: "branchName",
    header: "Branch",
    cell: ({ row }) => {
      const branchName = row.getValue("branchName") as string;
      return <div>{branchName || "—"}</div>;
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
    accessorKey: "brandPoints",
    header: "Brand Points",
    cell: ({ row }) => {
      const points = row.getValue("brandPoints") as number | null;
      return <div className="font-semibold">{points?.toLocaleString() || "—"}</div>;
    },
  },
  {
    accessorKey: "issuedPoints",
    header: "Issued Points",
    cell: ({ row }) => {
      const points = row.getValue("issuedPoints") as number | null;
      return <div className="font-semibold">{points?.toLocaleString() || "—"}</div>;
    },
  },
  {
    accessorKey: "amountByWallet",
    header: "Amount By Wallet",
    cell: ({ row }) => {
      const amount = row.getValue("amountByWallet") as number | null;
      return <div>{amount ? formatCurrency(amount) : "—"}</div>;
    },
  },
  {
    accessorKey: "amountBrandWallet",
    header: "Amount Brand Wallet",
    cell: ({ row }) => {
      const amount = row.getValue("amountBrandWallet") as number | null;
      return <div>{amount ? formatCurrency(amount) : "—"}</div>;
    },
  },
  {
    accessorKey: "balanceBeforeTransaction",
    header: "Balance Before",
    cell: ({ row }) => {
      const balance = row.getValue("balanceBeforeTransaction") as number | null;
      return <div>{balance !== null ? formatCurrency(balance) : "—"}</div>;
    },
  },
  {
    accessorKey: "balanceAfterTransaction",
    header: "Balance After",
    cell: ({ row }) => {
      const balance = row.getValue("balanceAfterTransaction") as number | null;
      return <div>{balance !== null ? formatCurrency(balance) : "—"}</div>;
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
    accessorKey: "invoiceNo",
    header: "Invoice No",
    cell: ({ row }) => {
      const invoiceNo = row.getValue("invoiceNo") as string;
      return <div className="font-mono text-xs">{invoiceNo || "—"}</div>;
    },
  },
  {
    accessorKey: "transactionNo",
    header: "Transaction No",
    cell: ({ row }) => {
      const transactionNo = row.getValue("transactionNo") as string | null;
      return <div className="font-mono text-xs">{transactionNo || "—"}</div>;
    },
  },
  // {
  //   accessorKey: "sourceTable",
  //   header: "Source Table",
  //   cell: ({ row }) => {
  //     const sourceTable = row.getValue("sourceTable") as string;
  //     return <div className="text-xs">{sourceTable?.replace(/_/g, " ") || "—"}</div>;
  //   },
  // },
  // {
  //   accessorKey: "incoming",
  //   header: "Direction",
  //   cell: ({ row }) => {
  //     const incoming = row.getValue("incoming") as boolean;
  //     const outgoing = row.original.outgoing;
  //     if (incoming) {
  //       return <div className="text-green-600 text-xs font-medium">Incoming</div>;
  //     } else if (outgoing) {
  //       return <div className="text-red-600 text-xs font-medium">Outgoing</div>;
  //     }
  //     return <div className="text-gray-500 text-xs">—</div>;
  //   },
  // },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const date = row.getValue("date") as string;
      return <div className="text-sm">{formatDateTime(date)}</div>;
    },
  },
];

export interface PaginationInfo {
  isFirst: boolean;
  isLast: boolean;
  currentPageElements: number;
  totalPages: number;
  pageSize: number;
  hasPrevious: boolean;
  hasNext: boolean;
  currentPage: number;
  totalElements: number;
}

interface TransactionsTableProps {
  data: TransactionData[];
  title?: string;
  pagination?: PaginationInfo;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  onDownload?: () => void;
  onInfo?: () => void;
  onDelete?: () => void;
}

export default function TransactionsTable({
  data,
  title = "Transactions",
  pagination,
  currentPage = 0,
  onPageChange,
  searchValue = "",
  onSearchChange,
  searchPlaceholder = "Search transactions...",
  onDownload,
  onInfo,
  onDelete
}: TransactionsTableProps) {
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
          onDownload={onDownload}
          onInfo={onInfo}
          onDelete={onDelete}
        />
      )}
    </div>
  );
}
