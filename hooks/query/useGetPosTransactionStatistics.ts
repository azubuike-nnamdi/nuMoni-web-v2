import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

interface UseGetPosTransactionStatisticsParams {
  merchantId?: string;
  posId: string;
}

const useGetPosTransactionStatistics = (params: UseGetPosTransactionStatisticsParams) => {
  const { merchantId, posId } = params;

  const { data, isPending, error, isError, refetch } = useQuery({
    queryKey: ["pos-transaction-statistics", merchantId, posId],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (merchantId) {
        queryParams.append("merchantId", merchantId);
      }
      queryParams.append("posId", posId);

      const queryString = queryParams.toString();
      const response = await api.get(`/auth/pos/transactionsStatistics?${queryString}`);
      return response.data;
    },
    enabled: !!posId, // Only run query when posId is provided
  });

  return { data, isPending, error, isError, refetch };
};

export default useGetPosTransactionStatistics;

