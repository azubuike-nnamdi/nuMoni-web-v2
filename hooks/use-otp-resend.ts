import { useGenerateOtp } from "@/hooks/mutation/useGenerateOtp";
import { formatPhoneWithPlus234 } from "@/lib/phone-utils";
import { useSignUpStore } from "@/stores/signup-store";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

export const useOtpResend = () => {
  const { formData, currentOtpType, setOtpResendTimer, setIsOtpSent, setShowOtpBanner } = useSignUpStore();
  const { handleGenerateOtp, isPending: isResendPending } = useGenerateOtp();
  const resendToastIdRef = useRef<string | number | null>(null);

  // Dismiss loading toast when resend operation completes
  useEffect(() => {
    if (!isResendPending && resendToastIdRef.current !== null) {
      toast.dismiss(resendToastIdRef.current);
      resendToastIdRef.current = null;
    }
  }, [isResendPending]);

  const handleResendOtp = (otpResendTimer: number) => {
    if (otpResendTimer > 0 || !currentOtpType) return;

    const isEmailOtp = currentOtpType === 'EMAIL';
    const email = formData.email || "";
    const phoneNumber = formData.phoneNumber || "";

    // Show loading toast
    const loadingToastId = toast.loading(
      isEmailOtp ? "Resending email OTP..." : "Resending mobile OTP..."
    );
    resendToastIdRef.current = loadingToastId;

    // Reset timer and show banner
    setOtpResendTimer(30);
    setIsOtpSent(true);
    setShowOtpBanner(true);

    // Generate OTP based on current type
    const payload = isEmailOtp
      ? {
          username: email,
          usertype: "MERCHANT",
          otptype: "EMAIL",
        }
      : {
          username: formatPhoneWithPlus234(phoneNumber),
          usertype: "MERCHANT",
          otptype: "MOBILE",
        };

    handleGenerateOtp(payload, undefined, false);
  };

  return { handleResendOtp, isResendPending };
};

