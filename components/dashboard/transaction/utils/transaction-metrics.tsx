import { formatValue } from "@/lib/helper";
import { PaymentHistoryData, TransactionMetric } from "@/lib/types";
import { Banknote, Gift, Star, Store, Users, Wallet } from "lucide-react";


export function getTransactionMetrics(data: PaymentHistoryData): TransactionMetric[] {
  return [
    {
      title: 'Total Count',
      value: String(data?.salesCount ?? 0),
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
      value: formatValue(data?.redeemsPoints ?? 0), // Not available in the API response
      changeType: 'positive',
      icon: <Gift className="h-6 w-6 text-gray-200" />,
      bgColor: 'bg-[#FFFBDA]',
      iconBgColor: 'bg-black'
    },
    {
      title: 'Commission/Service Fees',
      value: formatValue(data?.serviceFees ?? 0),
      changeType: 'positive',
      icon: <Banknote className="h-6 w-6 text-gray-200" />,
      bgColor: 'bg-[#DFFDDB]',
      iconBgColor: 'bg-black'
    },
  ];
}

