"use client";
import { musicPlayIcon } from "@/constant/icons";
import { tabs } from "@/data";
import { usePlayPauseRewards } from "@/hooks/mutation/usePlayPauseRewards";
import { PointAnalyticsProps, Rewards } from "@/lib/types";
import { cn } from "@/lib/utils";
import { GiftIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import ErrorDisplay from "../common/error-display";
import { MusicPauseIcon } from "../common/icon-svg";
import PointsDistributed from "../dashboard/points/points-distributed";
import PointsRedeemed from "../dashboard/points/points-redeemed";
import { Button } from "../ui/button";
import AnalyticalTrend from "./analytical-trend";
import PointsAllocated from "./points-allocated";
import RewardModal from "./reward-modal";
import RewardTable from "./reward-table";
import UpdateRewardRuleModal from "./update-reward-rule-modal";

export default function PointAnalytics({
  isPending,
  rewardTableData,
  errorMessage,
  isError,
  onRetry
}: PointAnalyticsProps) {
  const [activeTab, setActiveTab] = useState("reward-table");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'pause' | 'resume'>('pause');
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedRuleData, setSelectedRuleData] = useState<Rewards | null>(null);

  const rewardStatus = rewardTableData?.status === "ACTIVE";
  const rewardId = rewardTableData?.id || "";

  const { handlePlayPauseRewards, isPending: isRewardActionPending, isSuccess } = usePlayPauseRewards({ rewardId });

  // Close modal on success
  useEffect(() => {
    if (isSuccess) {
      setModalOpen(false);
    }
  }, [isSuccess]);

  const handlePauseRewards = () => {
    setModalType('pause');
    setModalOpen(true);
  };

  const handleResumeRewards = () => {
    setModalType('resume');
    setModalOpen(true);
  };

  const handleConfirmAction = () => {
    handlePlayPauseRewards();
  };

  const handleEditTable = () => {
    // Pass the current reward table data as rule data
    if (rewardTableData) {
      setSelectedRuleData(rewardTableData);
      setUpdateModalOpen(true);
    }
  };

  return (
    <main className="bg-white rounded-2xl p-3 sm:p-4 md:p-6 my-4 sm:my-6 md:my-8">
      {/* Header Section */}
      <h1 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Point Insights & Analytics</h1>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4 sm:mb-6 gap-4">

        <div className="flex flex-row gap-2 items-center">


          {/* Tabs - Mobile: Full width, Desktop: Auto width */}
          <div className="flex flex-wrap items-center gap-1 lg:gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors cursor-pointer whitespace-nowrap",
                  activeTab === tab.id
                    ? "border-theme-dark-green-700 text-theme-dark-green-700 bg-theme-lighter-green border font-semibold"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons - Mobile: Stack vertically, Desktop: Horizontal */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
          <button
            onClick={handleEditTable}
            className="bg-white border border-gray-300 text-gray-700 px-3 sm:px-4 py-2 rounded-lg flex items-center justify-center space-x-2 text-sm hover:bg-gray-50 cursor-pointer"
          >
            <Image src="/assets/icons/details-icon.svg" alt="Edit" width={16} height={16} />
            <span className="hidden sm:inline">Edit Table</span>
            <span className="sm:hidden">Edit</span>
          </button>
          {
            rewardStatus ? (
              <Button
                onClick={handlePauseRewards}
                className="bg-theme-red-950 text-white px-3 sm:px-4 py-2 rounded-lg flex items-center justify-center space-x-2 text-sm hover:bg-theme-red"
              >
                <MusicPauseIcon className="w-4 h-4 text-white" />
                <span className="hidden sm:inline text-white font-semibold">Pause Reward</span>
                <span className="sm:hidden text-white font-semibold">Pause</span>
              </Button>
            ) : (
              <Button
                onClick={handleResumeRewards}
                className="bg-theme-dark-green text-white px-3 sm:px-4 sm:py-4 py-2 rounded-lg flex items-center justify-center space-x-2 text-sm hover:bg-theme-dark-green"
              >
                <Image src={musicPlayIcon} alt="Resume Reward" width={16} height={16} />
                <span className="hidden sm:inline text-white font-semibold">Resume Reward</span>
                <span className="sm:hidden text-white font-semibold">Resume</span>
              </Button>
            )
          }



        </div>
      </div>


      {/* Error Display */}
      <ErrorDisplay
        error={errorMessage || undefined}
        isError={isError}
        onRetry={onRetry}
        className="mb-4"
      />

      {/* Main Content Card */}
      <div className="bg-white rounded-2xl ">
        {activeTab === "reward-table" && (
          <RewardTable rewards={rewardTableData} isPending={isPending} />
        )}

        {/* {activeTab === "customers-score" && (
          <CustomersScore />
        )} */}

        {activeTab === "customer" && (
          <PointsAllocated />
        )}

        {activeTab === "analytics-trends" && (
          <AnalyticalTrend />
        )}

        {activeTab === "points-distributed" && <PointsDistributed />}

        {activeTab === "points-redeemed" && <PointsRedeemed />}
      </div>

      {/* Dynamic Rewards Modal */}
      <RewardModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmAction}
        icon={
          modalType === 'pause'
            ? <GiftIcon size={48} className="text-theme-red-950" />
            : <GiftIcon size={48} className="text-theme-dark-green" />
        }
        iconColor={modalType === 'pause' ? 'red' : 'green'}
        title={modalType === 'pause' ? "Pause Rewards?" : "Resume Rewards?"}
        description={
          modalType === 'pause'
            ? "Manually stop point allocations to customers until you're ready to resume. Customers will no longer earn points until you reactivate rewards."
            : "Reactivate point allocations so customers can start earning again."
        }
        subDescription={modalType === 'pause' ? "Proceed?" : undefined}
        primaryButtonText={modalType === 'pause' ? "Yes, Pause Rewards" : "Resume Rewards"}
        secondaryButtonText={modalType === 'pause' ? "No, Keep Rewards" : "Keep Rewards Paused"}
        primaryButtonVariant={modalType === 'pause' ? "destructive" : "default"}
        primaryButtonColor={modalType === 'pause' ? "#DC2626" : "#00B140"}
        secondaryButtonColor="#F3F4F6"
        isLoading={isRewardActionPending}
      />

      {/* Update Reward Rule Modal */}
      <UpdateRewardRuleModal
        open={updateModalOpen}
        onOpenChange={setUpdateModalOpen}
        ruleData={selectedRuleData}
      />
    </main>
  );
}