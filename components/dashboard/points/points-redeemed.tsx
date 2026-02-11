'use client';

import { ErrorState } from "@/components/ui/error-state";
import LoadingSpinner from "@/components/ui/loading-spinner";
import useGetPointsRedeemed from "@/hooks/query/useGetPointsRedeemed";
import { getSearchPlaceholder } from "@/lib/helper";
import { TransactionData } from "@/lib/types";
// other imports
import { useEffect, useState } from "react";
import TransactionsTable, { PaginationInfo } from "../transactions-table";

export default function PointsRedeemed() {
  const [currentPage, setCurrentPage] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [searchType, setSearchType] = useState("transactionReference");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchValue);
      setCurrentPage(0); // Reset to first page when searching
    }, 500);

    return () => clearTimeout(timer);
  }, [searchValue]);

  // Reset page when search type changes
  useEffect(() => {
    setCurrentPage(0);
  }, [searchType]);

  const { data, isPending, isError, error } = useGetPointsRedeemed({
    page: currentPage,
    size: 10,
    search: debouncedSearch || undefined,
    searchType,
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
    return (
      <TransactionsTable
        data={[]}
        title="Points Redeemed"
        pagination={paginationInfo}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
        searchPlaceholder={getSearchPlaceholder(searchType)}
        searchType={searchType}
        onSearchTypeChange={setSearchType}
      />
    );
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
      searchPlaceholder={getSearchPlaceholder(searchType)}
      searchType={searchType}
      onSearchTypeChange={setSearchType}
    />
  )
}