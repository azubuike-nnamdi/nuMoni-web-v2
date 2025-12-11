'use client';

import EmptyState from "@/components/common/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import LoadingSpinner from "@/components/ui/loading-spinner";
import useGetPointsRedeemed from "@/hooks/query/useGetPointsRedeemed";
import { TransactionData } from "@/lib/types";
import { useEffect, useState } from "react";
import TransactionsTable, { PaginationInfo } from "../transactions-table";

export default function PointsRedeemed() {
  const [currentPage, setCurrentPage] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchValue);
      setCurrentPage(0); // Reset to first page when searching
    }, 500);

    return () => clearTimeout(timer);
  }, [searchValue]);

  const { data, isPending, isError, error } = useGetPointsRedeemed({
    page: currentPage,
    size: 10,
    search: debouncedSearch || undefined,
  });

  const pointsRedeemedData = data?.data?.data as TransactionData[] | undefined;
  const paginationInfo = data?.data?.pagination as PaginationInfo | undefined;

  // console.log('points redeemed', pointsRedeemedData);

  const isEmpty = !isPending && (!pointsRedeemedData || pointsRedeemedData.length === 0);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
  };

  if (isPending && !data) {
    return <LoadingSpinner size="lg" message="Loading points redeemed..." />;
  }

  if (isError) {
    return <ErrorState title="Error loading data" message={error?.message || "An error occurred while loading points redeemed."} />;
  }

  if (isEmpty) {
    return <EmptyState title="No data yet" description="No points redeemed yet." />;
  }

  return (
    <TransactionsTable
      data={pointsRedeemedData || []}
      title="Points Redeemed"
      pagination={paginationInfo}
      currentPage={currentPage}
      onPageChange={handlePageChange}
      searchValue={searchValue}
      onSearchChange={handleSearchChange}
      searchPlaceholder="Search by merchant, branch, deal..."
    />
  )
}