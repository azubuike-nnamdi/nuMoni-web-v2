// merchant / transactionList


import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";


const useGetCustomerAnalytics = ({
  startDate,
  endDate,
  page = 0,
  size = 10,
}: {
  startDate: string;
  endDate: string;
  page?: number;
  size?: number;
}) => {
  const { data, isPending, error, isError, refetch } = useQuery({
    queryKey: ["merchant", startDate, endDate, page, size],
    queryFn: async () => {
      const response = await api.get(
        `/merchant/customerAnalytics?fromDate=${startDate}&toDate=${endDate}&page=${page}&size=${size}`
      );
      return response.data;
    },
    enabled: !!startDate && !!endDate, // Only run query when both dates are provided
  });

  return { data, isPending, error, isError, refetch };
};

export default useGetCustomerAnalytics;