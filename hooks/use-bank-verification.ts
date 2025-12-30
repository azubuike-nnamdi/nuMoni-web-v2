/**
 * useBankVerification Hook
 * 
 * Custom hook for handling bank account verification logic
 * Prevents verification on initial load and only verifies when user edits account number
 */

import { useVerifyBankName } from "@/hooks/mutation/useVerifyBankName";
import { useEffect, useRef, useState } from "react";
import { UseFormSetValue, useWatch, Control, Path, PathValue } from "react-hook-form";
import { FieldValues } from "react-hook-form";

interface UseBankVerificationProps<T extends FieldValues> {
  control: Control<T>;
  setValue: UseFormSetValue<T>;
  bankCodeField: Path<T>;
  accountNumberField: Path<T>;
  accountNameField: Path<T>;
  initialBankCode: string;
  initialAccountNumber: string;
  isInitializing: boolean;
}

export function useBankVerification<T extends FieldValues>({
  control,
  setValue,
  bankCodeField,
  accountNumberField,
  accountNameField,
  initialBankCode,
  initialAccountNumber,
  isInitializing,
}: UseBankVerificationProps<T>) {
  const {
    handleVerifyBankName,
    isPending: isVerifyingBankName,
    isSuccess: isVerifiedBankName,
    accountName: accountNameBankName,
  } = useVerifyBankName();

  const [isAccountValid, setIsAccountValid] = useState<boolean>(false);
  const [hasAttemptedVerification, setHasAttemptedVerification] = useState<boolean>(false);

  const hasVerified = useRef<string>("");
  const verificationTimeout = useRef<NodeJS.Timeout | null>(null);
  const accountNumberFieldTouched = useRef<boolean>(false);

  const selectedBank = useWatch({ control, name: bankCodeField });
  const accountNumber = useWatch({ control, name: accountNumberField });

  // Reset verification state when dialog opens
  useEffect(() => {
    setIsAccountValid(false);
    setHasAttemptedVerification(false);
    hasVerified.current = "";
    accountNumberFieldTouched.current = false;
  }, [initialBankCode, initialAccountNumber]);

  // Bank account verification effect
  useEffect(() => {
    if (isInitializing || !accountNumberFieldTouched.current) {
      return;
    }

    if (verificationTimeout.current) {
      clearTimeout(verificationTimeout.current);
    }

    const accountNumberChanged = accountNumber !== initialAccountNumber;

    if (selectedBank && accountNumber && accountNumber.length >= 10 && accountNumberChanged) {
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
    } else if (!accountNumberChanged) {
      setIsAccountValid(false);
      setHasAttemptedVerification(false);
      hasVerified.current = "";
    } else if (!selectedBank || !accountNumber || accountNumber.length < 10) {
      setIsAccountValid(false);
      setHasAttemptedVerification(false);
      hasVerified.current = "";
    }

    return () => {
      if (verificationTimeout.current) {
        clearTimeout(verificationTimeout.current);
      }
    };
  }, [
    selectedBank,
    accountNumber,
    handleVerifyBankName,
    isVerifyingBankName,
    initialAccountNumber,
    isInitializing,
  ]);

  // Handle verification response
  useEffect(() => {
    if (isVerifiedBankName && accountNameBankName) {
      setIsAccountValid(true);
      setValue(accountNameField, accountNameBankName as PathValue<T, Path<T>>);
    } else if (
      !isVerifyingBankName &&
      hasAttemptedVerification &&
      accountNumber &&
      accountNumber.length >= 10
    ) {
      setIsAccountValid(false);
      if (!accountNameBankName) {
        const currentAccountName = control._formValues[accountNameField as string];
        if (!currentAccountName) {
          setValue(accountNameField, "" as PathValue<T, Path<T>>);
        }
      }
    }
  }, [
    isVerifiedBankName,
    accountNameBankName,
    isVerifyingBankName,
    accountNumber,
    hasAttemptedVerification,
    setValue,
    accountNameField,
    control,
  ]);

  return {
    isAccountValid,
    hasAttemptedVerification,
    isVerifyingBankName,
    accountNameBankName,
    accountNumber,
    markAccountNumberTouched: () => {
      accountNumberFieldTouched.current = true;
    },
  };
}

