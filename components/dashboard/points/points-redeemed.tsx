'use client';

import { Button } from "@/components/ui/button";
import { DateRangeOption, DateRangeSelector } from "@/components/ui/date-range-selector";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ErrorState } from "@/components/ui/error-state";
import LoadingSpinner from "@/components/ui/loading-spinner";
import useExportPointsRedeemed from "@/hooks/query/useExportPointsRedeemed";
import useGetPointsRedeemed from "@/hooks/query/useGetPointsRedeemed";
import { useDateRangeFilter } from "@/hooks/useDateRangeFilter";
import { getSearchPlaceholder, getTimelineDates } from "@/lib/helper";
import { PaginationInfo, TransactionData } from "@/lib/types";
import { format } from "date-fns";
import { Download } from "lucide-react";
import { useState } from "react";
import PointsRedeemedTable from "./points-redeemed-table";

export default function PointsRedeemed() {
  const {
    currentPage,
    pageSize,
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
    handlePageSizeChange,
    handleSearchChange,
    handleCustomDatesChange,
  } = useDateRangeFilter();

  const { data, isPending, isError, error } = useGetPointsRedeemed({
    page: currentPage,
    size: pageSize,
    search: debouncedSearch || undefined,
    searchType,
    fromDate,
    toDate,
    enabled: shouldFetch,
  });

  // ── Export dialog state ──────────────────────────────────────────────────
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [exportTimeline, setExportTimeline] = useState<DateRangeOption>(null);
  const [exportStartDate, setExportStartDate] = useState<Date | undefined>();
  const [exportEndDate, setExportEndDate] = useState<Date | undefined>();

  const { handleExportPointsRedeemed, isPending: isExporting } =
    useExportPointsRedeemed();

  const handleOpenExportDialog = () => {
    // Reset export dialog state each time it's opened
    setExportTimeline(null);
    setExportStartDate(undefined);
    setExportEndDate(undefined);
    setExportDialogOpen(true);
  };

  const handleExportDatesChange = (
    start: Date | undefined,
    end: Date | undefined
  ) => {
    setExportStartDate(start);
    setExportEndDate(end);
  };

  const handleConfirmExport = () => {
    if (!exportTimeline) return;

    const customStartStr = exportStartDate
      ? format(exportStartDate, "dd-MM-yyyy")
      : undefined;
    const customEndStr = exportEndDate
      ? format(exportEndDate, "dd-MM-yyyy")
      : undefined;

    const { startDate, endDate } = getTimelineDates(
      exportTimeline,
      customStartStr,
      customEndStr
    );

    handleExportPointsRedeemed({
      fromDate: startDate,
      toDate: endDate,
    });

    setExportDialogOpen(false);
  };

  // ── Derived ──────────────────────────────────────────────────────────────
  const isCustomExport = exportTimeline === "Custom Range";
  const isExportReady =
    !!exportTimeline && (!isCustomExport || (!!exportStartDate && !!exportEndDate));

  const pointsRedeemedData = data?.data?.data as TransactionData[] | undefined;
  const paginationInfo = data?.data?.pagination as PaginationInfo | undefined;

  if (isPending && !data) {
    return <LoadingSpinner size="lg" message="Loading points redeemed..." />;
  }

  if (isError) {
    return (
      <ErrorState
        title="Error loading data"
        message={error?.message || "An error occurred while loading points redeemed."}
      />
    );
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

  const exportButton = (
    <Button
      id="export-points-redeemed-btn"
      variant="outline"
      className="flex items-center gap-2 border-theme-dark-green text-theme-dark-green hover:bg-theme-dark-green hover:text-white transition-colors"
      onClick={handleOpenExportDialog}
      disabled={isExporting}
    >
      <Download className="h-4 w-4" />
      {isExporting ? "Exporting…" : "Export"}
    </Button>
  );

  return (
    <>
      <PointsRedeemedTable
        data={pointsRedeemedData || []}
        title="Points Redeemed"
        pagination={paginationInfo}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
        searchPlaceholder={getSearchPlaceholder(searchType)}
        searchType={searchType}
        onSearchTypeChange={setSearchType}
        dateSelector={dateSelector}
        exportButton={exportButton}
      />

      {/* ── Export Date Range Dialog ──────────────────────────────────────── */}
      <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Download className="h-5 w-5 text-theme-dark-green" />
              Export Points Redeemed
            </DialogTitle>
          </DialogHeader>

          <div className="py-4 space-y-3">
            <p className="text-sm text-muted-foreground">
              Select the date range for the data you want to export.
            </p>
            <DateRangeSelector
              value={exportTimeline}
              onValueChange={setExportTimeline}
              showCustomRange
              onDatesChange={handleExportDatesChange}
              placeholder="Select Date Range"
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setExportDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              id="confirm-export-points-redeemed-btn"
              disabled={!isExportReady || isExporting}
              onClick={handleConfirmExport}
              className="bg-theme-dark-green disabled:bg-theme-dark-green/50"
            >
              {isExporting ? "Exporting…" : "Export"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}