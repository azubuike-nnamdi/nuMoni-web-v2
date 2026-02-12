import { sampleUserIcon } from "@/constant/images";
import { extractErrorMessage, formatValue, getBarColor } from "@/lib/helper";
import { BranchAnalyticsData } from "@/lib/types";
import Image from "next/image";
import ErrorDisplay from "../common/error-display";
import TopPerformingBranchSkeleton from "./top-performing-branch-skeleton";

interface TopPerformingBranchProps {
  title?: string;
  subtitle?: string;
  data?: BranchAnalyticsData[];
  maxHeight?: string;
  isPending: boolean;
  isError: boolean;
  error: Error | null;
}

export default function TopPerformingBranch({
  title = "Rewards By Branch",
  subtitle = "Overview of points rewarded by top-performing branches.",
  data,
  maxHeight = "400px",
  isPending,
  isError,
  error,
}: Readonly<TopPerformingBranchProps>) {
  if (isPending) {
    return <TopPerformingBranchSkeleton title={title} subtitle={subtitle} maxHeight={maxHeight} />;
  }

  if (isError) {
    return <ErrorDisplay error={extractErrorMessage(error) || "An error occurred"} />;
  }

  return (
    <div className="bg-[#F3F4F6] rounded-2xl p-6 shadow-none ">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
        <p className="text-sm text-gray-600">{subtitle}</p>
      </div>

      {/* Scrollable List */}
      <div
        className="space-y-3 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
        style={{ maxHeight }}
      >
        {data?.map((item: BranchAnalyticsData, index: number) => (
          <div key={item.branchId} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
            {/* Colored indicator */}
            <div className={`w-1 h-8 ${getBarColor(index.toString())} rounded-full shrink-0`} />

            {/* Branch icon */}
            <div className="shrink-0">
              <div className="w-8 h-8 rounded-full overflow-hidden">
                <Image
                  src={item.logo || sampleUserIcon}
                  alt={item.branchName}
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Branch name */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {item.branchName}
              </p>
            </div>

            {/* Value */}
            <div className="shrink-0">
              <p className="text-sm font-semibold text-green-600">
                {formatValue(item.totalPointsIssued)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}