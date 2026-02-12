import { CustomerAnalyticsData } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../ui/data-table";

const columns: ColumnDef<CustomerAnalyticsData>[] = [
  {
    accessorKey: "rank",
    header: "Rank",
  },
  {
    accessorKey: "customerName",
    header: "Customer Name",
  },
  {
    accessorKey: "totalTransactions",
    header: "Total Transactions",
  },
  {
    accessorKey: "totalSpent",
    header: "Total Spent",
  },
  {
    accessorKey: "mostShoppedBranch",
    header: "Most Shopped Branch",
  },
  {
    accessorKey: "customerId",
    header: "Customer ID",
  },

]
export default function CustomerTabTable({ customers, title }: Readonly<{ customers: CustomerAnalyticsData[], title: string }>) {
  return (
    <div className="">
      <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
      <DataTable columns={columns} data={customers} />
    </div>
  );
}