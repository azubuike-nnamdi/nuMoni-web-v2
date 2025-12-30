import LoadingErrorState from "@/components/common/loading-error-state";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { FormInputTopLabel } from "@/components/ui/form-input";
import { CreatePosPayload, useCreatePos } from "@/hooks/mutation/useCreatePos";
import useGetBanks from "@/hooks/query/useGetBanks";
import useGetMerchant from "@/hooks/query/useGetMerchant";
import { Bank } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import PosBranchBankInfo from "./pos-branch-bank-info";

interface AddPOSDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const addPosSchema = z.object({
  posName: z.string().min(1, "POS name is required"),
  location: z.string().optional(),
  address: z.string().optional(),

  bankCode: z.string().min(1, "Bank is required"),
  bankAccountNumber: z
    .string()
    .min(10, "Account number must be at least 10 digits"),
  accountName: z.string().min(1, "Account name is required"),

  bankTransferCode: z.string().optional(),
});



type AddPosFormData = z.infer<typeof addPosSchema>;

export default function AddPOSDialog({ isOpen, onClose }: AddPOSDialogProps) {
  const { isPending, data } = useGetMerchant();
  const { data: banksData } = useGetBanks();
  const { handleCreatePos, isPending: isCreatingPos, isSuccess } = useCreatePos();

  // Extract merchant information
  const merchantData = useMemo(() => {
    const merchant = data?.data?.data;
    if (!merchant) return null;

    return {
      merchantId: merchant.merchantId || merchant.userId,
      merchantName: merchant.businessName || merchant.brandName,
      merchantLogo: merchant.businessImagePath,
    };
  }, [data]);

  // Get banks list for bank name lookup
  const banks = useMemo(() => {
    const allBanks = Array.isArray(banksData?.data)
      ? banksData.data
      : banksData?.data?.data;
    return allBanks || [];
  }, [banksData]);

  const form = useForm<AddPosFormData>({
    resolver: zodResolver(addPosSchema),
    defaultValues: {
      posName: "",
      location: "",
      address: "",
      bankCode: "",
      bankAccountNumber: "",
      accountName: "",
      bankTransferCode: "",
    },
  });

  const handleClose = useCallback(() => {
    form.reset();
    onClose();
  }, [form, onClose]);

  const handleSubmit = async (formData: AddPosFormData) => {
    if (!merchantData) return;

    // Find bank name from bank code
    const selectedBank = banks.find((bank: Bank) => bank.code === formData.bankCode);
    const bankName = selectedBank?.name || "";

    if (!bankName) {
      toast.error(`Bank name not found for bank code: ${formData.bankCode}`);
      return;
    }

    const payload: CreatePosPayload = {
      posName: formData.posName,
      merchantId: merchantData.merchantId,
      bankName: bankName,
      accountNo: formData.bankAccountNumber,
      accountHolderName: formData.accountName,
      bankCode: formData.bankCode,
      bankTransferCode: formData.bankTransferCode || formData.bankCode,
      location: formData.location,
      address: formData.address,
    };

    handleCreatePos(payload);
  };

  useEffect(() => {
    if (isSuccess) {
      handleClose();
    }
  }, [isSuccess, handleClose]);


  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle>Add Point of Sale</DialogTitle>
        </DialogHeader>

        <LoadingErrorState
          isLoading={isPending}
          hasError={!merchantData}
          loadingMessage="Loading merchant information..."
          errorMessage="Unable to load merchant information"
        >
          <>
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleSubmit)}
                  className="space-y-8"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* POS INFO */}
                    <FormInputTopLabel
                      control={form.control}
                      name="posName"
                      label="POS Name"
                      placeholder="e.g. Ota POS 1"
                      required
                    />

                    <FormInputTopLabel
                      control={form.control}
                      name="location"
                      label="Location"
                      placeholder="e.g. Ota"
                    />
                  </div>

                  <FormInputTopLabel
                    control={form.control}
                    name="address"
                    label="Address"
                    placeholder="Street address"
                  />

                  {/* 🔥 REUSABLE BANK COMPONENT */}
                  <PosBranchBankInfo
                    control={form.control}
                    setValue={form.setValue}
                  />
                </form>
              </Form>
            </div>

            <div className="px-6 py-4 border-t flex justify-end gap-4">
              <Button variant="outline" onClick={handleClose} disabled={isCreatingPos}>
                Cancel
              </Button>

              <Button
                onClick={form.handleSubmit(handleSubmit)}
                disabled={isCreatingPos}
                className="bg-theme-dark-green text-white disabled:opacity-50 disabled:cursor-not-allowed"
                isLoading={isCreatingPos}
                loadingText="Adding POS..."
              >
                Add POS
              </Button>
            </div>
          </>
        </LoadingErrorState>
      </DialogContent>
    </Dialog>
  );
}
