"use client";

import { Form } from "@/components/ui/form";
import { numoniLogoDark } from "@/constant/icons";
import { SIGN_IN_URL } from "@/constant/routes";
import { SignUpFormData, signUpSchema } from "@/lib/schemas/signup-schema";
import { useSignUpStore } from "@/stores/signup-store";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import ProgressIndicator from "./progress-indicator";
import Step1NewAccount from "./steps/step-1-new-account";
import Step2OTPVerification from "./steps/step-2-otp-verification";
import Step3SetPassword from "./steps/step-3-set-password";
import WelcomeModal from "./welcome-modal";

export default function SignUpForm() {
  const {
    currentStep,
    formData,
    showWelcomeModal,
    showOtpBanner,
    otpResendTimer,
    setOtp,
    setShowWelcomeModal,
    setShowOtpBanner,
    setOtpResendTimer,
  } = useSignUpStore();

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    mode: "onChange",
    defaultValues: {
      fullName: formData.fullName || "",
      email: formData.email || "",
      phoneNumber: formData.phoneNumber || "",
      otp: formData.otp || "",
      password: formData.password || "",
      confirmPassword: formData.confirmPassword || "",
    },
  });

  // Sync form with store
  useEffect(() => {
    form.reset({
      fullName: formData.fullName || "",
      email: formData.email || "",
      phoneNumber: formData.phoneNumber || "",
      otp: formData.otp || "",
      password: formData.password || "",
      confirmPassword: formData.confirmPassword || "",
    });
  }, [formData, form]);

  // OTP Resend Timer
  useEffect(() => {
    if (otpResendTimer > 0) {
      const timer = setTimeout(() => {
        setOtpResendTimer(otpResendTimer - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [otpResendTimer, setOtpResendTimer]);

  return (
    <>
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-8">
        {/* Header */}
        <div className="w-full max-w-md mb-6">
          <div className="flex items-center justify-between mb-6">
            <Image
              src={numoniLogoDark}
              alt="nuMoni Logo"
              width={100}
              height={40}
              className="h-8 w-auto"
            />
            <ProgressIndicator currentStep={currentStep} />
          </div>
        </div>

        {/* Main Form Container */}
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border-l-4 border-t-4 border-green-200 p-6 sm:p-8">
          <Form {...form}>
            {currentStep === 1 && (
              <Step1NewAccount
                control={form.control}
                getValues={form.getValues}
                setError={form.setError}
              />
            )}

            {currentStep === 2 && (
              <Step2OTPVerification
                control={form.control}
                setError={form.setError}
                otp={formData.otp || ""}
                onOtpChange={setOtp}
                otpResendTimer={otpResendTimer}
                showOtpBanner={showOtpBanner}
                onDismissBanner={() => setShowOtpBanner(false)}
              />
            )}

            {currentStep === 3 && (
              <Step3SetPassword
                control={form.control}
                getValues={form.getValues}
                setError={form.setError}
                formData={formData}
              />
            )}
          </Form>

          {/* Footer Link */}
          {currentStep === 1 && (
            <div className="flex items-center justify-center mt-6">
              <span className="text-sm text-gray-500">
                Already have an account?{" "}
                <Link
                  href={SIGN_IN_URL}
                  className="text-theme-dark-green hover:underline font-medium"
                >
                  Sign In
                </Link>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Welcome Modal */}
      <WelcomeModal
        open={showWelcomeModal}
        onOpenChange={setShowWelcomeModal}
      />
    </>
  );
}
