import { useEffect, useState } from "react";
import { CategoryOption } from "../components/category-filter";
import { StatusOption } from "../components/status-filter";
import { DateRangeOption, getDateRange } from "../utils/date-range-utils";

export function useTransactionFilters() {
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [selectedRange, setSelectedRange] = useState<DateRangeOption>('Today');
  const [selectedStatus, setSelectedStatus] = useState<StatusOption>('All');
  const [selectedCategory, setSelectedCategory] = useState<CategoryOption>('direct transfer');
  const [customStartDate, setCustomStartDate] = useState<Date | undefined>(undefined);
  const [customEndDate, setCustomEndDate] = useState<Date | undefined>(undefined);

  const dateRange = getDateRange(selectedRange, customStartDate, customEndDate);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(0);
  };

  const handleDateRangeChange = (option: DateRangeOption) => {
    setSelectedRange(option);
    setCurrentPage(0);
    // Reset custom dates when switching away from custom duration
    if (option !== 'Custom Duration') {
      setCustomStartDate(undefined);
      setCustomEndDate(undefined);
    }
  };

  const handleStatusChange = (status: StatusOption) => {
    setSelectedStatus(status);
    setCurrentPage(0);
  };

  const handleCategoryChange = (category: CategoryOption) => {
    setSelectedCategory(category);
    setCurrentPage(0);
  };

  const handleCustomStartDateSelect = (date: Date | undefined) => {
    setCustomStartDate(date);
    // If end date is before start date, reset end date
    if (date && customEndDate && date > customEndDate) {
      setCustomEndDate(undefined);
    }
  };

  const handleCustomEndDateSelect = (date: Date | undefined) => {
    setCustomEndDate(date);
  };

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(0);
  }, [selectedRange, selectedStatus, selectedCategory, customStartDate, customEndDate, pageSize]);

  return {
    currentPage,
    pageSize,
    selectedRange,
    selectedStatus,
    selectedCategory,
    customStartDate,
    customEndDate,
    dateRange,
    handlePageChange,
    handlePageSizeChange,
    handleDateRangeChange,
    handleStatusChange,
    handleCategoryChange,
    handleCustomStartDateSelect,
    handleCustomEndDateSelect,
  };
}

