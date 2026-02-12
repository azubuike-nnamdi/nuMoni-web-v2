import api from "@/lib/api";
import { getCurrentDate, getYesterdayDate } from "@/lib/helper";
import { useQuery } from "@tanstack/react-query";

interface UseGetPointsRedeemedParams {
  page?: number;
  size?: number;
  search?: string;
  searchType?: string;
  fromDate?: string;
  toDate?: string;
  enabled?: boolean;
}

const useGetPointsRedeemed = (params: UseGetPointsRedeemedParams = {}) => {
  const { page = 0, size = 10, search, searchType, fromDate, toDate, enabled = true } = params;

  // Set defaults only if not provided
  const effectiveFromDate = fromDate || (getYesterdayDate("dd-mm-yyyy") as string);
  const effectiveToDate = toDate || (getCurrentDate("dd-mm-yyyy") as string);

  const { data, isPending, error, isError, refetch } = useQuery({
    queryKey: ["points-redeemed", effectiveFromDate, effectiveToDate, page, size, search, searchType],
    queryFn: () => {
      const queryParams = new URLSearchParams();

      // Required parameters
      queryParams.append("fromDate", effectiveFromDate);
      queryParams.append("toDate", effectiveToDate);
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
    enabled: enabled,
  });

  return { data, isPending, error, isError, refetch };
};

export default useGetPointsRedeemed;