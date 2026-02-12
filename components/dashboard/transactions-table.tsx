"use client";

import TransactionPagination from "@/components/branch-level/transaction-pagination";
import SearchInput from "@/components/common/search-input";
import { DataTable } from "@/components/ui/data-table";
import { formatCurrency, formatDateTime } from "@/lib/helper";
import { TransactionData } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
// ... imports

const columns: ColumnDef<TransactionData>[] = [
  {
    accessorKey: "transactionReferenceId",
    header: "Transaction Reference",
    cell: ({ row }) => {
      const ref = row.original.transactionReferenceId;
      const truncatedRef = ref ? `${ref.substring(0, 8)}...` : "";
      const handleCopyLink = async () => {
        await navigator.clipboard.writeText(ref);
        toast.success(" Transaction Reference copied to clipboard");
      };
      return (
        <div className="font-mono text-sm" title={ref}>
          {truncatedRef || "—"}
          {ref && (
            <Button
              type="button"
              size="sm"
              className="h-8 w-8 p-0 bg-theme-dark-green"
              onClick={handleCopyLink}
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
      const handleCopyId = async () => {
        await navigator.clipboard.writeText(row.original.posId || "");
        toast.success("POS ID copied to clipboard");
      }
      const ref = row.original.posId;
      const truncatedRef = ref ? `${ref.substring(0, 8)}...` : "";
      return (
        <div className="flex items-center gap-2">
          <div className="font-mono text-sm" title={ref || ""}>{truncatedRef || "—"}</div>
          <Button
            type="button"
            size="sm"
            className="h-8 w-8 p-0 bg-theme-dark-green"
            onClick={handleCopyId}
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
    cell: ({ row }) => {
      const customerName = row.original.customerName;
      return <div>{customerName || "—"}</div>;
    },
  },

  {
    accessorKey: "amountPaid",
    header: "Amount Paid",
    cell: ({ row }) => {
      const amount = row.original.amountPaid;
      return (
        <div className="font-semibold">{formatCurrency(amount || 0)}</div>
      );
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = row.original.amount;
      return (
        <div className="font-semibold">{formatCurrency(amount || 0)}</div>
      );
    },
  },
  {
    accessorKey: "settledAmount",
    header: "Settled Amount",
    cell: ({ row }) => {
      const amount = row.original.settledAmount;
      return <div>{amount ? formatCurrency(amount) : "—"}</div>;
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
    accessorKey: "numoniPoints",
    header: "Numoni Points",
    cell: ({ row }) => {
      const points = row.original.numoniPoints;
      return (
        <div className="font-semibold">
          {points?.toLocaleString() || "—"}
        </div>
      );
    },
  },
  {
    accessorKey: "brandPoints",
    header: "Brand Points",
    cell: ({ row }) => {
      const points = row.original.brandPoints;
      return (
        <div className="font-semibold">
          {points?.toLocaleString() || "—"}
        </div>
      );
    },
  },
  {
    accessorKey: "issuedPoints",
    header: "Issued Points",
    cell: ({ row }) => {
      const points = row.original.issuedPoints;
      return (
        <div className="font-semibold">
          {points?.toLocaleString() || "—"}
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
          {status ?? "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "transactionType",
    header: "Type",
    cell: ({ row }) => {
      const type = row.original.transactionType;
      return (
        <div
          className={`px-2 py-1 rounded-full text-xs font-medium inline-block ${type === "DEBIT"
            ? "bg-red-100 text-red-700"
            : "bg-green-100 text-green-700"
            }`}
        >
          {type ?? "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "invoiceNo",
    header: "Invoice No",
    cell: ({ row }) => {
      const invoiceNo = row.original.invoiceNo;
      const truncatedRef = invoiceNo ? `${invoiceNo.substring(0, 8)}...` : "";
      const handleCopyInvoiceNo = async () => {
        await navigator.clipboard.writeText(invoiceNo);
        toast.success("Invoice No copied to clipboard");
      };
      return (
        <div className="flex items-center gap-2">
          <div className="font-mono text-sm" title={invoiceNo}>{truncatedRef || "—"}</div>
          {invoiceNo && (
            <Button
              type="button"
              size="sm"
              className="h-8 w-8 p-0 bg-theme-dark-green"
              onClick={handleCopyInvoiceNo}
              title="Copy Invoice No"
            >
              <Copy className="h-4 w-4" />
            </Button>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "transactionNo",
    header: "Transaction No",
    cell: ({ row }) => {
      const transactionNo = row.original.transactionNo;
      const truncatedRef = transactionNo ? `${transactionNo.substring(0, 8)}...` : "";
      const handleCopyTransactionNo = async () => {
        await navigator.clipboard.writeText(transactionNo);
        toast.success("Transaction No copied to clipboard");
      };
      return (
        <div className="flex items-center gap-2">
          <div className="font-mono text-sm" title={transactionNo}>{truncatedRef || "—"}</div>
          {transactionNo && (
            <Button
              type="button"
              size="sm"
              className="h-8 w-8 p-0 bg-theme-dark-green"
              onClick={handleCopyTransactionNo}
              title="Copy Transaction No"
            >
              <Copy className="h-4 w-4" />
            </Button>
          )}
        </div>
      );
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
      const date = row.original.date;
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

// ...

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
  searchType?: string;
  onSearchTypeChange?: (value: string) => void;
  dateSelector?: React.ReactNode;
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
  onDelete,
  searchType,
  onSearchTypeChange,
  dateSelector,
}: Readonly<TransactionsTableProps>) {
  return (
    <div className="bg-white rounded-2xl p-4 my-4">
      <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-4">
        <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
        <div className="flex flex-col md:flex-row items-center gap-2 w-full md:w-auto">
          {dateSelector}
          {onSearchTypeChange && (
            <Select value={searchType} onValueChange={onSearchTypeChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="transactionReference">Transaction Reference</SelectItem>
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
