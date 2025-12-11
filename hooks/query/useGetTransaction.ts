import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";


const useGetTransaction = ({ fromDate, toDate, page = 0, size = 20, status }: { fromDate: string, toDate: string, page?: number, size?: number, status?: string }) => {
  const { data, isPending, error, isError, refetch } = useQuery({
    queryKey: ["transaction", "enhanced-transaction-list", fromDate, toDate, page, size, status],
    queryFn: async () => {
      let url = `/merchant/enhanced-transaction-list?fromDate=${fromDate}&toDate=${toDate}&page=${page}&size=${size}`;
      if (status && status !== 'All') {
        url += `&status=${status?.toLowerCase()}`;
      }
      const response = await api.get(url);
      return response.data;
    },
    enabled: !!fromDate && !!toDate, // Only run query when both dates are provided
  });

  return { data, isPending, error, isError, refetch };
};

export default useGetTransaction;