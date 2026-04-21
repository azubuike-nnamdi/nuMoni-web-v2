import api from "@/lib/api";
import { UseGetMerchantTransactionProps } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";


const useGetMerchantTransaction = ({ merchantId, startDate, endDate, customerEmail, customerPhoneNo, customerId, operationType, page = 0, size = 20 }: UseGetMerchantTransactionProps) => {
  const { data, isPending, error, isError, refetch } = useQuery({
    queryKey: ["transaction-history", merchantId, startDate, endDate, customerEmail, customerPhoneNo, customerId, operationType, page, size],
    queryFn: () => {
      const params = new URLSearchParams({ 
        merchantId,
        page: page.toString(),
        size: size.toString()
      });
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);
      if (customerEmail) params.append("customerEmail", customerEmail);
      if (customerPhoneNo) params.append("customerPhoneNo", customerPhoneNo);
      if (customerId) params.append("customerId", customerId);
      if (operationType) params.append("operationType", operationType);
      return api.get(`/auth/merchant/transactions?${params.toString()}`);
    },
  });

  return { data, isPending, error, isError, refetch };
};

export default useGetMerchantTransaction;