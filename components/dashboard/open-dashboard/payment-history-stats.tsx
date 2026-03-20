'use client';

import { MetricCard } from "@/components/common/metric-card";
import { formatCurrency } from "@/lib/helper";
import { StatsProps } from "@/lib/types";
import { Banknote, CreditCard, ShoppingCart } from "lucide-react";

export function PaymentHistoryStats({ sales, payouts, serviceFees }: Readonly<StatsProps>) {
  const sections = [
    {
      title: "Sales Statistics",
      data: sales,
      icon: <ShoppingCart className="h-5 w-5 text-green-600" />,
      color: "green",
      bgLight: "bg-green-50",
      bgIcon: "bg-green-100",
      totalLabel: "Total Sales",
      periodLabel: "Period Sales",
      countLabel: "Sales Records",
      periodCountLabel: "Period  Records"


    },
    {
      title: "Payout Statistics",
      data: payouts,
      icon: <Banknote className="h-5 w-5 text-blue-600" />,
      color: "blue",
      bgLight: "bg-blue-50",
      bgIcon: "bg-blue-100",
      totalLabel: "Total Payouts",
      periodLabel: "Period Payouts",
      countLabel: "Payout Records",
      periodCountLabel: "Period  Records"

    },
    {
      title: "Service Fee Statistics",
      data: serviceFees,
      icon: <CreditCard className="h-5 w-5 text-orange-600" />,
      color: "orange",
      bgLight: "bg-orange-50",
      bgIcon: "bg-orange-100",
      totalLabel: "Total Fees",
      periodLabel: "Period Fees",
      countLabel: "Fee Records",
      periodCountLabel: "Period  Records"
    },
  ];

  return (
    <div className="space-y-12">
      {sections.map((section) => (
        <section key={section.title} className="w-full">
          <div className="flex items-center gap-3 mb-6">
            <h3 className="text-xl font-bold text-gray-900 tracking-tight">{section.title}</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex-1 min-w-0">
              <MetricCard
                title={section.totalLabel}
                value={formatCurrency(section.data.totalAmount || 0)}
                changeType="positive"
                icon={section.icon}
                bgColor={section.bgLight}
                iconBgColor={section.bgIcon}
              />
            </div>
            <div className="flex-1 min-w-0">
              <MetricCard
                title={section.periodLabel}
                value={formatCurrency(section.data.periodAmount || 0)}
                changeType="positive"
                icon={section.icon}
                bgColor="bg-white"
                iconBgColor={section.bgLight}
              />
            </div>
            <div className="flex-1 min-w-0">
              <MetricCard
                title={section.countLabel}
                value={String(section.data.totalCount || 0)}
                changeType="positive"
                icon={section.icon}
                bgColor="bg-white"
                iconBgColor={section.bgLight}
              />
            </div>
            <div className="flex-1 min-w-0">
              <MetricCard
                title={section.periodCountLabel}
                value={String(section.data.periodCount || 0)}
                changeType="positive"
                icon={section.icon}
                bgColor="bg-white"
                iconBgColor={section.bgLight}
              />
            </div>
          </div>

        </section>
      ))}
    </div>
  );
}
