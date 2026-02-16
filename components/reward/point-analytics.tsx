"use client";
import { musicPlayIcon } from "@/constant/icons";
import { tabs } from "@/data";
import { useUpdateRewardStatus } from "@/hooks/mutation/useUpdateRewardStatus";
import { PointAnalyticsProps, Rewards } from "@/lib/types";
import { cn } from "@/lib/utils";
import { AlertCircle, GiftIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import ErrorDisplay from "../common/error-display";
import { MusicPauseIcon } from "../common/icon-svg";
import PointsDistributed from "../dashboard/points/points-distributed";
import PointsRedeemed from "../dashboard/points/points-redeemed";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
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
}: Readonly<PointAnalyticsProps>) {
  const [activeTab, setActiveTab] = useState("reward-table");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'pause' | 'resume'>('pause');
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedRuleData, setSelectedRuleData] = useState<Rewards | null>(null);

  const { handleUpdateRewardStatus, isPending: isUpdateRewardStatusPending, isSuccess } = useUpdateRewardStatus();

  // Derived state
  const rewardId = rewardTableData?.id || "";
  const merchantId = rewardTableData?.merchantId || "";
  const rewardStatus = rewardTableData?.status === "ACTIVE";
  const isExpired = rewardTableData?.status === "EXPIRED";

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
    handleUpdateRewardStatus({
      merchantId,
      id: rewardId,
      status: modalType === 'pause' ? 'PAUSE' : 'ACTIVE'
    });
  };

  const handleEditTable = () => {
    if (rewardTableData) {
      setSelectedRuleData(rewardTableData);
      setUpdateModalOpen(true);
    }
  };

  // Modal Configuration logic extracted for cleaner JSX
  const modalConfig = {
    pause: {
      icon: <GiftIcon size={48} className="text-theme-red-950" />,
      iconColor: 'red' as const,
      title: "Pause Rewards?",
      description: "Manually stop point allocations to customers until you're ready to resume. Customers will no longer earn points until you reactivate rewards.",
      subDescription: "Proceed?",
      primaryButtonText: "Yes, Pause Rewards",
      secondaryButtonText: "No, Keep Rewards",
      primaryButtonVariant: "destructive" as const,
      primaryButtonColor: "#DC2626",
    },
    resume: {
      icon: <GiftIcon size={48} className="text-theme-dark-green" />,
      iconColor: 'green' as const,
      title: "Resume Rewards?",
      description: "Reactivate point allocations so customers can start earning again.",
      subDescription: undefined,
      primaryButtonText: "Resume Rewards",
      secondaryButtonText: "Keep Rewards Paused",
      primaryButtonVariant: "default" as const,
      primaryButtonColor: "#00B140",
    }
  }[modalType];

  return (
    <main className="bg-white rounded-2xl p-3 sm:p-4 md:p-6 my-4 sm:my-6 md:my-8">
      {/* Header Section */}
      <h1 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Point Insights & Analytics</h1>

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4 sm:mb-6 gap-4">
        {/* Tab Navigation */}
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

        {/* Global Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
          <button
            onClick={handleEditTable}
            className="bg-white border border-gray-300 text-gray-700 px-3 sm:px-4 py-2 rounded-lg flex items-center justify-center space-x-2 text-sm hover:bg-gray-50 cursor-pointer"
          >
            <Image src="/assets/icons/details-icon.svg" alt="Edit" width={16} height={16} />
            <span className="hidden sm:inline">Edit Table</span>
            <span className="sm:hidden">Edit</span>
          </button>

          {rewardStatus ? (
            <Button
              onClick={handlePauseRewards}
              disabled={isExpired}
              className="bg-theme-red-950 text-white px-3 sm:px-4 py-2 rounded-lg flex items-center justify-center space-x-2 text-sm hover:bg-theme-red disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <MusicPauseIcon className="w-4 h-4 text-white" />
              <span className="hidden sm:inline text-white font-semibold">Pause Reward</span>
              <span className="sm:hidden text-white font-semibold">Pause</span>
            </Button>
          ) : (
            <Button
              onClick={handleResumeRewards}
              disabled={isExpired}
              className="bg-theme-dark-green text-white px-3 sm:px-4 sm:py-4 py-2 rounded-lg flex items-center justify-center space-x-2 text-sm hover:bg-theme-dark-green disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Image src={musicPlayIcon} alt="Resume Reward" width={16} height={16} />
              <span className="hidden sm:inline text-white font-semibold">Resume Reward</span>
              <span className="sm:hidden text-white font-semibold">Resume</span>
            </Button>
          )}
        </div>
      </div>

      {/* Message & Notification Center */}
      <div className="space-y-4 mb-4">
        <ErrorDisplay
          error={errorMessage || undefined}
          isError={isError}
          onRetry={onRetry}
        />

        {isExpired && (
          <Alert variant="destructive" className="bg-red-50 border-red-200">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertTitle className="text-red-800 font-semibold">Reward Period Expired</AlertTitle>
            <AlertDescription className="text-red-700">
              This reward program has expired. Please update the reward period by clicking the{" "}
              <button
                type="button"
                className="font-bold underline cursor-pointer bg-transparent border-none p-0 text-inherit"
                onClick={handleEditTable}
              >
                Edit Table
              </button>{" "}
              button above to reactivate it.
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-2xl">
        {activeTab === "reward-table" && (
          <RewardTable rewards={rewardTableData} isPending={isPending} />
        )}

        {activeTab === "customer" && <PointsAllocated />}
        {activeTab === "analytics-trends" && <AnalyticalTrend />}
        {activeTab === "points-distributed" && <PointsDistributed />}
        {activeTab === "points-redeemed" && <PointsRedeemed />}
      </div>

      {/* Modals */}
      <RewardModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmAction}
        isLoading={isUpdateRewardStatusPending}
        secondaryButtonColor="#F3F4F6"
        {...modalConfig}
      />

      <UpdateRewardRuleModal
        open={updateModalOpen}
        onOpenChange={setUpdateModalOpen}
        ruleData={selectedRuleData}
      />
    </main>
  );
}