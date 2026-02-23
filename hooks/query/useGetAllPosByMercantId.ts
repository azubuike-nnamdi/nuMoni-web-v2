// auth / noAuthPosListByMerchant ? merchantId = 10

import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

const useGetAllPosByMerchantId = (merchantId: string) => {
  const { data, isPending, error, isError, refetch } = useQuery({
    queryKey: ["pos"],
    queryFn: () => api.get(`/auth/noAuthPosListByMerchant?merchantId=${merchantId}`),
  });

  return { data, isPending, error, isError, refetch };
};

export default useGetAllPosByMerchantId;