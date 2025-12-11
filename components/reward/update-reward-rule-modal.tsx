"use client";

import { giftIcon } from "@/constant/icons";
import { useUpdateRewards } from "@/hooks/mutation/useUpdateRewards";
import { getAuthCookies } from "@/lib/cookies-utils";
import { getDistributionType, getRewardType, mapPointExpirationToApi, removeCommas } from "@/lib/helper";
import { Rewards, UpdateRewardRuleModalProps } from "@/lib/types";
import Image from "next/image";
import { useEffect } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import DateSection from "./sections/date-section";
import EarnMethodSection from "./sections/earn-method-section";
import ExpirationSection from "./sections/expiration-section";
import MilestoneTargetSection from "./sections/milestone-target-section";
import ReceiveMethodSection from "./sections/receive-method-section";
import RewardCapSection from "./sections/reward-cap-section";
import RewardRulesSection from "./sections/reward-rules-section";
import { useUpdateRewardForm } from "./use-update-form-reward";


// Helper function to create API payload
const createUpdatePayload = (
  ruleData: Rewards | null,
  merchantId: string,
  formData: ReturnType<typeof useUpdateRewardForm>
): Rewards => {
  const {
    earnMethod,
    rewardCap,
    milestoneTarget,
    receiveMethod,
    pointExpiration,
    startDate,
    endDate,
    rewardRules
  } = formData;

  // Clean rewardCap: remove commas and parse to number
  // Example: "40,000" -> "40000" -> 40000
  const cleanedRewardCap = removeCommas(rewardCap || "");
  const parsedRewardCap = cleanedRewardCap ? parseFloat(cleanedRewardCap) : 0;

  // Clean milestoneTarget: remove commas and parse to number
  const cleanedMilestoneTarget = removeCommas(milestoneTarget || "");
  const parsedMilestoneTarget = cleanedMilestoneTarget ? parseInt(cleanedMilestoneTarget) : 0;

  return {
    id: ruleData?.id || "",
    merchantId: merchantId,
    rewardType: getRewardType(earnMethod),
    rules: rewardRules.map(rule => ({
      minSpend: parseFloat(rule.min) || 0,
      maxSpend: parseFloat(rule.max) || 0,
      rewardValue: parseFloat(rule.percentage) || 0
    })),
    rewardCap: parsedRewardCap, // Number without commas (e.g., 40000)
    distributionType: getDistributionType(receiveMethod),
    milestoneTarget: parsedMilestoneTarget, // Number without commas
    pointExpirationDays: mapPointExpirationToApi(pointExpiration),
    status: "ACTIVE",
    startDate: startDate || null,
    endDate: endDate || null
  };
};

export default function UpdateRewardRuleModal({ open, onOpenChange, ruleData }: UpdateRewardRuleModalProps) {
  const { userId } = getAuthCookies();
  const merchantId = userId as string;
  // console.log("ruleData", ruleData);

  // Use custom hook for form state management
  const formData = useUpdateRewardForm(ruleData, open);
  const { handleUpdateRewards, isPending, isSuccess } = useUpdateRewards();

  // Check if all required fields are filled
  const isFormValid = formData.earnMethod &&
    formData.receiveMethod &&
    formData.startDate &&
    formData.rewardRules.length > 0 &&
    formData.rewardCap &&
    (formData.receiveMethod === "INSTANT" || formData.milestoneTarget);

  const handleSave = () => {
    const payload = createUpdatePayload(ruleData, merchantId, formData);
    handleUpdateRewards(payload);
  };

  useEffect(() => {
    if (isSuccess) {
      onOpenChange(false);
    }
  }, [isSuccess, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col">
        {/* Header - Static */}
        <DialogHeader className="flex-shrink-0 pb-4">
          <div className="flex items-center gap-3">
            <Image src={giftIcon} alt="Gift" width={45} height={45} />
            <div>
              <DialogTitle className="text-xl font-semibold">Update Reward Rules</DialogTitle>
              <DialogDescription className="text-xs text-gray-600">
                Modify your reward table parameters and rules. Changes will apply across all branches.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto space-y-6 pr-2">
          <EarnMethodSection
            key={`earn-${formData.earnMethod}`}
            earnMethod={formData.earnMethod}
            setEarnMethod={formData.setEarnMethod}
          />

          <RewardRulesSection
            key={`rules-${formData.rewardRules.length}`}
            earnMethod={formData.earnMethod}
            minSpending={formData.minSpending}
            setMinSpending={formData.setMinSpending}
            maxSpending={formData.maxSpending}
            setMaxSpending={formData.setMaxSpending}
            rewardPercentage={formData.rewardPercentage}
            setRewardPercentage={formData.setRewardPercentage}
            rewardRules={formData.rewardRules}
            setRewardRules={formData.setRewardRules}
            showTable={formData.showTable}
            setShowTable={formData.setShowTable}
          />

          <RewardCapSection
            rewardCap={formData.rewardCap}
            setRewardCap={formData.setRewardCap}
          />

          <ReceiveMethodSection
            key={`receive-${formData.receiveMethod}`}
            receiveMethod={formData.receiveMethod}
            setReceiveMethod={formData.setReceiveMethod}
          />

          <MilestoneTargetSection
            milestoneTarget={formData.milestoneTarget}
            setMilestoneTarget={formData.setMilestoneTarget}
          />

          <ExpirationSection
            pointExpiration={formData.pointExpiration}
            setPointExpiration={formData.setPointExpiration}
          />

          <DateSection
            startDate={formData.startDate}
            setStartDate={formData.setStartDate}
            endDate={formData.endDate}
            setEndDate={formData.setEndDate}
          />
        </div>

        {/* Footer - Static */}
        <DialogFooter className="flex-shrink-0 pt-4 border-t">
          <div className="flex items-center justify-between w-full">
            <p className="text-sm text-gray-500 font-semibold">You Can Change This Configurations On Setting Page</p>
            <Button
              onClick={handleSave}
              disabled={!isFormValid || isPending}
              className={`px-4 py-2 text-sm ${isFormValid && !isPending
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              isLoading={isPending}
              loadingText="Updating..."
            >
              Update & Apply
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}