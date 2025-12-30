import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";


const useGetCategoryList = () => {
  const { data, isPending, error, isError, refetch } = useQuery({
    queryKey: ["category", "list"],
    queryFn: () => api.get("/merchant/categoryList"),
  });

  return { data, isPending, error, isError, refetch };
};

export default useGetCategoryList;