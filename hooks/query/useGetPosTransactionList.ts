import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

interface UseGetPosTransactionListParams {
  posId: string;
  merchantId: string;
  page?: number;
  size?: number;
  startDate?: string;
  endDate?: string;
  transactionType?: string;
  customerEmail?: string;
  customerPhoneNo?: string;
  customerId?: string;
  customerName?: string;
}

const useGetPosTransactionList = (params: UseGetPosTransactionListParams) => {
  const { posId, merchantId, page = 0, size = 50, startDate, endDate, transactionType, customerEmail, customerPhoneNo, customerId, customerName } = params;

  const { data, isPending, error, isError, refetch } = useQuery({
    queryKey: ["pos-transactions", posId, merchantId, page, size, startDate, endDate, transactionType, customerEmail, customerPhoneNo, customerId, customerName],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      queryParams.append("posId", posId);
      queryParams.append("merchantId", merchantId);
      queryParams.append("page", page.toString());
      queryParams.append("size", size.toString());

      if (startDate) queryParams.append("startDate", startDate);
      if (endDate) queryParams.append("endDate", endDate);
      if (transactionType) queryParams.append("transactionType", transactionType);
      if (customerEmail) queryParams.append("customerEmail", customerEmail);
      if (customerPhoneNo) queryParams.append("customerPhoneNo", customerPhoneNo);
      if (customerId) queryParams.append("customerId", customerId);
      if (customerName) queryParams.append("customerName", customerName);

      const queryString = queryParams.toString();
      const response = await api.get(`/auth/pos/transactions?${queryString}`);
      return response.data;
    },
    enabled: !!posId && !!merchantId, // Only run query when posId and merchantId are provided
  });

  return { data, isPending, error, isError, refetch };
};

export default useGetPosTransactionList;

