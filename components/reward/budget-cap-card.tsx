import { cashBackIcon } from "@/constant/icons";
import { formatNumber } from "@/lib/helper";
import Image from "next/image";
import { GraphDirectionIcon } from "../common/icon-svg";
import CardSkeleton from "./card-skeleton";

interface BudgetCapCardProps {
  rewardCap?: number;
  isLoading?: boolean;
}

export default function BudgetCapCard({ rewardCap, isLoading }: BudgetCapCardProps) {
  if (isLoading) {
    return <CardSkeleton variant="gradient" />;
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-green-800 to-green-900 text-white rounded-xl p-6 flex flex-col h-full">
      {/* Cash Back Background Icon */}
      <div className="absolute -top-8 -right-16 opacity-30">
        <Image src={cashBackIcon} alt="Cash Back" width={200} height={200} />
      </div>

      <div className="relative z-10">
        <h3 className="text-white text-sm font-medium mb-4">Budget Cap</h3>
      </div>
      <div className="relative z-10 text-3xl font-bold mb-4 flex-1 flex items-center">
        {formatNumber(rewardCap || 0)}
      </div>
      <div className="relative z-10">
        <hr className="border-white/10 mb-4" />
        <div className="flex items-center gap-2">
          <div className="bg-white rounded-full px-2 py-1 flex items-center gap-1">
            <GraphDirectionIcon className="w-3 h-3 bg-theme-dark-green rounded-full p-0.5 text-white" />
            <span className="text-xs font-semibold text-theme-dark-green">+20%</span>
          </div>
          <span className="text-xs text-white font-semibold">Increase Than Last Month</span>
        </div>
      </div>
    </div>
  );
}
