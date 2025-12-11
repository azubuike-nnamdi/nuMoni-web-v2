import { pointIcon } from "@/constant/icons";
import { formatNumber } from "@/lib/helper";
import Image from "next/image";
import CardErrorState from "./card-error-state";
import CardSkeleton from "./card-skeleton";

interface TotalPointsBalanceCardProps {
  availablePoints?: number;
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  onRetry?: () => void;
}

export default function TotalPointsBalanceCard({
  availablePoints,
  isLoading,
  isError,
  errorMessage,
  onRetry,
}: TotalPointsBalanceCardProps) {
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
        <div className="text-3xl font-bold mb-4">
          {formatNumber(availablePoints ?? 0)}
        </div>
        <hr className="border-gray-100 mb-4" />
      </>
    );
  };

  return (
    <div className="bg-gray-200/40 rounded-xl p-6 flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-[#727272] text-md font-semibold">Total Points Balance</h3>
        <div className="bg-white rounded-full p-3">
          <Image src={pointIcon} alt="Reward" width={18} height={18} />
        </div>
      </div>

      <div className="flex flex-col flex-1">
        {renderData()}
      </div>
    </div>
  );
}
