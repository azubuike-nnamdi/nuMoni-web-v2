import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";


const useGetPaymentHistory = ({ fromDate, toDate }: { fromDate: string, toDate: string }) => {
  const { data, isPending, error, isError, refetch } = useQuery({
    queryKey: ["payment-history", fromDate, toDate],
    queryFn: () => api.get(`/merchant/paymentHistory?fromDate=${fromDate}&toDate=${toDate}`),
    enabled: !!fromDate && !!toDate, // Only run query when both dates are provided
  });

  return { data, isPending, error, isError, refetch };
};

export default useGetPaymentHistory;