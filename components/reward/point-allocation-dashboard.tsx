"use client";

import {
  branches,
  regions,
  timelineOptions
} from "@/data";
import useGetCustomerAnalytics from "@/hooks/query/useGetCustomerAnalytics";
import { extractErrorMessage, getTimelineDates } from "@/lib/helper";
import { CustomerAnalyticsData, CustomerAnalyticsResponse } from "@/lib/types";
import { useEffect, useState } from "react";
import ErrorDisplay from "../common/error-display";
import LoadingSpinner from "../ui/loading-spinner";
import CustomDateRangeModal from "./custom-date-range-modal";
import CustomerTabTable from "./customer-tab-table";
import EmptyPointAllocation from "./empty-point-allocation";
import FilterSection from "./filter-section";

export default function PointAllocationDashboard() {
  const [selectedBranch, setSelectedBranch] = useState("All Branch");
  const [selectedRegion, setSelectedRegion] = useState("All Region");
  const [selectedTimeline, setSelectedTimeline] = useState("Today");
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
  const [customStartDate, setCustomStartDate] = useState<string>("");
  const [customEndDate, setCustomEndDate] = useState<string>("");

  // Get dates based on selected timeline
  const { startDate, endDate } = getTimelineDates(
    selectedTimeline,
    customStartDate || undefined,
    customEndDate || undefined
  );

  const { data, isPending, error, isError, refetch } = useGetCustomerAnalytics({
    startDate,
    endDate
  });

  const consumerData: CustomerAnalyticsResponse | undefined = data?.data;

  // Transform API data to match component expectations
  const loyalCustomers = consumerData?.topLoyalCustomers?.map((customer: CustomerAnalyticsData, index: number) => ({
    totalTransactions: customer.totalTransactions,
    totalSpent: customer.totalSpent,
    mostShoppedBranch: customer.mostShoppedBranch,
    customerId: customer.customerId,
    customerName: customer.customerName,
    rank: index + 1, // Add ranking based on array position
  })) || [];

  // API only provides topLoyalCustomers, no other customers data

  const handleCustomRangeClick = () => {
    setShowCustomDatePicker(true);
  };


  const handleCustomDateSelect = (startDate: string, endDate: string) => {
    setCustomStartDate(startDate);
    setCustomEndDate(endDate);
    setSelectedTimeline("Custom Range");
    setShowCustomDatePicker(false);
  };

  // Refetch data when timeline changes
  useEffect(() => {
    refetch();
  }, [selectedTimeline, customStartDate, customEndDate, refetch]);

  // Render customer content based on different states
  const renderCustomerContent = () => {
    // 1. Show loading spinner while data is being fetched
    if (isPending) {
      return <LoadingSpinner message="Loading customer data..." />;
    }

    // 2. Show error message if there's an error
    if (isError) {
      return (
        <ErrorDisplay
          error={extractErrorMessage(error) || "Error loading customer data. Please try again."}
          isError={isError}
          onRetry={refetch}
        />
      );
    }

    // 3. Show empty state if no customers found
    if (loyalCustomers.length === 0) {
      return <EmptyPointAllocation />;
    }

    console.log(loyalCustomers)

    // 4. Show customer data if everything is successful
    return (
      <CustomerTabTable customers={loyalCustomers} title="Your Most Loyal Customers" />

    );
  };

  return (
    <main className="px-2 sm:px-4 lg:px-0">
      <hr className="border-theme-gray my-4" />

      {/* Header Section */}
      <div className="flex flex-col gap-4 mb-4 sm:mb-6">
        {/* Title and Last Update */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h1 className="text-sm sm:text-base font-semibold text-black/50 whitespace-nowrap">
                Points are currently held by customers
              </h1>

            </div>
            {/* Filter Section */}
            <FilterSection
              branches={branches}
              regions={regions}
              timelineOptions={timelineOptions}
              selectedBranch={selectedBranch}
              selectedRegion={selectedRegion}
              selectedTimeline={selectedTimeline}
              onBranchChange={setSelectedBranch}
              onRegionChange={setSelectedRegion}
              onTimelineChange={setSelectedTimeline}
              onCustomRangeClick={handleCustomRangeClick}
            />
          </div>

          {consumerData?.totalCustomers && (
            <span className="text-xs sm:text-md text-gray-500">
              ({consumerData.totalCustomers} Total Customers)
            </span>
          )}
        </div>


      </div>

      {/* Customer Data Section */}
      <div className="">
        {renderCustomerContent()}
      </div>

      {/* Custom Date Range Modal */}
      <CustomDateRangeModal
        open={showCustomDatePicker}
        onOpenChange={setShowCustomDatePicker}
        onDateSelect={handleCustomDateSelect}
        initialStartDate={customStartDate}
        initialEndDate={customEndDate}
      />
    </main>
  );
}