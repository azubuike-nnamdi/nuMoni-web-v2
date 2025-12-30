import payOnUsApi from "@/lib/pay-on-us-api";
import { VerifyPayOnUsBankPayload } from "@/lib/types";
import { useMutation } from "@tanstack/react-query";
import { useCallback } from "react";
import { toast } from "sonner";


export const useVerifyPayOnUsBank = () => {
  const { mutate, isPending, isSuccess, data } = useMutation({
    mutationFn: (data: VerifyPayOnUsBankPayload) => payOnUsApi.post("/api/v1/transfer-requests/name-enquiry", data),
    onSuccess: () => {
      // console.log("verification response", response);
      toast.success("Account verified successfully");
    },
    onError: (error: { response: { data: { message: string } } }) => {
      toast.error(error?.response?.data?.message ?? "Failed to verify bank");
    }
  })

  const handleVerifyPayOnUsBank = useCallback((data: VerifyPayOnUsBankPayload) => {
    mutate(data);
  }, [mutate]);

  // Extract account name from response
  const accountName = data?.data?.data?.accountName || "";
  // console.log("accountName", accountName);

  return { handleVerifyPayOnUsBank, isPending, isSuccess, accountName, data };

}