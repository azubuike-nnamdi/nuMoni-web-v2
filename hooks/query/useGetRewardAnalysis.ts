import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

type RewardAnalysisParams = {
  startDate?: string;
  endDate?: string;
};

const useGetRewardAnalysis = ({ startDate, endDate }: RewardAnalysisParams = {}) => {
  const { data, isPending, isFetching, error, isError, refetch } = useQuery({
    queryKey: ["user", "reward-analytics", startDate, endDate],
    queryFn: () =>
      api.get("/merchant/reward-analytics", {
        params: {
          ...(startDate ? { startDate } : {}),
          ...(endDate ? { endDate } : {}),
        },
      }),
  });

  return { data, isPending, isFetching, error, isError, refetch };
};

export default useGetRewardAnalysis;