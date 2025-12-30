/**
 * UpdatePOSDialog Component
 * 
 * A dialog component for editing POS (Point of Sale) information including:
 * - POS details (name, location, address)
 * - Bank information (bank selection, account number, account holder name)
 * - Real-time bank account verification when account number is edited
 * 
 * Features:
 * - Pre-populates form with existing POS data
 * - Validates bank account via API when user edits account number
 * - Auto-fills account holder name on successful verification
 * - Shows verification status (success/failure) to user
 * - Prevents verification on initial mount/page load
 */

'use client';

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { LoadingModal } from "@/components/ui/loading-modal";
import { UpdatePosPayload, useUpdatePos } from "@/hooks/mutation/useUpdatePos";
import { useVerifyBankName } from "@/hooks/mutation/useVerifyBankName";
import useGetBanks from "@/hooks/query/useGetBanks";
import { Bank, PointOfSaleData } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { BankFormFields } from "./bank-form-fields";
import BankVerificationStatus from "./bank-verification-status";
import { POSFormFields } from "./pos-form-fields";

// ============================================================================
// FORM VALIDATION SCHEMA
// ============================================================================

const updatePosSchema = z.object({
  posName: z.string().min(1, "POS name is required"),
  location: z.string().optional(),
  address: z.string().optional(),
  bankCode: z.string().min(1, "Bank is required"),
  bankAccountNumber: z.string().min(10, "Account number must be at least 10 digits"),
  accountName: z.string().min(1, "Account name is required"),
  bankTransferCode: z.string().optional(),
});

type UpdatePosFormData = z.infer<typeof updatePosSchema>;

// ============================================================================
// COMPONENT PROPS INTERFACE
// ============================================================================

interface UpdatePOSDialogProps {
  isOpen: boolean;
  onClose: () => void;
  pos: PointOfSaleData;
}

