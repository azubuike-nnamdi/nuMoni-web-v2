import api from "@/lib/api";
import { SignUpFormData } from "@/lib/schemas/signup-schema";
import { GenerateOtpPayload } from "@/lib/types";
import { useSignUpStore } from "@/stores/signup-store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";


export const useGenerateOtp = () => {
  const queryClient = useQueryClient();
  const { updateFormData, setIsOtpSent, setOtpResendTimer, setShowOtpBanner, setCurrentOtpType } = useSignUpStore();

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: ({ payload }: { payload: GenerateOtpPayload; formData?: Partial<SignUpFormData>; shouldAdvanceStep?: boolean }) => {
      // Normalize otptype to uppercase before sending to API
      const normalizedPayload = {
        ...payload,
        otptype: payload.otptype.toUpperCase(),
      };
      return api.post("/auth/generateOtp", normalizedPayload);
    },
    onSuccess: ({ data }, variables) => {
      if (data) {
        toast.success(data.message ?? "OTP generated successfully");

        // Update store with form data if provided
        if (variables.formData) {
          updateFormData(variables.formData);
        }

        // Set OTP type based on payload (normalize to uppercase)
        const otpType = variables.payload.otptype.toUpperCase();
        setCurrentOtpType(otpType === 'EMAIL' ? 'EMAIL' : 'MOBILE');

        setIsOtpSent(true);
        setShowOtpBanner(true);
        setOtpResendTimer(30);

        // Only advance step if explicitly requested (for step 1 -> step 2 transition)
        if (variables.shouldAdvanceStep) {
          const { nextStep } = useSignUpStore.getState();
          nextStep();
        }
      }
    },
    onError: (error: { response: { data: { message: string } } }) => {
      // console.log("Failed to generate OTP", error);
      toast.error(error?.response?.data?.message ?? "Failed to generate OTP");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["otp"] });
    },
  });

  const handleGenerateOtp = (
    payload: GenerateOtpPayload,
    formData?: Partial<SignUpFormData>,
    shouldAdvanceStep?: boolean
  ) => {
    mutate({ payload, formData, shouldAdvanceStep });
  };

  return { handleGenerateOtp, isPending, isSuccess };
};