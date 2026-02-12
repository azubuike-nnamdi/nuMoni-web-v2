import { getEarnMethodFromRewardType, getReceiveMethodFromDistributionType, mapPointExpirationToForm } from "@/lib/helper";
import { Rewards } from "@/lib/types";
import { useEffect, useState } from "react";

export const useUpdateRewardForm = (ruleData: Rewards | null, open: boolean) => {
  const [earnMethod, setEarnMethod] = useState<string>("");
  const [rewardCap, setRewardCap] = useState<string>("");
  const [milestoneTarget, setMilestoneTarget] = useState<string>("");
  const [receiveMethod, setReceiveMethod] = useState<string>("");
  const [pointExpiration, setPointExpiration] = useState<string>("10000days");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [minSpending, setMinSpending] = useState<string>("");
  const [maxSpending, setMaxSpending] = useState<string>("");
  const [rewardPercentage, setRewardPercentage] = useState<string>("");
  const [rewardRules, setRewardRules] = useState<Array<{ min: string, max: string, percentage: string }>>([]);
  const [showTable, setShowTable] = useState<boolean>(false);

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setEarnMethod("");
      setRewardCap("");
      setMilestoneTarget("");
      setReceiveMethod("");
      setPointExpiration("10000days");
      setStartDate("");
      setEndDate("");
      setRewardRules([]);
      setShowTable(false);
    }
  }, [open]);

  // Prepopulate form when ruleData changes
  useEffect(() => {
    if (ruleData && open) {
      const mappedEarnMethod = getEarnMethodFromRewardType(ruleData.rewardType || "");
      const mappedReceiveMethod = getReceiveMethodFromDistributionType(ruleData.distributionType || "");
      const mappedPointExpiration = mapPointExpirationToForm(ruleData.pointExpirationDays || 0);

      setTimeout(() => {
        setEarnMethod(mappedEarnMethod);
        setRewardCap(ruleData.rewardCap?.toString() || "");
        setMilestoneTarget(ruleData.milestoneTarget?.toString() || "");
        setReceiveMethod(mappedReceiveMethod);
        setPointExpiration(mappedPointExpiration);
        setStartDate(ruleData.startDate || "");
        setEndDate(ruleData.endDate || "");

        if (ruleData.rules && ruleData.rules.length > 0) {
          const mappedRules = ruleData.rules.map(rule => ({
            min: rule.minSpend?.toString() || "",
            max: rule.maxSpend?.toString() || "",
            percentage: rule.rewardValue?.toString() || ""
          }));
          setRewardRules(mappedRules);
          setShowTable(true);
        }
      }, 100);
    }
  }, [ruleData, open]);

  // Auto-set milestone target to 1 when receiveMethod is "INSTANT"
  useEffect(() => {
    if (receiveMethod === "INSTANT") {
      setMilestoneTarget("1");
    }
  }, [receiveMethod]);

  return {
    earnMethod, setEarnMethod,
    rewardCap, setRewardCap,
    milestoneTarget, setMilestoneTarget,
    receiveMethod, setReceiveMethod,
    pointExpiration, setPointExpiration,
    startDate, setStartDate,
    endDate, setEndDate,
    minSpending, setMinSpending,
    maxSpending, setMaxSpending,
    rewardPercentage, setRewardPercentage,
    rewardRules, setRewardRules,
    showTable, setShowTable
  };
};