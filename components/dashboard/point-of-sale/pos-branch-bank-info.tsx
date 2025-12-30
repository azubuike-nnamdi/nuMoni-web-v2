'use client';

import { FormCombobox } from '@/components/ui/form-combobox';
import { FormInputTopLabel } from '@/components/ui/form-input';
import { LoadingModal } from '@/components/ui/loading-modal';
import { useVerifyBankName } from '@/hooks/mutation/useVerifyBankName';
import useGetBanks from '@/hooks/query/useGetBanks';
import { Bank } from '@/lib/types';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Control, FieldValues, Path, PathValue, UseFormSetValue, useWatch } from 'react-hook-form';

type BankInfoFields = {
  bankCode: string;
  bankAccountNumber: string;
  accountName: string;
};

interface PosBranchBankInfoProps<T extends FieldValues & BankInfoFields> {
  control: Control<T>;
  setValue: UseFormSetValue<T>;
}

export default function PosBranchBankInfo<T extends FieldValues & BankInfoFields>({ control, setValue }: PosBranchBankInfoProps<T>) {
  const { data: banks, isPending: isBanksPending } = useGetBanks();
  const { handleVerifyBankName, isPending: isVerifyingBankName, isSuccess: isVerifiedBankName, accountName: accountNameBankName } = useVerifyBankName();

  const [isAccountValid, setIsAccountValid] = useState<boolean>(false);
  const [hasAttemptedVerification, setHasAttemptedVerification] = useState<boolean>(false);
  const hasVerified = useRef<string>("");
  const verificationTimeout = useRef<NodeJS.Timeout | null>(null);

  // Transform banks data for combobox
  const bankOptions = useMemo(() => {
    const allBanks = Array.isArray(banks?.data)
      ? banks.data
      : banks?.data?.data;
    if (!allBanks || !Array.isArray(allBanks)) return [];
    return allBanks.map((bank: Bank) => ({
      value: bank.code,
      label: bank.name,
    }));
  }, [banks]);

  // Watch form values for bank verification
  const selectedBank = useWatch({ control, name: "bankCode" as Path<T> });
  const accountNumber = useWatch({ control, name: "bankAccountNumber" as Path<T> });

  // Verify account when both bank and account number are provided
  useEffect(() => {
    if (verificationTimeout.current) {
      clearTimeout(verificationTimeout.current);
    }

    if (selectedBank && accountNumber && accountNumber.length >= 10) {
      const verificationKey = `${selectedBank}-${accountNumber}`;
      if (hasVerified.current !== verificationKey && !isVerifyingBankName) {
        verificationTimeout.current = setTimeout(() => {
          const verifyPayload = {
            institutionCode: selectedBank,
            accountNumber: accountNumber,
          };
          hasVerified.current = verificationKey;
          setHasAttemptedVerification(true);
          handleVerifyBankName(verifyPayload);
        }, 500);
      }
    } else {
      setIsAccountValid(false);
      setHasAttemptedVerification(false);
      hasVerified.current = "";
    }

    return () => {
      if (verificationTimeout.current) {
        clearTimeout(verificationTimeout.current);
      }
    };
  }, [selectedBank, accountNumber, handleVerifyBankName, isVerifyingBankName]);

  // Handle verification success/failure
  useEffect(() => {
    if (isVerifiedBankName && accountNameBankName) {
      setIsAccountValid(true);
      setValue("accountName" as Path<T>, accountNameBankName as PathValue<T, Path<T>>);
    } else if (!isVerifyingBankName && hasAttemptedVerification && accountNumber && accountNumber.length >= 10) {
      // Only set to invalid if verification was attempted and failed
      setIsAccountValid(false);
      setValue("accountName" as Path<T>, "" as PathValue<T, Path<T>>);
    }
  }, [isVerifiedBankName, accountNameBankName, isVerifyingBankName, accountNumber, hasAttemptedVerification, setValue]);

  return (
    <>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Bank Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormCombobox
            control={control}
            name={"bankCode" as Path<T>}
            label="Select Bank"
            options={bankOptions}
            placeholder={isBanksPending ? "Loading banks..." : "Search and select a bank..."}
            searchPlaceholder="Search banks..."
            emptyMessage="No bank found."
            disabled={isBanksPending}
            required
          />

          <FormInputTopLabel
            control={control}
            name={"bankAccountNumber" as Path<T>}
            label="Account Information"
            placeholder="Enter account number"
            required
          />
        </div>

        {/* Account Verification Status */}
        {accountNumber && accountNumber.length >= 10 && !isVerifyingBankName && hasAttemptedVerification && (
          <div className="mt-4">
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

            {!isAccountValid && (
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
      </div>

      {/* Loading Modal for Bank Verification */}
      <LoadingModal
        isOpen={isVerifyingBankName}
        title="Verifying Account"
        message="We're verifying your bank account details. This may take a few seconds."
        description="Please do not close this window while verification is in progress."
      />
    </>
  );
}

