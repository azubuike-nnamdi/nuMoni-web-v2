import api from "@/lib/api";
import { getCurrentDate, getYesterdayDate } from "@/lib/helper";
import { useQuery } from "@tanstack/react-query";

interface UseGetPointsRedeemedParams {
  page?: number;
  size?: number;
  search?: string;
  searchType?: string;
}

const useGetPointsRedeemed = (params: UseGetPointsRedeemedParams = {}) => {
  const { page = 0, size = 10, search, searchType } = params;
  const fromDate = getYesterdayDate("dd-mm-yyyy") as string;
  const toDate = getCurrentDate("dd-mm-yyyy") as string;

  const { data, isPending, error, isError, refetch } = useQuery({
    queryKey: ["points-redeemed", fromDate, toDate, page, size, search, searchType],
    queryFn: () => {
      const queryParams = new URLSearchParams();

      // Required parameters
      queryParams.append("fromDate", fromDate);
      queryParams.append("toDate", toDate);
      queryParams.append("page", page.toString());
      queryParams.append("size", size.toString());

      // Optional search parameter
      if (search) {
        queryParams.append("search", search);
        if (searchType) queryParams.append("searchType", searchType);
      }

      const queryString = queryParams.toString();
      return api.get(`/merchant/points-redeemed?${queryString}`);
    },
  });

  return { data, isPending, error, isError, refetch };
};

export default useGetPointsRedeemed;