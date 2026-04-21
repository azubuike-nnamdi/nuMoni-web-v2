import { formatCurrency } from "@/lib/helper";
import { CustomerAnalyticsData } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../ui/data-table";
import { DataTablePagination } from "../ui/data-table-pagination";

const columns: ColumnDef<CustomerAnalyticsData>[] = [
  // {
  //   accessorKey: "rank",
  //   header: "Rank",
  // },
  {
    accessorKey: "customerName",
    header: "Customer Name",
    cell: ({ row }) => row.original.customerName || "N/A",
  },
  {
    accessorKey: "customerId",
    header: "Customer ID",
  },
  {
    accessorKey: "totalTransactions",
    header: "Total Transactions",
  },
  {
    accessorKey: "totalSpent",
    header: "Total Spent",
    cell: ({ row }) => formatCurrency(row.original.totalSpent),
  },
  {
    accessorKey: "averageOrderAmount",
    header: "Avg Order",
    cell: ({ row }) => formatCurrency(row.original.averageOrderAmount),
  },
  {
    accessorKey: "totalPointReceived",
    header: "Total Points Received",
  },
  {
    accessorKey: "totalPointSpent",
    header: "Total Points Spent",
  },
  {
    accessorKey: "mostShoppedBranch",
    header: "Most Shopped Branch",
    cell: ({ row }) => row.original.mostShoppedBranch || "N/A",
  },
  {
    accessorKey: "averageReviewScore",
    header: "Review Score",
    cell: ({ row }) => row.original.averageReviewScore.toFixed(1),
  },
];

interface CustomerTabTableProps {
  customers: CustomerAnalyticsData[];
  title: string;
  currentPage: number;
  totalPages: number;
  totalRows: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export default function CustomerTabTable({
  customers,
  title,
  currentPage,
  totalPages,
  totalRows,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: Readonly<CustomerTabTableProps>) {
  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
      <div className="rounded-md border border-gray-200 overflow-hidden">
        <DataTable columns={columns} data={customers} />
        <DataTablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalRows={totalRows}
          pageSize={pageSize}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      </div>
    </div>
  );
}