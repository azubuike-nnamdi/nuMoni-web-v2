"use client"

import { useGeneratePayOnUsToken } from "@/hooks/mutation/useGeneratePayOnUsToken";
import useGetMerchant from "@/hooks/query/useGetMerchant";
import { useBranchFormHandlers } from "@/hooks/use-branch-form-handlers";
import { cleanPhoneNumber } from "@/lib/helper";
import { BranchFormData, branchFormSchema } from "@/lib/schemas/branch-schema";
import { getStepDescription } from "@/lib/step-utils";
import { useBranchStore } from "@/stores/branch-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent } from "../ui/dialog";
import { Form } from "../ui/form";
import BranchFormFooter from "./branch-form-footer";
import BranchFormHeader from "./branch-form-header";
import BranchStepContent from "./branch-step-content";

export default function AddBranch() {
  const { currentStep, formData, isOpen, closeDialog, resetForm } = useBranchStore();

  const { data: merchant } = useGetMerchant();
  const merchantInfo = merchant?.data?.data;

  // const { handleGenerateBankToken } = useGenerateBankToken();
  const { handleGeneratePayOnUsToken } = useGeneratePayOnUsToken();
  // const hasGeneratedToken = useRef(false);
  const hasGeneratedPayOnUsToken = useRef(false);
  const [isAccountVerified, setIsAccountVerified] = useState<boolean>(false);

  const form = useForm<BranchFormData>({
    resolver: zodResolver(branchFormSchema),
    defaultValues: {
      logo: formData.logo || undefined,
      branchName: formData.branchName || '',
      branchRegion: formData.branchRegion || '',
      branchState: formData.branchState || '',
      lga: formData.lga || '',
      openingTime: formData.openingTime || '',
      closingTime: formData.closingTime || '',
      description: formData.description || merchantInfo?.description || '',
      phone: formData.phone || cleanPhoneNumber(merchantInfo?.businessPhoneNo || ''),
      email: formData.email || merchantInfo?.businessEmail || '',
      businessPhoto: formData.businessPhoto || undefined,
      businessPhotos: formData.businessPhotos || undefined,
      address: formData.address || '',
      city: formData.city || '',
      state: formData.state || '',
      zipCode: formData.zipCode || '',
      latitude: formData.latitude || undefined,
      longitude: formData.longitude || undefined,
      managerPhoto: formData.managerPhoto || undefined,
      managerName: formData.managerName || '',
      managerPhone: formData.managerPhone || '',
      managerEmail: formData.managerEmail || '',
      website: formData.website || merchantInfo?.website || '',
      whatsapp: formData.whatsapp || '',
      linkedin: formData.linkedin || merchantInfo?.linkedin || '',
      instagram: formData.instagram || merchantInfo?.instagram || '',
      twitter: formData.twitter || merchantInfo?.twitter || '',
      snapchat: formData.snapchat || merchantInfo?.snapchat || '',
      bank: formData.bank || '',
      accountNumber: formData.accountNumber || '',
      bankAccountName: formData.bankAccountName || '',
      minPayment: formData.minPayment || merchantInfo?.spendMinimumAmount || '',
    },
  });

  const {
    handleLogoChange,
    handleBusinessPhotosChange,
    handleManagerPhotoChange,
    handleNext,
    handlePrev,
    onError,
    handleSubmit,
    isPending,
    isSuccess,
  } = useBranchFormHandlers(form.setValue, form.trigger, form.getValues(), isAccountVerified);

  // Prefill form with merchant info when available
  useEffect(() => {
    if (merchantInfo && isOpen) {
      // Only update if formData doesn't already have values (to preserve user input)
      if (!formData.description) {
        form.setValue('description', merchantInfo.description || '');
      }
      if (!formData.phone) {
        form.setValue('phone', cleanPhoneNumber(merchantInfo.businessPhoneNo || ''));
      }
      if (!formData.email) {
        form.setValue('email', merchantInfo.businessEmail || '');
      }
      if (!formData.website) {
        form.setValue('website', merchantInfo.website || '');
      }
      if (!formData.linkedin) {
        form.setValue('linkedin', merchantInfo.linkedin || '');
      }
      if (!formData.instagram) {
        form.setValue('instagram', merchantInfo.instagram || '');
      }
      if (!formData.twitter) {
        form.setValue('twitter', merchantInfo.twitter || '');
      }
      if (!formData.snapchat) {
        form.setValue('snapchat', merchantInfo.snapchat || '');
      }
    }
  }, [merchantInfo, isOpen, form, formData]);

  // Generate bank token when modal opens (only once per modal session)
  useEffect(() => {
    if (isOpen && !hasGeneratedPayOnUsToken.current) {
      // No need to pass credentials - they're handled server-side
      // handleGenerateBankToken();
      handleGeneratePayOnUsToken();
      // hasGeneratedToken.current = true;
      hasGeneratedPayOnUsToken.current = true;
    }
  }, [isOpen, handleGeneratePayOnUsToken]);

  // Reset token generation flag and form state when modal closes
  useEffect(() => {
    if (!isOpen) {
      // hasGeneratedToken.current = false;
      hasGeneratedPayOnUsToken.current = false;
      // Reset form to default values
      form.reset();
      // Reset account verification state
      setIsAccountVerified(false);
      // Reset store state
      resetForm();
    }
  }, [isOpen, form, resetForm]);

  // Close modal when branch creation is successful
  useEffect(() => {
    if (isSuccess) {
      closeDialog();
      form.reset();
      resetForm();


    }
  }, [isSuccess, closeDialog, form, resetForm]);


  return (
    <Dialog open={isOpen} onOpenChange={closeDialog}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col p-0">
        <BranchFormHeader
          title="Branch Registration"
          description={getStepDescription(currentStep)}
        />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit, onError)} className="flex flex-col flex-1 min-h-0">
            <div className="flex-1 overflow-y-auto px-6 py-4 min-h-0">
              <BranchStepContent
                currentStep={currentStep}
                control={form.control}
                setValue={form.setValue}
                onLogoChange={handleLogoChange}
                onBusinessPhotosChange={handleBusinessPhotosChange}
                onManagerPhotoChange={handleManagerPhotoChange}
                onAccountVerificationChange={setIsAccountVerified}
              />
            </div>

            <BranchFormFooter
              currentStep={currentStep}
              onPrev={handlePrev}
              onNext={() => handleNext(currentStep)}
              onSubmit={() => form.handleSubmit(handleSubmit, onError)()}
              isLastStep={currentStep === 5}
              isPending={isPending}
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}