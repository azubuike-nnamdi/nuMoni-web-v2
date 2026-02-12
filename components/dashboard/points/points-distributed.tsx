'use client';

import EmptyState from "@/components/common/empty-state";
import { DateRangeSelector } from "@/components/ui/date-range-selector";
import LoadingSpinner from "@/components/ui/loading-spinner";
import useGetPointsDistributed from "@/hooks/query/useGetPointsDistributed";
import { useDateRangeFilter } from "@/hooks/useDateRangeFilter";
import { getSearchPlaceholder } from "@/lib/helper";
import { PaginationInfo } from "../transactions-table";
import PointsDistributedTable from "./points-distributed-table";
import { PointsDistributedData } from "./types";

export default function PointsDistributed() {
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

  const { data, isPending, isError, error } = useGetPointsDistributed({
    page: currentPage,
    size: 10,
    search: debouncedSearch || undefined,
    searchType,
    fromDate,
    toDate,
    enabled: shouldFetch,
  });

  const pointsDistributedData = data?.data?.data as PointsDistributedData[] | undefined;
  const paginationInfo = data?.data?.pagination as PaginationInfo | undefined;

  if (isPending && !data) {
    return <LoadingSpinner size="lg" message="Loading points distributed..." />;
  }

  if (isError) {
    return <EmptyState title="Error loading data" description={error?.message || "An error occurred while loading points distributed."} />;
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
    <PointsDistributedTable
      data={pointsDistributedData || []}
      title="Points Distributed"
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