'use client';

import EmptyState from "@/components/common/empty-state";
import LoadingSpinner from "@/components/ui/loading-spinner";
import useGetPointsDistributed from "@/hooks/query/useGetPointsDistributed";
import { useEffect, useState } from "react";
import { PaginationInfo } from "../transactions-table";
import PointsDistributedTable from "./points-distributed-table";
import { PointsDistributedData } from "./types";

export default function PointsDistributed() {
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

  const { data, isPending, isError, error } = useGetPointsDistributed({
    page: currentPage,
    size: 10,
    search: debouncedSearch || undefined,
  });

  const pointsDistributedData = data?.data?.data as PointsDistributedData[] | undefined;
  const paginationInfo = data?.data?.pagination as PaginationInfo | undefined;

  const isEmpty = !isPending && (!pointsDistributedData || pointsDistributedData.length === 0);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
  };

  if (isPending && !data) {
    return <LoadingSpinner size="lg" message="Loading points distributed..." />;
  }

  if (isError) {
    return <EmptyState title="Error loading data" description={error?.message || "An error occurred while loading points distributed."} />;
  }

  if (isEmpty) {
    return <EmptyState title="No data yet" description="No points distributed yet." />;
  }

  return (
    <PointsDistributedTable
      data={pointsDistributedData || []}
      title="Points Distributed"
      pagination={paginationInfo}
      currentPage={currentPage}
      onPageChange={handlePageChange}
      searchValue={searchValue}
      onSearchChange={handleSearchChange}
      searchPlaceholder="Search by merchant, branch, deal..."
    />
  );
}