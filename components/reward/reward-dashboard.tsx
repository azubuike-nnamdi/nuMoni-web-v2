import useGetRewardAnalysis from "@/hooks/query/useGetRewardAnalysis";
import useGetRewards from "@/hooks/query/useGetRewards";
import { AxiosError } from "@/lib/types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ErrorDisplay from "../common/error-display";
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

  const { data: rewardAnalysisData, isPending: isPendingRewardAnalysis, isError: isErrorRewardAnalysis, error: errorRewardAnalysis, refetch: refetchRewardAnalysis } = useGetRewardAnalysis();

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const analyticsData = rewardAnalysisData?.data?.data;

  const errorMessage = (error as AxiosError)?.response?.data?.message;

  const rewardTableData = data?.data[0];

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      checkScrollButtons();
      container.addEventListener('scroll', checkScrollButtons);
      window.addEventListener('resize', checkScrollButtons);

      return () => {
        container.removeEventListener('scroll', checkScrollButtons);
        window.removeEventListener('resize', checkScrollButtons);
      };
    }
  }, [data, rewardAnalysisData]);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -300,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 300,
        behavior: 'smooth'
      });
    }
  };

  return (
    <main>
      {/* Error Display */}
      <ErrorDisplay
        error={errorMessage}
        isError={isError}
        onRetry={refetch}
        className="mb-4"
      />

      <section className="bg-white rounded-2xl p-4 relative">
        {/* Left Arrow */}
        {canScrollLeft && (
          <button
            onClick={scrollLeft}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-300 rounded-full p-2 shadow-md hover:bg-gray-50 transition-colors"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-5 w-5 text-gray-700" />
          </button>
        )}

        {/* Right Arrow */}
        {canScrollRight && (
          <button
            onClick={scrollRight}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-300 rounded-full p-2 shadow-md hover:bg-gray-50 transition-colors"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-5 w-5 text-gray-700" />
          </button>
        )}

        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto items-stretch [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          <div className="min-w-[280px] flex-shrink-0 flex">
            <div className="w-full h-full">
              <BudgetCapCard
                rewardCap={rewardTableData?.rewardCap}
                isLoading={isPending}
              />
            </div>
          </div>

          <div className="min-w-[280px] flex-shrink-0 flex">
            <div className="w-full h-full">
              <TotalPointsRewardedCard
                totalRewardCap={analyticsData?.totalRewardDistributed}
                isLoading={isPendingRewardAnalysis}
                isError={isErrorRewardAnalysis}
                errorMessage={errorRewardAnalysis?.message}
                onRetry={() => refetchRewardAnalysis()}
              />
            </div>
          </div>

          <div className="min-w-[280px] flex-shrink-0 flex">
            <div className="w-full h-full">
              <TotalPointsBalanceCard
                availablePoints={analyticsData?.availablePoints}
                isLoading={isPendingRewardAnalysis}
                isError={isErrorRewardAnalysis}
                errorMessage={errorRewardAnalysis?.message}
                onRetry={() => refetchRewardAnalysis()}
              />
            </div>
          </div>

          <div className="min-w-[280px] flex-shrink-0 flex">
            <div className="w-full h-full">
              <CustomerPoolCard
                totalLifetimeCustomers={analyticsData?.totalLifetimeCustomers}
                isLoading={isPendingRewardAnalysis}
                isError={isErrorRewardAnalysis}
                errorMessage={errorRewardAnalysis?.message}
                onRetry={() => refetchRewardAnalysis()}
              />
            </div>
          </div>

          <div className="min-w-[280px] flex-shrink-0 flex">
            <div className="w-full h-full">
              <TotalRewardIssued
                totalIssued={analyticsData?.totalIssued}
                isLoading={isPendingRewardAnalysis}
                isError={isErrorRewardAnalysis}
                errorMessage={errorRewardAnalysis?.message}
                onRetry={() => refetchRewardAnalysis()}
              />
            </div>
          </div>

          <div className="min-w-[280px] flex-shrink-0 flex">
            <div className="w-full h-full">
              <TotalOutstandingAllocation
                outStandingAllocation={analyticsData?.outStandingAllocation}
                isLoading={isPendingRewardAnalysis}
                isError={isErrorRewardAnalysis}
                errorMessage={errorRewardAnalysis?.message}
                onRetry={() => refetchRewardAnalysis()}
              />
            </div>
          </div>

          {/* <div className="min-w-[280px] flex-shrink-0">
            <TotalDistributedPoints
              totalRewardDistributed={analyticsData?.totalRewardDistributed}
              isLoading={isPendingRewardAnalysis}
              isError={isErrorRewardAnalysis}
              errorMessage={errorRewardAnalysis?.message}
              onRetry={() => refetchRewardAnalysis()}
            />
          </div> */}
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
  )
}