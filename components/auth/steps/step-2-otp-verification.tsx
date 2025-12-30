"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useValidateOtp } from "@/hooks/mutation/useValidateOtp";
import { useOtpResend } from "@/hooks/use-otp-resend";
import { validateOtpInput } from "@/lib/helper";
import { createOtpValidationPayload, getContactInfo } from "@/lib/otp-utils";
import { SignUpFormData, step2Schema } from "@/lib/schemas/signup-schema";
import { useSignUpStore } from "@/stores/signup-store";
import { Control, UseFormSetError } from "react-hook-form";
import OTPInput from "../otp-input";
import { OtpBanner } from "./otp-banner";
import { OtpHeader } from "./otp-header";
import { OtpResend } from "./otp-resend";
import { OtpSubmitButton } from "./otp-submit-button";

interface Step2OTPVerificationProps {
  control: Control<SignUpFormData>;
  setError: UseFormSetError<SignUpFormData>;
  otp: string;
  onOtpChange: (otp: string) => void;
  otpResendTimer: number;
  showOtpBanner: boolean;
  onDismissBanner: () => void;
}

export default function Step2OTPVerification({
  control,
  setError,
  otp,
  onOtpChange,
  otpResendTimer,
  showOtpBanner,
  onDismissBanner,

}: Step2OTPVerificationProps) {
  const { formData, currentOtpType } = useSignUpStore();
  const { handleValidateOtp, isPending } = useValidateOtp();
  const { handleResendOtp, isResendPending } = useOtpResend();

  const email = formData.email || "";
  const phoneNumber = formData.phoneNumber || "";

  const { contactInfo, contactLabel, isEmailOtp, isMobileOtp } = getContactInfo(
    currentOtpType,
    email,
    phoneNumber
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateOtpInput(otp, setError, step2Schema)) return;

    const payload = createOtpValidationPayload(otp, currentOtpType, email, phoneNumber);
    handleValidateOtp(payload);
  };

  const handleResend = () => handleResendOtp(otpResendTimer);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {showOtpBanner && <OtpBanner contactInfo={contactInfo} onDismiss={onDismissBanner} />}

      <OtpHeader contactLabel={contactLabel} contactInfo={contactInfo} />

      <FormField
        control={control}
        name="otp"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <OTPInput
                value={field.value}
                onChange={(value) => {
                  field.onChange(value);
                  onOtpChange(value);
                }}
              />
            </FormControl>
            <FormMessage className="text-center" />
          </FormItem>
        )}
      />

      <OtpResend
        otpResendTimer={otpResendTimer}
        isResendPending={isResendPending}
        onResend={handleResend}
      />

      <OtpSubmitButton
        otpLength={otp?.length || 0}
        isPending={isPending}
        isEmailOtp={isEmailOtp}
        isMobileOtp={isMobileOtp}
      />
    </form>
  );
}

