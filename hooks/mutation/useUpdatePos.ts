import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export type UpdatePosPayload = {
  id: string;
  posId: string;
  posName: string;
  merchantId: string;
  branchId?: string;
  bankName: string;
  accountNo: string;
  accountHolderName: string;
  bankCode: string;
  bankTransferCode: string;
  location?: string;
  address?: string;
  status?: string;
  posQRCode?: string;
};

export const useUpdatePos = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: (data: UpdatePosPayload) => api.put(`/merchant/pos/update`, data),
    onSuccess: (data) => {
      if (data) {
        toast.success(data?.data?.message ?? "POS updated successfully");
      }
    },
    onError: (error: { response: { data: { message: string } } }) => {
      toast.error(error?.response?.data?.message ?? "Failed to update POS");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["pos"] });
    },
  });

  const handleUpdatePos = (data: UpdatePosPayload) => {
    mutate(data);
  };

  return { handleUpdatePos, isPending, isSuccess };
};

