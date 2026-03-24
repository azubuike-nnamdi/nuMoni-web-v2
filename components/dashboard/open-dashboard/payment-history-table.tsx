'use client';

import EmptyState from "@/components/common/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { ErrorState } from "@/components/ui/error-state";
import LoadingSpinner from "@/components/ui/loading-spinner";
import useGetMerchantTransaction from "@/hooks/query/useGetMerchantTransaction";
import { extractErrorMessage, formatCurrency, formatDateTime, formatSnakeCase, getStatusColor, getTimelineDates } from "@/lib/helper";
import { TransactionHistoryData } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Copy, RefreshCcw } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { PaymentHistoryFilters, PaymentHistoryFiltersState } from "./payment-history-filters";

interface PaymentHistoryTableProps {
  merchantId: string;
}

const columns: ColumnDef<TransactionHistoryData>[] = [
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const date = row.original.date || row.original.createdDt;
      return <div className="text-sm whitespace-nowrap text-gray-600">{date ? formatDateTime(date) : "—"}</div>;
    },
  },
  {
    accessorKey: "transactionNo",
    header: "Transaction Ref",
    cell: ({ row }) => {
      const ref = row.original.transactionNo || row.original.transactionId;
      const truncatedRef = ref ? `${ref.substring(0, 8)}...` : "—";
      const handleCopy = () => {
        if (ref) {
          navigator.clipboard.writeText(ref);
          toast.success("Transaction reference copied");
        }
      };
      return (
        <div className="flex items-center gap-2 font-mono text-[11px] text-gray-500">
          <span title={ref || ""}>{truncatedRef}</span>
          {ref && (
            <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-gray-100" onClick={handleCopy}>
              <Copy className="h-3 w-3" />
            </Button>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "customerName",
    header: "Customer",
    cell: ({ row }) => {
      const name = row.original.customerName;
      const email = row.original.customerEmail;
      const phone = row.original.customerPhoneNo;
      return (
        <div className="flex flex-col min-w-[150px]">
          <span className="font-semibold text-gray-900">{name || "Anonymous"}</span>
          <span className="text-[11px] text-gray-400 truncate max-w-[200px]">{email || phone || "No contact info"}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "operationType",
    header: "Category",
    cell: ({ row }) => {
      const op = row.original.operationType?.replaceAll("_", " ");
      return <Badge variant="outline" className="capitalize font-medium text-[11px] border-gray-200">{op?.toLowerCase() || "—"}</Badge>;
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = row.original.amount;
      const type = row.original.transactionType; // CREDIT or DEBIT
      const isCredit = type === 'CREDIT';
      return (
        <div className={`font-bold text-sm ${isCredit ? 'text-green-600' : 'text-rose-600'}`}>
          {isCredit ? '+' : '-'}{formatCurrency(amount || 0)}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status || "";
      return (
        <Badge className={`rounded-full shadow-none text-[10px] font-bold px-3 py-0.5 ${getStatusColor(status)}`}>
          {formatSnakeCase(status)}
        </Badge>
      );
    },
  },
];

export function PaymentHistoryTable({
  merchantId
}: Readonly<PaymentHistoryTableProps>) {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);

  const [filters, setFilters] = useState<PaymentHistoryFiltersState>({
    filterType: 'customerEmail',
    searchValue: "",
    debouncedSearchValue: "",
    dateRangeOption: 'Today',
  });

  const { startDate, endDate } = useMemo(() => {
    if (filters.dateRangeOption === 'Custom Range') {
      return {
        startDate: filters.customStartDate ? format(filters.customStartDate, "dd-MM-yyyy") : undefined,
        endDate: filters.customEndDate ? format(filters.customEndDate, "dd-MM-yyyy") : undefined,
      };
    }
    return getTimelineDates(filters.dateRangeOption || 'Today');
  }, [filters.dateRangeOption, filters.customStartDate, filters.customEndDate]);

  const { data, isPending, error, isError, refetch } = useGetMerchantTransaction({
    merchantId,
    startDate,
    endDate,
    customerEmail: filters.filterType === 'customerEmail' ? filters.debouncedSearchValue : undefined,
    customerPhoneNo: filters.filterType === 'customerPhoneNo' ? filters.debouncedSearchValue : undefined,
    customerId: filters.filterType === 'customerId' ? filters.debouncedSearchValue : undefined,
    page,
    size: pageSize
  });

  const transactions = useMemo(() => data?.data?.data?.pageData || [], [data]);
  const pagination = data?.data;

  const renderBody = () => {
    if (isPending) {
      return (
        <div className="p-12 flex justify-center items-center">
          <LoadingSpinner size="lg" message="Loading transaction history..." />
        </div>
      );
    }
    if (isError) {
      return (
        <div className="p-6">
          <ErrorState
            title="Failed to load transaction history"
            message={extractErrorMessage(error)}
            onRetry={refetch}
          />
        </div>
      );
    }
    if (transactions.length === 0) {
      return (
        <div className="py-20">
          <EmptyState
            title="No transactions found"
            description="Try adjusting your filters or date range to see more results."
          />
        </div>
      );
    }
    return (
      <>
        <div className="overflow-x-auto p-4">
          <DataTable columns={columns} data={transactions} />
        </div>
        {pagination && (
          <DataTablePagination
            currentPage={page}
            totalPages={pagination.totalPages}
            totalRows={pagination.totalElements}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        )}
      </>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-none overflow-hidden mt-6">
      <div className="p-6 border-b border-gray-50 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Transaction History</h2>
          <p className="text-sm text-gray-500">View and manage all your merchant transactions.</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-2 text-gray-600 border-gray-200">
          <RefreshCcw className="h-4 w-4" />
          Refresh
        </Button>
      </div>
      <div className="px-6 pt-6">
        <PaymentHistoryFilters onFiltersChange={setFilters} />
      </div>
      {renderBody()}
    </div>
  );
}