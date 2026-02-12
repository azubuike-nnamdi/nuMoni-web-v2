"use client";

import { RewardIcon } from "@/components/common/icon-svg";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { formatNumberWithCommas, isNumericOnly } from "@/lib/helper";
import { RewardCapSectionProps } from "@/lib/types";
import { Info } from "lucide-react";


export default function RewardCapSection({ rewardCap, setRewardCap }: Readonly<RewardCapSectionProps>) {
  return (
    <div className="space-y-2">
      <label htmlFor="rewardCap" className="text-sm font-medium text-gray-900 flex items-center gap-2">
        Maximum Pending Reward
        <Tooltip>
          <TooltipTrigger asChild>
            <Info className="h-4 w-4 text-gray-500 cursor-help" />
          </TooltipTrigger>
          <TooltipContent>
            <p>Set The Maximum Points Your Brand Can Give Out Within A Period.</p>
          </TooltipContent>
        </Tooltip>
        <span className="text-red-500">*</span>
      </label>

      <div className="relative">
        <Input
          type="text"
          placeholder="0"
          value={formatNumberWithCommas(rewardCap)}
          onChange={(e) => {
            const value = e.target.value;
            if (isNumericOnly(value)) {
              setRewardCap(formatNumberWithCommas(value));
            }
          }}
          className="w-full pl-10 pr-3 py-6 focus:outline-none focus:ring-0 focus:border-none"
        />
        <RewardIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-theme-dark-green pointer-events-none h-4 w-4" />
      </div>
    </div>
  );
}
