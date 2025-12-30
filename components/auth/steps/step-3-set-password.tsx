"use client";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useSignIn } from "@/hooks/mutation/useSignIn";
import { useSignUp } from "@/hooks/mutation/useSignUp";
import { generateUUID } from "@/lib/helper";
import { SignUpFormData, step3Schema } from "@/lib/schemas/signup-schema";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { Control, UseFormGetValues, UseFormSetError } from "react-hook-form";

interface Step3SetPasswordProps {
  control: Control<SignUpFormData>;
  getValues: UseFormGetValues<SignUpFormData>;
  setError: UseFormSetError<SignUpFormData>;
  formData: Partial<SignUpFormData>;
}

export default function Step3SetPassword({
  control,
  getValues,
  setError,
  formData,
}: Step3SetPasswordProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { handleSignUp, isPending: isSignUpPending, isSuccess: isSignUpSuccess } = useSignUp();
  const { handleSignIn, isPending: isSignInPending } = useSignIn();

  // Auto sign in after successful sign up
  useEffect(() => {
    if (isSignUpSuccess && formData.email && formData.password) {
      handleSignIn({
        username: formData.email,
        password: formData.password,
        usertype: "MERCHANT",
        deviceId: generateUUID(),
      });
    }
  }, [isSignUpSuccess, formData.email, formData.password, handleSignIn]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formValues = getValues();
    const data = {
      password: formValues.password || "",
      confirmPassword: formValues.confirmPassword || "",
    };

    // Validate step 3 fields
    const result = step3Schema.safeParse(data);
    if (!result.success) {
      result.error.issues.forEach((issue) => {
        const fieldName = issue.path[0] as keyof SignUpFormData;
        setError(fieldName, {
          type: "manual",
          message: issue.message,
        });
      });
      return;
    }

    // Combine all form data for final submission
    const completeData: SignUpFormData = {
      fullName: formData.fullName || "",
      email: formData.email || "",
      phoneNumber: formData.phoneNumber || "",
      otp: formData.otp || "",
      password: data.password,
      confirmPassword: data.confirmPassword,
    };

    // Call sign up
    handleSignUp(completeData);
  };

  const isPending = isSignUpPending || isSignInPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-black mb-2">Set Password</h2>
        <p className="text-gray-600 text-sm">
          Set your password for enhanced security.
        </p>
      </div>

      <FormField
        control={control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium text-gray-700">
              Create Password <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="********"
                  className="w-full px-4 py-6 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  {...field}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="confirmPassword"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium text-gray-700">
              Confirm Password <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="********"
                  className="w-full px-4 py-6 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  {...field}
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <Button
        type="submit"
        disabled={isPending}
        className="w-full bg-theme-dark-green text-white py-6 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        isLoading={isPending}
        loadingText={isSignUpPending ? "Creating account..." : "Signing in..."}
      >
        Continue To Business Setup
        <ArrowRight className="h-4 w-4" />
      </Button>
    </form>
  );
}

