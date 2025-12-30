import api from "@/lib/api";
import { removeLeadingZero } from "@/lib/helper";
import { GenerateOtpPayload, ValidateOtpPayload } from "@/lib/types";
import { useSignUpStore } from "@/stores/signup-store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";


export const useValidateOtp = () => {
  const queryClient = useQueryClient();
  const {
    formData,
    updateFormData,
    nextStep,
    setIsOtpSent,
    setOtpResendTimer,
    setShowOtpBanner,
    setCurrentOtpType
  } = useSignUpStore();

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: ({ payload }: { payload: ValidateOtpPayload }) => {
      // Normalize otptype to uppercase before sending to API
      const normalizedPayload = {
        ...payload,
        otptype: payload.otptype,
      };
      return api.post("/auth/validateOtp", normalizedPayload);
    },
    onSuccess: ({ data }, variables) => {
      if (data) {
        // Normalize otptype to uppercase for consistent comparison
        const otpType = variables.payload.otptype;

        if (otpType === 'EMAIL') {
          // Email OTP validated successfully - now generate mobile OTP
          toast.success(data.message ?? "Email OTP verified successfully");

          // Update form data with OTP
          updateFormData({ otp: variables.payload.otp });

          // Generate mobile OTP immediately
          const phoneNumber = formData.phoneNumber || '';
          const mobileOtpPayload: GenerateOtpPayload = {
            username: removeLeadingZero(phoneNumber),
            usertype: "MERCHANT",
            otptype: "MOBILE",
          };

          // Show loading toast while generating mobile OTP
          const loadingToastId = toast.loading("Generating mobile OTP...");

          // Call generate OTP API for mobile
          api.post("/auth/generateOtp", mobileOtpPayload)
            .then((response) => {
              // Dismiss loading toast
              toast.dismiss(loadingToastId);

              if (response.data) {
                toast.success(response.data.message ?? "Mobile OTP sent successfully");
                setCurrentOtpType('MOBILE');
                setIsOtpSent(true);
                setShowOtpBanner(true);
                setOtpResendTimer(30);
                // Stay on step 2, just reset OTP field
                updateFormData({ otp: '' });
              }
            })
            .catch((error) => {
              // Dismiss loading toast
              toast.dismiss(loadingToastId);
              toast.error(error?.response?.data?.message ?? "Failed to send mobile OTP");
            });
        } else if (otpType === 'MOBILE') {
          // Mobile OTP validated successfully - move to step 3
          toast.success(data.message ?? "Mobile OTP verified successfully");

          // Update form data with OTP
          updateFormData({ otp: variables.payload.otp });

          // Move to step 3 (password setup)
          setCurrentOtpType(null);
          nextStep();
        }
      }
    },
    onError: (error: { response: { data: { message: string } } }) => {
      toast.error(error?.response?.data?.message ?? "Failed to validate OTP");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["otp"] });
    },
  });

  const handleValidateOtp = (payload: ValidateOtpPayload) => {
    mutate({ payload });
  };

  return { handleValidateOtp, isPending, isSuccess };
};