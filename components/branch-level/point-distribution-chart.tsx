"use client"

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { extractErrorMessage, formatValue, getChartBarColor, getRingColor } from "@/lib/helper";
import { BranchAnalyticsData } from "@/lib/types";
import { Bar, BarChart, CartesianGrid, Cell, LabelList, XAxis, YAxis } from "recharts";
import ErrorDisplay from "../common/error-display";
import PointDistributionChartSkeleton from "./point-distribution-chart-skeleton";

interface PointDistributionChartProps {
  data?: BranchAnalyticsData[];
  isPending: boolean;
  isError: boolean;
  error: Error | null;
}

export default function PointDistributionChart({
  data,
  isPending,
  isError,
  error,
}: Readonly<PointDistributionChartProps>) {
  if (isPending) {
    return <PointDistributionChartSkeleton />;
  }

  if (isError) {
    return <ErrorDisplay error={extractErrorMessage(error)} />;
  }

  // Transform data for Recharts and handle duplicates
  const chartData = data?.map((item, index) => ({
    name: `${item.branchName} ${index + 1}`, // Add index to make names unique
    originalName: item.branchName,
    value: item.totalPointsIssued,
    logo: item.logo,
    color: getChartBarColor(index.toString()),
    ringColor: getRingColor(index.toString()),
  })) || [];

  const chartConfig = {
    value: {
      label: "Points Issued",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  // Calculate dynamic width based on data length
  const dynamicWidth = Math.max(600, chartData.length * 50); // 80 per bar, minimum 600px

  return (
    <div className="bg-white rounded-2xl p-6">
      <div className="overflow-x-auto">
        <ChartContainer
          config={chartConfig}
          className="h-[400px]"
          style={{ minWidth: `${dynamicWidth}px` }}
        >
          <BarChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10 }}
              interval={0}
              angle={-45}
              textAnchor="end"
              height={100}
              width={80}
            />
            <YAxis
              domain={[0, 5]}
              tickCount={6}
              tick={{ fontSize: 12 }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent
                hideLabel
                formatter={(value, name, props) => [
                  formatValue(value as number),
                  props.payload?.originalName || name
                ]}
              />}
            />
            <Bar
              dataKey="value"
              radius={[4, 4, 0, 0]}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
              <LabelList
                position="top"
                offset={8}
                className="fill-foreground text-sm font-semibold"
                formatter={(value: number) => formatValue(value)}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  );
}