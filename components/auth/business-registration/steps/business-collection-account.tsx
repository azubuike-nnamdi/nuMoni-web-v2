"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { FormCombobox } from "@/components/ui/form-combobox";
import { FormInputTopLabel } from "@/components/ui/form-input";
import { useSaveBusinessCollectionAccount } from "@/hooks/mutation/useSaveBusinessCollectionAccount";
import { useVerifyBankName } from "@/hooks/mutation/useVerifyBankName";
import useGetBanks from "@/hooks/query/useGetBanks";
import { BusinessCollectionAccountFormData, businessCollectionAccountSchema } from "@/lib/schemas/business-registration-schema";
import { Bank } from "@/lib/types";
import { useBusinessRegistrationStore } from "@/stores/business-registration-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

export default function BusinessCollectionAccount() {
  const {
    nextStep,
  } = useBusinessRegistrationStore();

  const { data: banks, isPending: isBanksPending } = useGetBanks();
  const { handleVerifyBankName, isPending: isVerifyingBankName, isSuccess: isVerifiedBankName, accountName: accountNameBankName } = useVerifyBankName();
  const { handleSaveBusinessCollectionAccount, isPending: isSaving, isSuccess } = useSaveBusinessCollectionAccount();

  // State for account verification
  const [isAccountValid, setIsAccountValid] = useState<boolean>(false);
  const hasVerifiedPayOnUs = useRef<string>(""); // Track what we've already verified
  const verificationTimeoutPayOnUs = useRef<NodeJS.Timeout | null>(null);

  // Initialize form with React Hook Form and Zod
  const form = useForm<BusinessCollectionAccountFormData>({
    resolver: zodResolver(businessCollectionAccountSchema),
    mode: "onSubmit",
    defaultValues: {
      bank: '',
      accountNumber: '',
      bankAccountName: '',
      minPayment: 0,
    },
  });

  // Transform bank data to options format
  const bankOptions = React.useMemo(() => {
    const allBanks = Array.isArray(banks?.data)
      ? banks.data
      : banks?.data?.data;

    if (!allBanks || !Array.isArray(allBanks)) {
      return [];
    }

    return allBanks.map((bank: Bank) => ({
      value: bank.code,
      label: bank.name
    }));
  }, [banks]);

  // Watch form values
  const selectedBank = form.watch('bank');
  const accountNumber = form.watch('accountNumber');
  const businessName = 'Your Business Name'; // Can be fetched from API if needed

  // Check if verification has been attempted for current account
  const verificationKey = selectedBank && accountNumber && accountNumber.length >= 10
    ? `${selectedBank}-${accountNumber}`
    : '';
  const hasAttemptedVerification = hasVerifiedPayOnUs.current === verificationKey && verificationKey !== '';

  // Verify account when both bank and account number are provided
  useEffect(() => {
    // Clear any existing timeout
    if (verificationTimeoutPayOnUs.current) {
      clearTimeout(verificationTimeoutPayOnUs.current);
    }

    if (selectedBank && accountNumber && accountNumber.length >= 10) {
      const verificationKey = `${selectedBank}-${accountNumber}`;
      if (hasVerifiedPayOnUs.current !== verificationKey && !isVerifyingBankName) {
        verificationTimeoutPayOnUs.current = setTimeout(() => {
          const verifyPayload = {
            institutionCode: selectedBank,
            accountNumber: accountNumber,
          };
          hasVerifiedPayOnUs.current = verificationKey;
          handleVerifyBankName(verifyPayload);
        }, 500); // 500ms delay
      }
    } else {
      // Reset verification state when requirements aren't met
      setIsAccountValid(false);
      hasVerifiedPayOnUs.current = "";
    }

    // Cleanup timeout on unmount
    return () => {
      if (verificationTimeoutPayOnUs.current) {
        clearTimeout(verificationTimeoutPayOnUs.current);
      }
    };
  }, [selectedBank, accountNumber, handleVerifyBankName, isVerifyingBankName]);

  // Handle verification success
  useEffect(() => {
    if (isVerifiedBankName && accountNameBankName) {
      setIsAccountValid(true);
      // Save the verified account name to the form
      form.setValue("bankAccountName", accountNameBankName);
    } else if (!isVerifyingBankName && accountNumber && accountNumber.length >= 10) {
      setIsAccountValid(false);
      // Clear the account name if verification fails
      form.setValue("bankAccountName", "");
    }
  }, [isVerifiedBankName, accountNameBankName, isVerifyingBankName, accountNumber, form]);

  // Advance to next step on successful API call
  useEffect(() => {
    if (isSuccess) {
      nextStep();
    }
  }, [isSuccess, nextStep]);

  const onSubmit = async (data: BusinessCollectionAccountFormData) => {
    // Get banks data for bank name lookup
    const allBanks = Array.isArray(banks?.data)
      ? banks.data
      : banks?.data?.data;

    // Save to API
    await handleSaveBusinessCollectionAccount(data, allBanks);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full max-h-[600px] w-full">
        <div className="shrink-0 mb-6">
          <h2 className="text-2xl font-bold text-black mb-2">Collection Account</h2>
          <p className="text-gray-600 text-sm">
            When customers pay into your nuMoni account, the cash value is auto-transferred to your collection account.
          </p>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 space-y-6">
          <FormCombobox
            control={form.control}
            name="bank"
            disabled={isBanksPending}
            label="Bank"
            options={bankOptions}
            placeholder={isBanksPending ? "Loading banks..." : "Choose From Options"}
            searchPlaceholder="Search banks..."
            emptyMessage="No bank found."
            required
          />

          <FormInputTopLabel
            control={form.control}
            name="accountNumber"
            label="Account Number"
            placeholder="Enter Your 12 Digits Bank Account Number"
            required
          />

          {/* Account Verification Status */}
          {accountNumber && accountNumber.length >= 10 && (
            <div className="space-y-2">
              {isVerifyingBankName && (
                <div className="flex items-center space-x-2 text-theme-green">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-theme-green"></div>
                  <span className="text-sm">Verifying account...</span>
                </div>
              )}

              {isAccountValid && accountNameBankName && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-green-800">Account Verified</span>
                  </div>
                  <p className="text-sm text-green-700 mt-1">
                    Account Name: <span className="font-semibold">{accountNameBankName}</span>
                  </p>
                </div>
              )}

              {hasAttemptedVerification && !isVerifyingBankName && !isAccountValid && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm font-medium text-red-800">Account Verification Failed</span>
                  </div>
                  <p className="text-sm text-red-700 mt-1">
                    Please check your account number and try again.
                  </p>
                </div>
              )}
            </div>
          )}

          <FormField
            control={form.control}
            name="minPayment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minimum Payment Amount <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700 font-medium">₦</span>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="0.0"
                      className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-theme-green focus:border-transparent text-sm"
                      value={field.value === 0 ? '' : field.value}
                      onChange={(e) => {
                        const value = e.target.value === '' ? 0 : parseFloat(e.target.value) || 0;
                        field.onChange(value);
                      }}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-800">
              Your Collection Account Name Must Match Your Business Name &quot;{businessName}&quot;.
            </p>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="shrink-0 flex items-center justify-between gap-4 mt-6 pt-6 border-t border-gray-200">
          <Button
            type="submit"
            disabled={isSaving || !isAccountValid || isVerifyingBankName}
            className="flex-1 bg-theme-dark-green text-white py-6 rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            isLoading={isSaving}
            loadingText="Saving..."
          >
            Confirm And Complete Registration
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </form>
    </Form>
  );
}

