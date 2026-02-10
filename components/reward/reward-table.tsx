'use client'

import { Skeleton } from "@/components/ui/skeleton";
import {
  createRewardsSummaryData,
  formatNumber,
  getRewardIcon,
  getRewardsRules,
  shouldShowEmptyState,
  shouldShowRules,
  shouldShowSkeleton
} from "@/lib/helper";
import { RewardRule, Rewards } from "@/lib/types";
import Image from "next/image";

export default function RewardTable({ rewards, isPending }: Readonly<{ rewards: Rewards | null, isPending: boolean }>) {
  // const [countdown, setCountdown] = useState(30);
  // const [showNotifications, setShowNotifications] = useState(false);

  // Debug logging
  // console.log("RewardTable - rewards:", rewards);

  // Get rules and summary data using helper functions
  const rules = getRewardsRules(rewards);

  const summaryDataRaw = createRewardsSummaryData(rewards);



  // Add actual icons to summary data


  const summaryData = summaryDataRaw.map(item => ({
    ...item,
    icon: getRewardIcon(item.icon)
  }));



  // Helper functions for rendering
  const showSkeleton = shouldShowSkeleton(isPending, rules.length);
  const showRules = shouldShowRules(rules.length);
  const showEmptyState = shouldShowEmptyState(isPending, rules.length);

  //set countdown and time out. //if countdown is 0, pause notifications
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setCountdown(prev => {
  //       if (prev <= 0) {
  //         setShowNotifications(true);
  //         return 0;
  //       }
  //       return prev - 1;
  //     });
  //   }, 1000);
  //   return () => clearInterval(interval);
  // }, []);

  return (
    <main>
      <div className="bg-theme-gray-200 rounded-2xl p-6">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Left Section - Reward Table */}
          <div className="bg-white rounded-xl p-3">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[280px]">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-theme-dark-green border-b border-theme-gray">Min</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-theme-dark-green border-b border-theme-gray">Max</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-theme-dark-green border-b border-theme-gray">
                      {rewards?.rewardType === "FIXED_POINTS" ? "Reward" : "Reward%"}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {showSkeleton && (
                    // Loading skeleton for table rows
                    Array.from({ length: 3 }).map((_, index) => (
                      <tr key={index} className="border-b border-theme-gray last:border-b-0">
                        <td className="px-4 py-3">
                          <Skeleton className="h-4 w-12" />
                        </td>
                        <td className="px-4 py-3">
                          <Skeleton className="h-4 w-12" />
                        </td>
                        <td className="px-4 py-3">
                          <Skeleton className="h-4 w-8" />
                        </td>
                      </tr>
                    ))
                  )}

                  {showRules && rules.map((rule: RewardRule, index: number) => (
                    <tr
                      key={index}
                      className="border-b border-theme-gray last:border-b-0"
                    >
                      <td className="px-4 py-3 text-sm text-gray-900">{formatNumber(rule.minSpend, 0)}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{formatNumber(rule.maxSpend, 0)}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {rule.rewardValue}{rewards?.rewardType === "FIXED_POINTS" ? "" : "%"}
                      </td>
                    </tr>
                  ))}

                  {showEmptyState && (
                    <tr>
                      <td colSpan={3} className="px-4 py-8 text-center text-gray-500">
                        No reward rules found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Section - Table Summary */}
          <div className="bg-white rounded-xl p-3">
            <h2 className="text-lg font-semibold text-theme-gray-700 ">Table Summary</h2>
            <div className="border border-theme-gray rounded-xl p-3">
              {showSkeleton && (
                // Loading skeleton for summary items
                Array.from({ length: 4 }).map((_, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-2">
                        <Skeleton className="w-5 h-5" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                      <div className="min-w-0">
                        <Skeleton className="h-4 w-20" />
                      </div>
                    </div>
                    {index < 3 && (
                      <hr className="border-theme-gray" />
                    )}
                  </div>
                ))
              )}

              {!showSkeleton && summaryData.map((item, index) => {
                const isLucideIcon = typeof item.icon !== 'string';
                const Icon = item.icon as React.ElementType;

                return (
                  <div key={item.label}>
                    <div className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-2">
                        {isLucideIcon ? (
                          <Icon className="text-gray-400 w-5 h-5" />
                        ) : (
                          <Image
                            src={item.icon as string}
                            alt={item.label}
                            width={20}
                            height={20}
                            className="text-gray-400"
                          />
                        )}
                        <span className="text-sm font-medium text-black/40">{item.label}</span>
                      </div>
                      <div className="min-w-0">
                        <span className={`text-sm text-black wrap-break-words font-semibold ${item.className || ''}`}>
                          {item.value}
                        </span>
                      </div>
                    </div>
                    {index < summaryData.length - 1 && (
                      <hr className="border-theme-gray" />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>


      </div>

      {/* Show countdown warning while counting down */}
      {/* {countdown > 0 && (
        <RewardNotification
          text={`Reward System Will Be Paused When Allocated Amount Has Been Exhausted. (${countdown}s remaining)`}
          icon={warningIcon}
          type="info"
          delay={0}
          duration={0.6}
          className="my-5"
        />
      )} */}

      {/* Show pause notification when countdown reaches 0 */}
      {/* {showNotifications && (
        <RewardNotification
          text="Your Reward Cap Has Been Reached. Rewards Are Paused Automatically. Edit The Cap To Resume."
          icon={redMusicPauseIcon}
          type="pause"
          delay={0}
          duration={0.6}
          className="my-5"
        />
      )} */}
    </main>
  );
}