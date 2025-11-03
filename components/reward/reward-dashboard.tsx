import useGetRewardAnalysis from "@/hooks/query/useGetRewardAnalysis";
import useGetRewards from "@/hooks/query/useGetRewards";
import { AxiosError } from "@/lib/types";
import ErrorDisplay from "../common/error-display";
import {
  BudgetCapCard,
  CustomerPoolCard,
  TotalPointsBalanceCard,
  TotalPointsRewardedCard
} from "./cards";
import PointAnalytics from "./point-analytics";
import TotalDistributedPoints from "./total-distributed-points";
import TotalOutstandingAllocation from "./total-outstanding-allocation";
import TotalRewardIssued from "./total-reward-issued";

export default function RewardDashboard() {

  const { data, isPending, error, isError, refetch } = useGetRewards({});

  const { data: rewardAnalysisData, isPending: isPendingRewardAnalysis, isError: isErrorRewardAnalysis, error: errorRewardAnalysis, refetch: refetchRewardAnalysis } = useGetRewardAnalysis();


  const analyticsData = rewardAnalysisData?.data?.data;

  const errorMessage = (error as AxiosError)?.response?.data?.message;

  const rewardTableData = data?.data[0];

  return (
    <main>
      {/* Error Display */}
      <ErrorDisplay
        error={errorMessage}
        isError={isError}
        onRetry={refetch}
        className="mb-4"
      />

      <section className="bg-white rounded-2xl p-4 overflow-x-auto">
        <div className="flex gap-4 min-w-max md:min-w-0">
          <div className="min-w-[280px] flex-shrink-0">
            <BudgetCapCard
              rewardCap={rewardTableData?.rewardCap}
              isLoading={isPending}
            />
          </div>

          <div className="min-w-[280px] flex-shrink-0">
            <TotalPointsRewardedCard
              totalRewardCap={analyticsData?.totalRewardDistributed}
              isLoading={isPendingRewardAnalysis}
              isError={isErrorRewardAnalysis}
              errorMessage={errorRewardAnalysis?.message}
              onRetry={() => refetchRewardAnalysis()}
            />
          </div>

          <div className="min-w-[280px] flex-shrink-0">
            <TotalPointsBalanceCard
              availablePoints={analyticsData?.availablePoints}
              isLoading={isPendingRewardAnalysis}
              isError={isErrorRewardAnalysis}
              errorMessage={errorRewardAnalysis?.message}
              onRetry={() => refetchRewardAnalysis()}
            />
          </div>

          <div className="min-w-[280px] flex-shrink-0">
            <CustomerPoolCard
              totalLifetimeCustomers={analyticsData?.totalLifetimeCustomers}
              isLoading={isPendingRewardAnalysis}
              isError={isErrorRewardAnalysis}
              errorMessage={errorRewardAnalysis?.message}
              onRetry={() => refetchRewardAnalysis()}
            />
          </div>

          <div className="min-w-[280px] flex-shrink-0">
            <TotalRewardIssued
              totalIssued={analyticsData?.totalIssued}
              isLoading={isPendingRewardAnalysis}
              isError={isErrorRewardAnalysis}
              errorMessage={errorRewardAnalysis?.message}
              onRetry={() => refetchRewardAnalysis()}
            />
          </div>

          <div className="min-w-[280px] flex-shrink-0">
            <TotalOutstandingAllocation
              outStandingAllocation={analyticsData?.outStandingAllocation}
              isLoading={isPendingRewardAnalysis}
              isError={isErrorRewardAnalysis}
              errorMessage={errorRewardAnalysis?.message}
              onRetry={() => refetchRewardAnalysis()}
            />
          </div>

          <div className="min-w-[280px] flex-shrink-0">
            <TotalDistributedPoints
              totalRewardDistributed={analyticsData?.totalRewardDistributed}
              isLoading={isPendingRewardAnalysis}
              isError={isErrorRewardAnalysis}
              errorMessage={errorRewardAnalysis?.message}
              onRetry={() => refetchRewardAnalysis()}
            />
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
  )
}