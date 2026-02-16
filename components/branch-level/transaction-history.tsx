import { filterIcon } from "@/constant/icons";
import useGetTransactionList from "@/hooks/query/useGetTransactionList";
import { getCurrentDate, getYesterdayDate } from "@/lib/helper";
import { singleBranchDetails, Transaction } from "@/lib/types";
import Image from "next/image";
import { useRef, useState } from "react";
import { DataTablePagination } from "../ui/data-table-pagination";
import TransactionList from "./transaction-list";
import TransactionSummary from "./transaction-summary";

export default function TransactionHistory({ singleBranch }: Readonly<{ singleBranch: singleBranchDetails }>) {
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const containerRef = useRef<HTMLDivElement>(null);
  const fromDate = getYesterdayDate("dd-mm-yyyy") as string;
  const toDate = getCurrentDate("dd-mm-yyyy") as string;

  const { data, isPending, isError, error } = useGetTransactionList({ fromDate, toDate, page: currentPage, size: pageSize });
  const transactionData: Transaction[] | undefined = data?.data?.pageData;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    containerRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(0);
    containerRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main ref={containerRef} className="bg-white rounded-2xl p-6 my-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Transactions <br /> & Payment History</h1>
        <button className="bg-theme-gray border border-gray-100 text-black p-3 flex items-center gap-2 shadow-none hover:bg-gray-100 cursor-pointer rounded-full">
          <Image src={filterIcon} alt="filter-icon" width={20} height={20} />
        </button>
      </div>

      {/* Today's Summary */}
      <TransactionSummary singleBranch={singleBranch} />

      {/* Today's Transactions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Today&apos;s Transactions</h2>
        <div className="bg-white rounded-2xl max-h-[850px] overflow-auto border border-gray-100">
          <TransactionList
            transactionData={transactionData}
            isPending={isPending}
            isError={isError}
            error={error}
          />

          {/* Pagination Controls */}
          {data?.data && (
            <div className="min-w-fit">
              <DataTablePagination
                currentPage={currentPage}
                totalPages={data.data.totalPages}
                totalRows={data.data.totalRows}
                pageSize={pageSize}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
              />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}