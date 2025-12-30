import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface OtpSubmitButtonProps {
  otpLength: number;
  isPending: boolean;
  isEmailOtp: boolean;
  isMobileOtp: boolean;
}

export const OtpSubmitButton = ({
  otpLength,
  isPending,
  isEmailOtp,
  isMobileOtp,
}: OtpSubmitButtonProps) => {
  const isDisabled = otpLength !== 6 || isPending;
  const buttonClass = isDisabled
    ? "bg-gray-400 text-black cursor-not-allowed"
    : "bg-theme-dark-green text-white cursor-pointer";

  return (
    <Button
      type="submit"
      disabled={isDisabled}
      className={`w-full py-6 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${buttonClass}`}
      isLoading={isPending}
      loadingText={isEmailOtp ? "Verifying Email OTP..." : "Verifying Mobile OTP..."}
    >
      {isMobileOtp ? "Confirm & Set Password" : "Verify OTP"}
      <ArrowRight className="h-4 w-4" />
    </Button>
  );
};

