'use client';

import { convertYYYYMMDDtoDDMMYYYY, getTimelineDates } from "@/lib/helper";
import { format } from "date-fns";
import { useCallback, useEffect, useMemo, useState } from "react";
import { DateRangeOption } from "./transaction-table-header";

interface UseDateFilterReturn {
  dateRange: DateRangeOption;
  dateParams: { startDate?: string; endDate?: string };
  setDateRange: (range: DateRangeOption) => void;
  handleCustomDatesChange: (startDate: Date | undefined, endDate: Date | undefined) => void;
}

/**
 * Custom hook to handle date range filtering
 * Manages date range state and converts dates to DD-MM-YYYY format for API
 */
export function useDateFilter(): UseDateFilterReturn {
  const [dateRange, setDateRange] = useState<DateRangeOption>('Today');
  const [customStartDate, setCustomStartDate] = useState<Date | undefined>();
  const [customEndDate, setCustomEndDate] = useState<Date | undefined>();

  // Handle custom date changes from DateRangeSelector
  const handleCustomDatesChange = useCallback((startDate: Date | undefined, endDate: Date | undefined) => {
    setCustomStartDate(startDate);
    setCustomEndDate(endDate);
  }, []);

  // Convert date range to API format (DD-MM-YYYY)
  const dateParams = useMemo(() => {
    if (!dateRange || dateRange === 'All Time') {
      return {};
    }

    // Handle custom date range - convert to DD-MM-YYYY format
    if (dateRange === 'Custom Range' && customStartDate && customEndDate) {
      const startDateFormatted = format(customStartDate, "dd-MM-yyyy");
      const endDateFormatted = format(customEndDate, "dd-MM-yyyy");
      return {
        startDate: startDateFormatted,
        endDate: endDateFormatted,
      };
    }

    // Handle predefined date ranges - convert from YYYY-MM-DD to DD-MM-YYYY format
    if (dateRange !== 'Custom Range' && dateRange !== null) {
      const { startDate, endDate } = getTimelineDates(dateRange);
      // Convert YYYY-MM-DD to DD-MM-YYYY directly (e.g., "2026-01-05" -> "05-01-2026")
      const startDateFormatted = convertYYYYMMDDtoDDMMYYYY(startDate);
      const endDateFormatted = convertYYYYMMDDtoDDMMYYYY(endDate);
      return {
        startDate: startDateFormatted,
        endDate: endDateFormatted
      };
    }

    return {};
  }, [dateRange, customStartDate, customEndDate]);

  // Reset custom dates when switching away from Custom Range
  useEffect(() => {
    if (dateRange !== 'Custom Range') {
      setCustomStartDate(undefined);
      setCustomEndDate(undefined);
    }
  }, [dateRange]);

  return {
    dateRange,
    dateParams,
    setDateRange,
    handleCustomDatesChange,
  };
}

