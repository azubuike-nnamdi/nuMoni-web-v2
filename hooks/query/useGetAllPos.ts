import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

const useGetAllPos = () => {
  const { data, isPending, error, isError, refetch } = useQuery({
    queryKey: ["pos"],
    queryFn: () => api.get("/merchant/pos/all"),
  });

  return { data, isPending, error, isError, refetch };
};

export default useGetAllPos;