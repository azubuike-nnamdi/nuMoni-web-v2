'use client';

import { peopleIcon, pointIcon } from "@/constant/icons";
import useGetRewardAnalysis from "@/hooks/query/useGetRewardAnalysis";
import useGetRewards from "@/hooks/query/useGetRewards";
import { formatCurrency, getTimelineDates } from "@/lib/helper";
import { AxiosError } from "@/lib/types";
import { useRef, useState } from "react";
import ErrorDisplay from "../common/error-display";
import { DateRangeOption, DateRangeSelector } from "../ui/date-range-selector";
import {
  BudgetCapCard,
  CustomerPoolCard,
  TotalPointsBalanceCard,
  TotalPointsRewardedCard
} from "./cards";
import PointAnalytics from "./point-analytics";
import TotalOutstandingAllocation from "./total-outstanding-allocation";
import TotalRewardIssued from "./total-reward-issued";

export default function RewardDashboard() {

  const { data, isPending, error, isError, refetch } = useGetRewards({});

  // Date filter state
  const [dateRange, setDateRange] = useState<DateRangeOption>(null);
  const [startDate, setStartDate] = useState<string | undefined>();
  const [endDate, setEndDate] = useState<string | undefined>();
  // Track current selection in a ref so handleCustomDatesChange can read it
  // synchronously without stale closure issues
  const dateRangeRef = useRef<DateRangeOption>(null);

  const { data: rewardAnalysisData, isFetching: isFetchingRewardAnalysis, isError: isErrorRewardAnalysis, error: errorRewardAnalysis, refetch: refetchRewardAnalysis } = useGetRewardAnalysis({
    startDate,
    endDate,
  });

  const analyticsData = rewardAnalysisData?.data?.data;
  const errorMessage = (error as AxiosError)?.response?.data?.message;
  const rewardTableData = data?.data[0];

  // Format a Date to dd-MM-yyyy
  const fmtDate = (d: Date): string => {
    const day = String(d.getDate()).padStart(2, '0');
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const y = d.getFullYear();
    return `${day}-${m}-${y}`;
  };

  // Resolve preset options (Today, This Week, etc.) into date strings immediately
  const handleDateRangeChange = (option: DateRangeOption) => {
    dateRangeRef.current = option;
    setDateRange(option);

    if (!option || option === 'Custom Range') {
      setStartDate(undefined);
      setEndDate(undefined);
      return;
    }

    const { startDate: start, endDate: end } = getTimelineDates(option);
    setStartDate(start);
    setEndDate(end);
  };

  // Called by DateRangeSelector for Custom Range after user applies dates in the modal.
  // IMPORTANT: DateRangeSelector also calls this with (undefined, undefined) whenever
  // the value switches away from 'Custom Range' — we must ignore those spurious resets
  // so preset-resolved dates are not wiped out.
  const handleCustomDatesChange = (start: Date | undefined, end: Date | undefined) => {
    if (dateRangeRef.current !== 'Custom Range') return;

    if (start && end) {
      setStartDate(fmtDate(start));
      setEndDate(fmtDate(end));
    } else {
      setStartDate(undefined);
      setEndDate(undefined);
    }
  };

  return (
    <main>
      <ErrorDisplay
        error={errorMessage}
        isError={isError}
        onRetry={refetch}
        className="mb-4"
      />

      <section className="bg-white rounded-2xl p-4">
        {/* Date Range Filter — top-right above the cards */}
        <div className="flex justify-end mb-3">
          <DateRangeSelector
            value={dateRange}
            onValueChange={handleDateRangeChange}
            onDatesChange={handleCustomDatesChange}
            showCustomRange
            placeholder="Filter by date"
            className="w-[180px]"
          />
        </div>

        <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-3">
          <div className="flex">
            <div className="w-full h-full">
              <BudgetCapCard
                rewardCap={rewardTableData?.rewardCap}
                isLoading={isPending}
              />
            </div>
          </div>

          <div className="flex">
            <div className="w-full h-full">
              <TotalRewardIssued
                totalIssued={formatCurrency(analyticsData?.budgetBalance)}
                isLoading={isFetchingRewardAnalysis}
                isError={isErrorRewardAnalysis}
                errorMessage={errorRewardAnalysis?.message}
                onRetry={() => refetchRewardAnalysis()}
                title="Budget Balance"
                iconImage={pointIcon}
              />
            </div>
          </div>

          <div className="flex">
            <div className="w-full h-full">
              <TotalOutstandingAllocation
                outStandingAllocation={analyticsData?.outStandingAllocation}
                isLoading={isFetchingRewardAnalysis}
                isError={isErrorRewardAnalysis}
                errorMessage={errorRewardAnalysis?.message}
                onRetry={() => refetchRewardAnalysis()}
              />
            </div>
          </div>

          <div className="flex">
            <div className="w-full h-full">
              <TotalRewardIssued
                totalIssued={analyticsData?.totalIssueCount}
                isLoading={isFetchingRewardAnalysis}
                isError={isErrorRewardAnalysis}
                errorMessage={errorRewardAnalysis?.message}
                onRetry={() => refetchRewardAnalysis()}
                title="Total Issue Count"
                iconImage={peopleIcon}
              />
            </div>
          </div>

          <div className="flex">
            <div className="w-full h-full">
              <CustomerPoolCard
                totalLifetimeCustomers={analyticsData?.totalLifetimeCustomers}
                isLoading={isFetchingRewardAnalysis}
                isError={isErrorRewardAnalysis}
                errorMessage={errorRewardAnalysis?.message}
                onRetry={() => refetchRewardAnalysis()}
              />
            </div>
          </div>

          <div className="flex">
            <div className="w-full h-full">
              <TotalRewardIssued
                totalIssued={analyticsData?.totalRedeemed}
                isLoading={isFetchingRewardAnalysis}
                isError={isErrorRewardAnalysis}
                errorMessage={errorRewardAnalysis?.message}
                onRetry={() => refetchRewardAnalysis()}
                title="Total Points Redeemed"
                iconImage={peopleIcon}
              />
            </div>
          </div>

          <div className="flex">
            <div className="w-full h-full">
              <TotalRewardIssued
                totalIssued={analyticsData?.totalRedeemCount}
                isLoading={isFetchingRewardAnalysis}
                isError={isErrorRewardAnalysis}
                errorMessage={errorRewardAnalysis?.message}
                onRetry={() => refetchRewardAnalysis()}
                title="Total Redeemed Count"
                iconImage={peopleIcon}
              />
            </div>
          </div>

          <div className="flex">
            <div className="w-full h-full">
              <TotalPointsRewardedCard
                totalRewardCap={analyticsData?.totalIssued}
                isLoading={isFetchingRewardAnalysis}
                isError={isErrorRewardAnalysis}
                errorMessage={errorRewardAnalysis?.message}
                onRetry={() => refetchRewardAnalysis()}
              />
            </div>
          </div>

          <div className="flex">
            <div className="w-full h-full">
              <TotalPointsBalanceCard
                availablePoints={analyticsData?.availablePoints}
                isLoading={isFetchingRewardAnalysis}
                isError={isErrorRewardAnalysis}
                errorMessage={errorRewardAnalysis?.message}
                onRetry={() => refetchRewardAnalysis()}
              />
            </div>
          </div>
        </div>
      </section>

      <PointAnalytics
        isPending={isPending}
        rewardTableData={rewardTableData}
        errorMessage={errorMessage}
        isError={isError}
        onRetry={refetch}
      />
    </main>
  );
}