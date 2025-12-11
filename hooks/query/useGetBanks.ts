import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";


const useGetBanks = () => {
  const { data, isPending, error, isError, refetch } = useQuery({
    queryKey: ["banks"],
    queryFn: () => api.get("/merchant/payonus/banks"),
  });

  return { data, isPending, error, isError, refetch };
};

export default useGetBanks;