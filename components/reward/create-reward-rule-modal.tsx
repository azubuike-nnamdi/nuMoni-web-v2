"use client";

import { giftIcon } from "@/constant/icons";
import { useCreateRewards } from "@/hooks/mutation/useCreateRewards";
import { getAuthCookies } from "@/lib/cookies-utils";
import { getDistributionType, getRewardType, removeCommas } from "@/lib/helper";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import DateSection from "./sections/date-section";
import EarnMethodSection from "./sections/earn-method-section";
import ExpirationSection from "./sections/expiration-section";
import MilestoneTargetSection from "./sections/milestone-target-section";
import ReceiveMethodSection from "./sections/receive-method-section";
import RewardCapSection from "./sections/reward-cap-section";
import RewardRulesSection from "./sections/reward-rules-section";

interface CreateRewardRuleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateRewardRuleModal({ open, onOpenChange }: CreateRewardRuleModalProps) {
  //get merchant id from cookies
  const { userId } = getAuthCookies();

  // console.log("userId", userId);
  const merchantId = userId as string;
  const [earnMethod, setEarnMethod] = useState<string>("");
  const [rewardCap, setRewardCap] = useState<string>("");
  const [milestoneTarget, setMilestoneTarget] = useState<string>("");
  const [receiveMethod, setReceiveMethod] = useState<string>("");
  const [pointExpiration, setPointExpiration] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // Reward rules state
  const [minSpending, setMinSpending] = useState<string>("");
  const [maxSpending, setMaxSpending] = useState<string>("");
  const [rewardPercentage, setRewardPercentage] = useState<string>("");
  const [rewardRules, setRewardRules] = useState<Array<{ min: string, max: string, percentage: string }>>([]);
  const [showTable, setShowTable] = useState<boolean>(false);

  // Mutation hook
  const { handleCreateRewards, isPending, isSuccess } = useCreateRewards();

  // Check if all required fields are filled
  const isFormValid = earnMethod && receiveMethod && startDate && rewardRules.length > 0 && rewardCap && (receiveMethod === "INSTANT" || milestoneTarget);

  const handleSave = () => {
    // Map form values to API enum values

    // Clean rewardCap: remove commas and parse to number
    // Example: "40,000" -> "40000" -> 40000
    const cleanedRewardCap = removeCommas(rewardCap || "");
    const parsedRewardCap = cleanedRewardCap ? parseFloat(cleanedRewardCap) : 0;

    // Prepare payload according to CreateRewardsPayload type
    const payload = {
      merchantId: merchantId, // Replace with actual merchant ID from context/store
      rewardType: getRewardType(earnMethod),
      rules: rewardRules.map(rule => ({
        minSpend: parseFloat(rule.min) || 0,
        maxSpend: parseFloat(rule.max) || 0,
        rewardValue: parseFloat(rule.percentage) || 0
      })),
      rewardCap: parsedRewardCap, // Number without commas (e.g., 40000)
      distributionType: getDistributionType(receiveMethod),
      milestoneTarget: receiveMethod === "INSTANT" ? 1 : (parseInt(milestoneTarget) || 0),
      pointExpirationDays: parseInt(pointExpiration) || 0,
      status: "ACTIVE", // Using uppercase as per API example
      startDate: startDate || null,
      endDate: endDate || null
    };

    console.log("=== REWARD RULE PAYLOAD ===");
    console.log("rewardCap (formatted in UI):", rewardCap);
    console.log("rewardCap (cleaned, no commas):", cleanedRewardCap);
    console.log("rewardCap (parsed number):", parsedRewardCap);
    console.log("Full payload:", payload);
    console.log("=============================");

    // Call the mutation hook
    handleCreateRewards(payload);
  };

  // Auto-set milestone target to 1 when receiveMethod is "INSTANT"
  useEffect(() => {
    if (receiveMethod === "INSTANT") {
      setMilestoneTarget("1");
    }
  }, [receiveMethod]);

  useEffect(() => {
    if (isSuccess) {
      onOpenChange(false);
    }
  }, [isSuccess, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:w-full sm:max-w-3xl max-h-[90vh] flex flex-col mx-2 sm:mx-0">
        {/* Header - Static */}
        <DialogHeader className="flex-shrink-0 pb-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <Image src={giftIcon} alt="Gift" width={35} height={35} className="sm:w-[45px] sm:h-[45px]" />
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-lg sm:text-xl font-semibold">Set Reward Rules</DialogTitle>
              <DialogDescription className="text-xs text-gray-600 leading-relaxed">
                Define your reward table parameters and rules. Once saved, they will apply across all branches.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto space-y-4 sm:space-y-6 pr-1 sm:pr-2">
          <EarnMethodSection
            earnMethod={earnMethod}
            setEarnMethod={setEarnMethod}
          />

          <RewardRulesSection
            earnMethod={earnMethod}
            minSpending={minSpending}
            setMinSpending={setMinSpending}
            maxSpending={maxSpending}
            setMaxSpending={setMaxSpending}
            rewardPercentage={rewardPercentage}
            setRewardPercentage={setRewardPercentage}
            rewardRules={rewardRules}
            setRewardRules={setRewardRules}
            showTable={showTable}
            setShowTable={setShowTable}
          />

          <RewardCapSection
            rewardCap={rewardCap}
            setRewardCap={setRewardCap}
          />

          <ReceiveMethodSection
            receiveMethod={receiveMethod}
            setReceiveMethod={setReceiveMethod}
          />

          {receiveMethod === "LATER" && (
            <MilestoneTargetSection
              milestoneTarget={milestoneTarget}
              setMilestoneTarget={setMilestoneTarget}
            />
          )}

          <ExpirationSection
            pointExpiration={pointExpiration}
            setPointExpiration={setPointExpiration}
          />

          <DateSection
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
          />
        </div>

        {/* Footer - Static */}
        <DialogFooter className="flex-shrink-0 pt-4 border-t">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-3 sm:gap-0">
            <p className="text-xs sm:text-sm text-gray-500 font-semibold leading-relaxed">
              You Can Change This Configurations On Setting Page
            </p>
            <Button
              onClick={handleSave}
              disabled={!isFormValid || isPending}
              className={`w-full sm:w-auto px-4 py-2 text-sm ${isFormValid && !isPending
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              isLoading={isPending}
              loadingText="Saving..."
            >
              Save & Apply
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}