export default function UpdatePOSDialog({
  isOpen,
  onClose,
  pos,
}: UpdatePOSDialogProps) {
  // ============================================================================
  // HOOKS & API CALLS
  // ============================================================================

  const { handleUpdatePos, isPending, isSuccess } = useUpdatePos();
  const { data: banks, isPending: isBanksPending } = useGetBanks();
  const {
    handleVerifyBankName,
    isPending: isVerifyingBankName,
    isSuccess: isVerifiedBankName,
    accountName: accountNameBankName
  } = useVerifyBankName();

  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  const [isAccountValid, setIsAccountValid] = useState<boolean>(false);
  const [hasAttemptedVerification, setHasAttemptedVerification] = useState<boolean>(false);

  // ============================================================================
  // REFS FOR TRACKING STATE
  // ============================================================================

  const hasVerified = useRef<string>("");
  const verificationTimeout = useRef<NodeJS.Timeout | null>(null);
  const initialBankCode = useRef<string>("");
  const initialAccountNo = useRef<string>("");
  const isInitializing = useRef<boolean>(true);
  const accountNumberFieldTouched = useRef<boolean>(false);

  // ============================================================================
  // DATA TRANSFORMATION
  // ============================================================================

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

  // ============================================================================
  // FORM SETUP
  // ============================================================================

  const form = useForm<UpdatePosFormData>({
    resolver: zodResolver(updatePosSchema),
    defaultValues: {
      posName: pos.posName || "",
      location: pos.location || "",
      address: pos.address || "",
      bankCode: pos.bankCode || "",
      bankAccountNumber: pos.accountNo || "",
      accountName: pos.accountHolderName || "",
      bankTransferCode: pos.bankTransferCode || "",
    },
  });

  const { control, setValue } = form;

  const selectedBank = useWatch({ control, name: "bankCode" });
  const accountNumber = useWatch({ control, name: "bankAccountNumber" });

  // ============================================================================
  // EFFECT: FORM INITIALIZATION
  // ============================================================================

  useEffect(() => {
    if (pos && isOpen) {
      const initialBank = pos.bankCode || "";
      const initialAccount = pos.accountNo || "";

      initialBankCode.current = initialBank;
      initialAccountNo.current = initialAccount;

      isInitializing.current = true;
      accountNumberFieldTouched.current = false;

      form.reset({
        posName: pos.posName || "",
        location: pos.location || "",
        address: pos.address || "",
        bankCode: initialBank,
        bankAccountNumber: initialAccount,
        accountName: pos.accountHolderName || "",
        bankTransferCode: pos.bankTransferCode || "",
      });

      setIsAccountValid(false);
      setHasAttemptedVerification(false);
      hasVerified.current = "";

      setTimeout(() => {
        isInitializing.current = false;
      }, 100);
    }
  }, [pos, isOpen, form]);

  // ============================================================================
  // EFFECT: BANK ACCOUNT VERIFICATION
  // ============================================================================

  useEffect(() => {
    if (isInitializing.current || !accountNumberFieldTouched.current) {
      return;
    }

    if (verificationTimeout.current) {
      clearTimeout(verificationTimeout.current);
    }

    const accountNumberChanged = accountNumber !== initialAccountNo.current;

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
  }, [selectedBank, accountNumber, handleVerifyBankName, isVerifyingBankName]);

  // ============================================================================
  // EFFECT: HANDLE VERIFICATION RESPONSE
  // ============================================================================

  useEffect(() => {
    if (isVerifiedBankName && accountNameBankName) {
      setIsAccountValid(true);
      setValue("accountName", accountNameBankName);
    } else if (!isVerifyingBankName && hasAttemptedVerification && accountNumber && accountNumber.length >= 10) {
      setIsAccountValid(false);
      if (!accountNameBankName) {
        const currentAccountName = form.getValues("accountName");
        if (currentAccountName === accountNameBankName || !currentAccountName) {
          setValue("accountName", "");
        }
      }
    }
  }, [isVerifiedBankName, accountNameBankName, isVerifyingBankName, accountNumber, hasAttemptedVerification, setValue, form]);

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handleSubmit = useCallback(
    (data: UpdatePosFormData) => {
      const selectedBankOption = bankOptions.find(
        (bank) => bank.value === data.bankCode
      );
      const bankName = selectedBankOption?.label || pos.bankName || "";

      if (!bankName) {
        console.error("Bank name not found for bank code:", data.bankCode);
        return;
      }

      const updatePayload: UpdatePosPayload = {
        id: pos.id,
        posId: pos.posId,
        posName: data.posName,
        merchantId: pos.merchantId,
        branchId: pos.branchId || "",
        bankName: bankName,
        accountNo: data.bankAccountNumber,
        accountHolderName: data.accountName,
        bankCode: data.bankCode,
        bankTransferCode: data.bankTransferCode || data.bankCode,
        location: data.location,
        address: data.address,
      };

      handleUpdatePos(updatePayload);
    },
    [pos, bankOptions, handleUpdatePos]
  );

  const handleClose = useCallback(() => {
    form.reset();
    onClose();
  }, [form, onClose]);

  // ============================================================================
  // EFFECT: AUTO-CLOSE ON SUCCESS
  // ============================================================================

  useEffect(() => {
    if (isSuccess) {
      handleClose();
    }
  }, [isSuccess, handleClose]);

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && !isPending) {
          handleClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-200 shrink-0">
          <DialogTitle>Edit POS Information</DialogTitle>
          <DialogDescription>
            Update the POS details and bank information
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              {/* POS Information Section */}
              <POSFormFields
                control={form.control}
                posNameField="posName"
                locationField="location"
                addressField="address"
              />

              {/* Bank Information Section */}
              <div>
                <BankFormFields
                  control={form.control}
                  bankCodeField="bankCode"
                  accountNumberField="bankAccountNumber"
                  accountNameField="accountName"
                  bankTransferCodeField="bankTransferCode"
                  bankOptions={bankOptions}
                  isBanksPending={isBanksPending}
                  onAccountNumberChange={() => {
                    accountNumberFieldTouched.current = true;
                  }}
                />

                {/* Account Verification Status */}
                <BankVerificationStatus
                  isAccountValid={isAccountValid}
                  accountName={accountNameBankName}
                  accountNumber={accountNumber}
                  isVerifying={isVerifyingBankName}
                  hasAttemptedVerification={hasAttemptedVerification}
                />
              </div>
            </form>
          </Form>
        </div>

        <LoadingModal
          isOpen={isVerifyingBankName}
          title="Verifying Account"
          message="We're verifying your bank account details. This may take a few seconds."
          description="Please do not close this window while verification is in progress."
        />

        <div className="px-6 py-4 border-t border-gray-200 shrink-0">
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isPending}
              className="border-gray-300 text-gray-700 hover:bg-gray-50 px-12 py-6 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              onClick={form.handleSubmit(handleSubmit)}
              isLoading={isPending}
              loadingText="Updating..."
              className="bg-theme-dark-green hover:bg-theme-dark-green/90 text-white px-12 py-6 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Update POS
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

