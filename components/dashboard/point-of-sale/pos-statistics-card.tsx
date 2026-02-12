/**
 * POSStatisticsCard Component
 * 
 * Displays all statistics for a single category (Sales, Payouts, or Service Fees)
 */

import { formatValue } from "@/lib/helper";
import { LucideIcon } from "lucide-react";

interface StatisticsData {
  periodAmount: number;
  totalAmount: number;
  periodCount: number;
  totalCount: number;
}

interface POSStatisticsCardProps {
  title: string;
  data: StatisticsData;
  icon: LucideIcon;
  bgColor: string;
  iconBgColor: string;
}

export default function POSStatisticsCard({
  title,
  data,
  icon: Icon,
  bgColor,
  iconBgColor,
}: Readonly<POSStatisticsCardProps>) {
  return (
    <div className={`${bgColor} rounded-xl p-6 shadow-none border border-gray-100`}>
      <div className="flex flex-col h-full">
        {/* Icon */}
        <div className={`${iconBgColor} p-3 rounded-lg w-12 h-12 flex items-center justify-center`}>
          <Icon className="h-6 w-6 text-gray-200" />
        </div>

        {/* Title */}
        <p className="text-md font-medium text-gray-600 mt-6 mb-6">{title}</p>

        {/* Statistics Grid - 2x2 layout */}
        <div className="grid grid-cols-2 gap-4 mt-auto">
          {/* Period Amount */}
          <div>
            <p className="text-xs text-gray-500 mb-1">Period Amount</p>
            <p className="text-xl font-extrabold text-gray-900">
              ₦{formatValue(data.periodAmount)}
            </p>
          </div>

          {/* Period Count */}
          <div>
            <p className="text-xs text-gray-500 mb-1">Period Count</p>
            <p className="text-xl font-extrabold text-gray-900">
              {data.periodCount.toLocaleString()}
            </p>
          </div>

          {/* Total Amount */}
          <div>
            <p className="text-xs text-gray-500 mb-1">Total Amount</p>
            <p className="text-xl font-extrabold text-gray-900">
              ₦{formatValue(data.totalAmount)}
            </p>
          </div>

          {/* Total Count */}
          <div>
            <p className="text-xs text-gray-500 mb-1">Total Count</p>
            <p className="text-xl font-extrabold text-gray-900">
              {data.totalCount.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

