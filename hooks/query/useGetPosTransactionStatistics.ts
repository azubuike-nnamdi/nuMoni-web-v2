import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

interface UseGetPosTransactionStatisticsParams {
  merchantId?: string;
  posId: string;
  startDate?: string;
  endDate?: string;
}

const useGetPosTransactionStatistics = (params: UseGetPosTransactionStatisticsParams) => {
  const { merchantId, posId, startDate, endDate } = params;

  const { data, isPending, error, isError, refetch } = useQuery({
    queryKey: ["pos-transaction-statistics", merchantId, posId, startDate, endDate],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (merchantId) {
        queryParams.append("merchantId", merchantId);
      }
      queryParams.append("posId", posId);
      if (startDate) {
        queryParams.append("startDate", startDate);
      }
      if (endDate) {
        queryParams.append("endDate", endDate);
      }

      const queryString = queryParams.toString();
      const response = await api.get(`/auth/pos/transactionsStatistics?${queryString}`);
      return response.data;
    },
    enabled: !!posId, // Only run query when posId is provided
  });

  return { data, isPending, error, isError, refetch };
};

export default useGetPosTransactionStatistics;

