import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";


const useGetTransaction = ({ fromDate, toDate, page = 0, size = 20, status, category }: { fromDate: string, toDate: string, page?: number, size?: number, status?: string, category?: string }) => {
  const { data, isPending, error, isError, refetch } = useQuery({
    queryKey: ["transaction", "enhanced-transaction-list", fromDate, toDate, page, size, status, category],
    queryFn: async () => {
      let url = `/merchant/enhanced-transaction-list?fromDate=${fromDate}&toDate=${toDate}&page=${page}&size=${size}`;
      if (status && status !== 'All') {
        url += `&status=${status?.toLowerCase()}`;
      }
      if (category && category !== 'All') {
        // Convert category to API format (replace spaces with underscores and uppercase)
        const categoryParam = category.replace(/\s+/g, '_').toUpperCase();
        url += `&transactionType=${categoryParam}`;
      }
      const response = await api.get(url);
      return response.data;
    },
    enabled: !!fromDate && !!toDate, // Only run query when both dates are provided
  });

  return { data, isPending, error, isError, refetch };
};

export default useGetTransaction;