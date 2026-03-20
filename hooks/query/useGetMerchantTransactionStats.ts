import api from "@/lib/api";
import { UseGetMerchantTransactionProps } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";


const useGetMerchantTransactionStats = ({ merchantId, startDate, endDate, customerEmail, customerPhoneNo, customerId }: UseGetMerchantTransactionProps) => {
  const { data, isPending, error, isError, refetch } = useQuery({
    queryKey: ["transaction-stats", merchantId, startDate, endDate, customerEmail, customerPhoneNo, customerId],
    queryFn: () => {
      const params = new URLSearchParams({ merchantId });
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);
      if (customerEmail) params.append("customerEmail", customerEmail);
      if (customerPhoneNo) params.append("customerPhoneNo", customerPhoneNo);
      if (customerId) params.append("customerId", customerId);
      return api.get(`/auth/merchant/transactionsStatistics?${params.toString()}`);
    },
  });

  return { data, isPending, error, isError, refetch };
};

export default useGetMerchantTransactionStats;