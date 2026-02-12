import { DateRangeOption } from "@/components/ui/date-range-selector";
import { getTimelineDates } from "@/lib/helper";
import { format } from "date-fns";
import { useEffect, useMemo, useState } from "react";

/**
 * Custom hook to manage date range filtering with search and pagination
 * Used by PointsDistributed and PointsRedeemed components
 */
export function useDateRangeFilter() {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);

  // Search state
  const [searchValue, setSearchValue] = useState("");
  const [searchType, setSearchType] = useState("transactionReference");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Date range state
  const [selectedTimeline, setSelectedTimeline] = useState<DateRangeOption>("Today");
  const [customStartDate, setCustomStartDate] = useState<Date | undefined>();
  const [customEndDate, setCustomEndDate] = useState<Date | undefined>();

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

  // Calculate fetch conditions
  const isCustomRange = selectedTimeline === "Custom Range";
  const areCustomDatesValid = !!customStartDate && !!customEndDate;
  const shouldFetch = !isCustomRange || areCustomDatesValid;

  // Calculate date range only when we have valid data
  const { fromDate, toDate } = useMemo(() => {
    // If Custom Range is selected but dates aren't valid, don't calculate
    if (isCustomRange && !areCustomDatesValid) {
      return { fromDate: "", toDate: "" };
    }

    const customStartStr = customStartDate ? format(customStartDate, "yyyy-MM-dd") : undefined;
    const customEndStr = customEndDate ? format(customEndDate, "yyyy-MM-dd") : undefined;

    const { startDate, endDate } = getTimelineDates(
      selectedTimeline || "Today",
      customStartStr,
      customEndStr
    );

    // Convert YYYY-MM-DD to DD-MM-YYYY for API
    const formatToApiDate = (dateStr: string) => {
      if (!dateStr) return "";
      const [y, m, d] = dateStr.split("-");
      return `${d}-${m}-${y}`;
    };

    return {
      fromDate: formatToApiDate(startDate),
      toDate: formatToApiDate(endDate)
    };
  }, [selectedTimeline, customStartDate, customEndDate, isCustomRange, areCustomDatesValid]);

  // Handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
  };

  const handleCustomDatesChange = (start: Date | undefined, end: Date | undefined) => {
    setCustomStartDate(start);
    setCustomEndDate(end);
  };

  return {
    // States
    currentPage,
    searchValue,
    searchType,
    debouncedSearch,
    selectedTimeline,
    customStartDate,
    customEndDate,
    fromDate,
    toDate,
    shouldFetch,

    // Setters
    setCurrentPage,
    setSearchType,
    setSelectedTimeline,

    // Handlers
    handlePageChange,
    handleSearchChange,
    handleCustomDatesChange,
  };
}
