import api from "@/lib/api";
import { VerifyBankNamePayload } from "@/lib/types";
import { useMutation } from "@tanstack/react-query";
import { useCallback } from "react";
import { toast } from "sonner";


export const useVerifyBankName = () => {
  const { mutate, isPending, isSuccess, data } = useMutation({
    mutationFn: (data: VerifyBankNamePayload) => api.post("/merchant/payonus/transfer-requests/name-enquiry", data),
    onSuccess: () => {
      // console.log("verification response", response);
      toast.success("Account verified successfully");
    },
    onError: (error: { response: { data: { message: string } } }) => {
      toast.error(error?.response?.data?.message ?? "Failed to verify bank");
    }
  })

  const handleVerifyBankName = useCallback((data: VerifyBankNamePayload) => {
    mutate(data);
  }, [mutate]);

  // Extract account name from response
  const accountName = data?.data?.data?.accountName || "";
  // console.log("accountName", accountName);

  return { handleVerifyBankName, isPending, isSuccess, accountName, data };

}