
import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export type CreatePosPayload = {
  posId?: string;
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

export const useCreatePos = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: (data: CreatePosPayload) => api.post("/merchant/pos/create", data),
    onSuccess: (data) => {
      if (data) {
        toast.success(data?.data?.message ?? "POS created successfully");

      }
    },
    onError: (error: { response: { data: { message: string } } }) => {
      // console.log("Failed to create POS", error);
      toast.error(error?.response?.data?.message ?? "Failed to create POS");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["pos"] });
    },
  });

  const handleCreatePos = (data: CreatePosPayload) => {
    mutate(data);
  };

  return { handleCreatePos, isPending, isSuccess };
};
