import { filterIcon } from "@/constant/icons";
import useGetTransactionList from "@/hooks/query/useGetTransactionList";
import { getCurrentDate, getYesterdayDate } from "@/lib/helper";
import { singleBranchDetails, Transaction } from "@/lib/types";
import Image from "next/image";
import { useState } from "react";
import TransactionList from "./transaction-list";
import TransactionPagination from "./transaction-pagination";
import TransactionSummary from "./transaction-summary";

export default function TransactionHistory({ singleBranch }: Readonly<{ singleBranch: singleBranchDetails }>) {
  const [currentPage, setCurrentPage] = useState(0);
  const fromDate = getYesterdayDate("dd-mm-yyyy") as string;
  const toDate = getCurrentDate("dd-mm-yyyy") as string;

  const { data, isPending, isError, error } = useGetTransactionList({ fromDate, toDate, page: currentPage });
  const transactionData: Transaction[] | undefined = data?.data?.pageData;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <main className="bg-white rounded-2xl p-6 my-4">
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
        <div className="bg-white rounded-2xl max-h-[750px] overflow-y-auto">
          <TransactionList
            transactionData={transactionData}
            isPending={isPending}
            isError={isError}
            error={error}
          />
        </div>

        {/* Pagination Controls */}
        {data?.data && (
          <TransactionPagination
            currentPage={currentPage}
            totalPages={data.data.totalPages}
            totalRows={data.data.totalRows}
            currentPageDataLength={transactionData?.length || 0}
            pageSize={10}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </main>
  );
}