import { pointIcon } from "@/constant/icons";
import { formatNumber } from "@/lib/helper";
import Image from "next/image";
import { GraphDirectionIcon } from "../common/icon-svg";
import CardErrorState from "./card-error-state";
import CardSkeleton from "./card-skeleton";

interface TotalPointsRewardedCardProps {
  totalRewardCap?: number;
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  onRetry?: () => void;
}

export default function TotalPointsRewardedCard({
  totalRewardCap,
  isLoading,
  isError,
  errorMessage,
  onRetry,
}: TotalPointsRewardedCardProps) {
  const renderData = () => {
    if (isError) {
      return <CardErrorState errorMessage={errorMessage} onRetry={onRetry} />;
    }

    if (isLoading) {
      return (
        <div className="flex-1 flex items-center justify-center">
          <CardSkeleton />
        </div>
      );
    }

    return (
      <>
        <div className="text-3xl font-bold mb-4 flex-1">
          {formatNumber(totalRewardCap ?? 0)}
        </div>
        <hr className="border-gray-100 mb-4" />
        {!totalRewardCap && (
          <div className="flex items-center gap-2">
            <div className="bg-gray-100 rounded-full px-2 py-1 flex items-center gap-1">
              <GraphDirectionIcon className="w-3 h-3 bg-gray-500 rounded-full p-0.5 text-white" />
              <span className="text-xs font-medium text-gray-600">0%</span>
            </div>
            <span className="text-xs text-gray-500">No Data Yet</span>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="bg-gray-200/40 rounded-xl p-6 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-[#727272] text-md font-semibold">Total Points Distributed</h3>
        <div className="bg-white rounded-full p-3">
          <Image src={pointIcon} alt="Reward" width={18} height={18} />
        </div>
      </div>

      {renderData()}
    </div>
  );
}
