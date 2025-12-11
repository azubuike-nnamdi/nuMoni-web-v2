import { formatValue } from "@/lib/helper";
import { Gift, Star, Store, TrendingDown, Users, Wallet } from "lucide-react";
import React from "react";

export interface PaymentHistoryData {
  salesCount?: number;
  totalSales?: number;
  payOutPending?: number;
  payOut?: number;
  serviceFees?: number;
}

export interface TransactionMetric {
  title: string;
  value: string;
  changeType: 'positive' | 'negative';
  icon: React.ReactNode;
  bgColor: string;
  iconBgColor: string;
}

export function getTransactionMetrics(data: PaymentHistoryData): TransactionMetric[] {
  return [
    {
      title: 'Total Count',
      value: formatValue(data?.salesCount ?? 0),
      changeType: 'positive',
      icon: <Users className="h-6 w-6 text-gray-200" />,
      bgColor: 'bg-[#E3EAFD]',
      iconBgColor: 'bg-black'
    },
    {
      title: 'Total Sales',
      value: formatValue(data?.totalSales ?? 0),
      changeType: 'positive',
      icon: <Store className="h-6 w-6 text-gray-200" />,
      bgColor: 'bg-[#DFFDDB]',
      iconBgColor: 'bg-black'
    },
    {
      title: 'Pending Payout',
      value: formatValue(data?.payOutPending ?? 0),
      changeType: 'positive',
      icon: <Wallet className="h-6 w-6 text-gray-200" />,
      bgColor: 'bg-[#E3EAFD]',
      iconBgColor: 'bg-black'
    },
    {
      title: 'Settled Payout',
      value: formatValue(data?.payOut ?? 0),
      changeType: 'positive',
      icon: <Star className="h-6 w-6 text-gray-200" />,
      bgColor: 'bg-[#FFFBDA]',
      iconBgColor: 'bg-black'
    },
    {
      title: 'Points Redeemed',
      value: formatValue(0), // Not available in the API response
      changeType: 'positive',
      icon: <Gift className="h-6 w-6 text-gray-200" />,
      bgColor: 'bg-[#FFFBDA]',
      iconBgColor: 'bg-black'
    },
    {
      title: 'Commission',
      value: formatValue(data?.serviceFees ?? 0),
      changeType: 'positive',
      icon: <TrendingDown className="h-6 w-6 text-gray-200" />,
      bgColor: 'bg-[#DFFDDB]',
      iconBgColor: 'bg-black'
    },
  ];
}

