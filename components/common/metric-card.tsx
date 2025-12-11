import { MetricCardProps } from "@/lib/types";

export const MetricCard = ({ title, value, change, changeType, icon, bgColor, iconBgColor }: MetricCardProps) => {
  return (
    <div className={`${bgColor} rounded-xl p-6 shadow-none border border-gray-100`}>
      <div className="flex flex-col h-full">
        {/* Icon */}
        <div className={`${iconBgColor} p-3 rounded-lg w-12 h-12 flex items-center justify-center`}>
          {icon}
        </div>

        {/* Title */}
        <p className="text-md font-medium text-gray-600 mt-6 mb-3">{title}</p>

        {/* Value and Change - Always at bottom */}
        <div className="flex items-baseline gap-2 mt-auto">
          <p className="text-lg font-extrabold text-gray-900">{value}</p>
          {change && (
            <p className={`text-xs font-medium ${changeType === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}>
              {change}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};