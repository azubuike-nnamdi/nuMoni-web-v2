import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface UpdateRewardStatusProps {
  merchantId: string;
  id: string
  status: string;
}

export const useUpdateRewardStatus = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: (payload: UpdateRewardStatusProps) => api.put(`/merchant/updateMerchantRewardStatus
`, payload),
    onSuccess: (data) => {
      if (data) {
        toast.success(data?.data?.message ?? "Reward status updated successfully");
        queryClient.invalidateQueries({ queryKey: ["reward"] });
      }
    },
    onError: (error: { response: { data: { message: string } } }) => {
      toast.error(error?.response?.data?.message ?? "Failed to update reward status");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["reward"] });
    },
  });

  const handleUpdateRewardStatus = (payload: UpdateRewardStatusProps) => {
    mutate(payload);
  };
  return { handleUpdateRewardStatus, isPending, isSuccess };
};