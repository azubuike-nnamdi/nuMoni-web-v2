'use client';

import { DateRangeSelector } from "@/components/ui/date-range-selector";
import { ErrorState } from "@/components/ui/error-state";
import LoadingSpinner from "@/components/ui/loading-spinner";
import useGetPointsRedeemed from "@/hooks/query/useGetPointsRedeemed";
import { useDateRangeFilter } from "@/hooks/useDateRangeFilter";
import { getSearchPlaceholder } from "@/lib/helper";
import { TransactionData } from "@/lib/types";
import TransactionsTable, { PaginationInfo } from "../transactions-table";

export default function PointsRedeemed() {
  const {
    currentPage,
    searchValue,
    searchType,
    debouncedSearch,
    selectedTimeline,
    fromDate,
    toDate,
    shouldFetch,
    setSearchType,
    setSelectedTimeline,
    handlePageChange,
    handleSearchChange,
    handleCustomDatesChange,
  } = useDateRangeFilter();

  const { data, isPending, isError, error } = useGetPointsRedeemed({
    page: currentPage,
    size: 10,
    search: debouncedSearch || undefined,
    searchType,
    fromDate,
    toDate,
    enabled: shouldFetch,
  });

  const pointsRedeemedData = data?.data?.data as TransactionData[] | undefined;
  const paginationInfo = data?.data?.pagination as PaginationInfo | undefined;

  // console.log('points redeemed', pointsRedeemedData);

  if (isPending && !data) {
    return <LoadingSpinner size="lg" message="Loading points redeemed..." />;
  }

  if (isError) {
    return <ErrorState title="Error loading data" message={error?.message || "An error occurred while loading points redeemed."} />;
  }

  const dateSelector = (
    <DateRangeSelector
      value={selectedTimeline}
      onValueChange={setSelectedTimeline}
      showCustomRange
      onDatesChange={handleCustomDatesChange}
      placeholder="Select Date"
    />
  );

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
      dateSelector={dateSelector}
    />
  );
}