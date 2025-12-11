'use client';

import { MetricCard } from "@/components/common/metric-card";
import { TransactionMetric } from "../utils/transaction-metrics";

interface TransactionMetricsGridProps {
  metrics: TransactionMetric[];
}

export default function TransactionMetricsGrid({ metrics }: TransactionMetricsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 my-5">
      {metrics.map((metric, index) => (
        <MetricCard
          key={index}
          title={metric.title}
          value={metric.value.toString()}
          changeType={metric.changeType}
          icon={metric.icon}
          bgColor={metric.bgColor}
          iconBgColor={metric.iconBgColor}
        />
      ))}
    </div>
  );
}

