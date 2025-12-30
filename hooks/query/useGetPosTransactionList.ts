import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

interface UseGetPosTransactionListParams {
  posId: string;
  merchantId: string;
  page?: number;
  size?: number;
}

const useGetPosTransactionList = (params: UseGetPosTransactionListParams) => {
  const { posId, merchantId, page = 0, size = 50 } = params;

  const { data, isPending, error, isError, refetch } = useQuery({
    queryKey: ["pos-transactions", posId, merchantId, page, size],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      queryParams.append("posId", posId);
      queryParams.append("merchantId", merchantId);
      queryParams.append("page", page.toString());
      queryParams.append("size", size.toString());
      const queryString = queryParams.toString();
      const response = await api.get(`/auth/pos/transactions?${queryString}`);
      return response.data;
    },
    enabled: !!posId && !!merchantId, // Only run query when posId and merchantId are provided
  });

  return { data, isPending, error, isError, refetch };
};

export default useGetPosTransactionList;

