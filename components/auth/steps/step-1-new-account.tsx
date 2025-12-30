"use client";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FormPhoneInput } from "@/components/ui/form-phone-input";
import { Input } from "@/components/ui/input";
import { useGenerateOtp } from "@/hooks/mutation/useGenerateOtp";
import { normalizePhoneNumber } from "@/lib/helper";
import { SignUpFormData, step1Schema } from "@/lib/schemas/signup-schema";
import { ArrowRight } from "lucide-react";
import { Control, UseFormGetValues, UseFormSetError } from "react-hook-form";

interface Step1NewAccountProps {
  control: Control<SignUpFormData>;
  getValues: UseFormGetValues<SignUpFormData>;
  setError: UseFormSetError<SignUpFormData>;
}

export default function Step1NewAccount({
  control,
  getValues,
  setError,
}: Step1NewAccountProps) {
  const { handleGenerateOtp, isPending } = useGenerateOtp();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formValues = getValues();
    const rawPhoneNumber = formValues.phoneNumber || "";

    // Normalize phone number to store only last 10 digits (without country code or leading zero)
    const normalizedPhoneNumber = normalizePhoneNumber(rawPhoneNumber);

    const data = {
      fullName: formValues.fullName || "",
      email: formValues.email || "",
      phoneNumber: normalizedPhoneNumber,
    };

    // Validate step 1 fields
    const result = step1Schema.safeParse(data);
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

    // Generate email OTP - store will handle step transition on success
    handleGenerateOtp(
      {
        username: data.email,
        usertype: "MERCHANT",
        otptype: "EMAIL",
      },
      data,
      true // shouldAdvanceStep - move to step 2 after email OTP is sent
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-black mb-2">New Account</h2>
        <p className="text-gray-600 text-sm">
          Fill in the details to get started.
        </p>
      </div>

      <FormField
        control={control}
        name="fullName"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium text-gray-700">
              Your Full Name <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input
                type="text"
                placeholder="Enter your full name"
                className="w-full px-4 py-6 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium text-gray-700">
              Your Email Address <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input
                type="email"
                placeholder="Enter your email address"
                className="w-full px-4 py-6 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormPhoneInput
        control={control}
        name="phoneNumber"
        label="Your Phone Number"
        required
        placeholder="700000000"
      />

      <Button
        type="submit"
        disabled={isPending}
        className="w-full bg-theme-dark-green text-white py-6 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        isLoading={isPending}
        loadingText="Generating OTP..."
      >
        Verify Email Address
        <ArrowRight className="h-4 w-4" />
      </Button>
    </form>
  );
}

