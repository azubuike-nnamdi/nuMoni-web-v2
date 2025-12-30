"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useGenerateBankToken } from "@/hooks/mutation/useGenerateBankToken";
import { useBranchUpdateSubmission } from "@/hooks/use-branch-update-submission";
import { BranchFormData, branchFormSchema } from "@/lib/schemas/branch-schema";
import { getStepDescription } from "@/lib/step-utils";
import { BranchData } from "@/lib/types/branch-api";
import { useBranchStore } from "@/stores/branch-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import BranchFormFooter from "./branch-form-footer";
import BranchFormHeader from "./branch-form-header";
import BranchStepContent from "./branch-step-content";

interface UpdateBranchProps {
  isOpen: boolean;
  onClose: () => void;
  branchData: BranchData | null;
}

export default function UpdateBranch({ isOpen, onClose, branchData }: UpdateBranchProps) {
  const { formData, updateFormData, resetForm } = useBranchStore();
  const { submitBranchUpdate, isPending, isSuccess } = useBranchUpdateSubmission(branchData?.id || '');
  const { handleGenerateBankToken } = useGenerateBankToken();
  const hasGeneratedToken = useRef(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // console.log('🔄 UpdateBranch render - isOpen:', isOpen, 'branchData:', branchData?.id, 'isSuccess:', isSuccess, 'hasSubmitted:', hasSubmitted);

  // Get default values from branch data
  const getDefaultValues = useCallback((): BranchFormData => {
    if (!branchData) return formData as BranchFormData;

    return {
      logo: branchData.logo || formData.logo || undefined,
      branchName: branchData.name || formData.branchName || '',
      branchRegion: branchData.region || formData.branchRegion || '',
      branchState: branchData.state || formData.branchState || '',
      lga: branchData.lga || formData.lga || '',
      openingTime: branchData.openingTime || formData.openingTime || '',
      closingTime: branchData.closingTime || formData.closingTime || '',
      description: branchData.description || formData.description || '',
      phone: branchData.phoneNumber || formData.phone || '',
      email: branchData.emailAddress || formData.email || '',
      businessPhoto: branchData.images?.[0] || formData.businessPhoto || undefined,
      businessPhotos: branchData.images || formData.businessPhotos || undefined,
      address: branchData.address || formData.address || '',
      city: branchData.city || formData.city || '',
      state: branchData.state || formData.state || '',
      zipCode: branchData.zipCode || formData.zipCode || '',
      latitude: branchData.latitude ? parseFloat(branchData.latitude) : formData.latitude || undefined,
      longitude: branchData.longitude ? parseFloat(branchData.longitude) : formData.longitude || undefined,
      managerPhoto: branchData.managerProfilePhoto || formData.managerPhoto || undefined,
      managerName: branchData.managerDetails?.name || formData.managerName || '',
      managerPhone: branchData.managerDetails?.phone || formData.managerPhone || '',
      managerEmail: branchData.managerDetails?.email || formData.managerEmail || '',
      website: branchData.website || formData.website || '',
      whatsapp: branchData.whatsApp || formData.whatsapp || '',
      linkedin: branchData.linkedin || formData.linkedin || '',
      instagram: branchData.instagram || formData.instagram || '',
      twitter: branchData.x || formData.twitter || '',
      snapchat: branchData.snapchat || formData.snapchat || '',
      bank: branchData.bankCode || formData.bank || '',
      accountNumber: branchData.bankAccountNumber || formData.accountNumber || '',
      bankAccountName: branchData.bankAccountName || formData.bankAccountName || '',
      minPayment: branchData.minimumPaymentAmount || formData.minPayment || '',
    };
  }, [branchData, formData]);

  // Initialize form with default values
  const form = useForm<BranchFormData>({
    resolver: zodResolver(branchFormSchema),
    defaultValues: getDefaultValues(),
  });

  // Handle form submission - only when user clicks Update Branch button
  const handleSubmit = async (data: BranchFormData) => {
    // console.log('🎯 Branch update form SUBMITTED by user clicking Update Branch button:', data);
    // console.log('🎯 Current step when submitting:', currentStep);
    await submitBranchUpdate(data);
  };

  // Handle Update Branch button click
  const handleUpdateClick = async () => {
    // console.log('🎯 Update Branch button clicked by user');
    setHasSubmitted(true);
    const formData = form.getValues();
    await handleSubmit(formData);
  };


  // Handle logo change
  const handleLogoChange = (base64: string | null) => {
    form.setValue('logo', base64 || undefined);
  };

  // Handle business photos change
  const handleBusinessPhotosChange = (photos: string[]) => {
    form.setValue('businessPhotos', photos);
  };

  // Handle manager photo change
  const handleManagerPhotoChange = (base64: string | null) => {
    form.setValue('managerPhoto', base64 || undefined);
  };

  // Step navigation functions - only navigate, never submit
  const handleNext = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    // console.log('🔄 handleNext called - NAVIGATING ONLY, currentStep:', currentStep);
    if (currentStep < 2) {
      console.log('🔄 Moving to step:', currentStep + 1);
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };


  // Generate bank token when modal opens
  useEffect(() => {
    if (isOpen && !hasGeneratedToken.current) {
      handleGenerateBankToken();
      hasGeneratedToken.current = true;
    }
  }, [isOpen, handleGenerateBankToken]);

  // Reset token generation flag when modal closes
  useEffect(() => {
    if (!isOpen) {
      hasGeneratedToken.current = false;
    }
  }, [isOpen]);

  // Close modal when branch update is successful (only when modal is open and we've submitted)
  useEffect(() => {
    if (isSuccess && isOpen && hasSubmitted) {
      // console.log('🎉 Branch update successful - closing modal');
      // Small delay to allow data refresh
      setTimeout(() => {
        onClose();
      }, 500);
    }
  }, [isSuccess, isOpen, hasSubmitted, onClose]);

  // Reset form when modal opens with new data
  useEffect(() => {
    if (isOpen && branchData) {
      // console.log('🔄 Modal opened - resetting to step 1 and prepopulating form');
      // Reset to step 1 when opening
      setCurrentStep(1);
      // Reset submission flag
      setHasSubmitted(false);

      // Force form reset
      form.reset();

      const defaultValues = getDefaultValues();
      form.reset(defaultValues);
      updateFormData(defaultValues);

      // Set values in the correct sequence: region first, then state, then LGA
      setTimeout(() => {
        form.setValue('branchRegion', defaultValues.branchRegion);
        setTimeout(() => {
          form.setValue('branchState', defaultValues.branchState);
          setTimeout(() => {
            form.setValue('lga', defaultValues.lga);
          }, 200);
        }, 200);
      }, 100);
    }
  }, [isOpen, branchData, form, updateFormData, getDefaultValues]);


  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      console.log('🔄 Modal closed - resetting all state');
      resetForm();
      setCurrentStep(1);
      setHasSubmitted(false);
      // Reset form to initial state
      form.reset();
    }
  }, [isOpen, resetForm, form]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        key={`update-modal-${branchData?.id || 'new'}-${isOpen}`}
        className="sm:max-w-3xl max-h-[90vh] flex flex-col p-0"
      >
        <BranchFormHeader
          title="Update Branch"
          description={getStepDescription(currentStep)}
        />

        <Form {...form}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              console.log('🚫 Form submit event prevented - only Update Branch button should submit');
            }}
            className="flex flex-col flex-1 min-h-0"
          >
            <div className="flex-1 overflow-y-auto px-6 py-4 min-h-0">
              <BranchStepContent
                key={`step-${currentStep}-${branchData?.id || 'new'}-${isOpen}`}
                currentStep={currentStep}
                control={form.control}
                setValue={form.setValue}
                onLogoChange={handleLogoChange}
                onBusinessPhotosChange={handleBusinessPhotosChange}
                onManagerPhotoChange={handleManagerPhotoChange}
                onAccountVerificationChange={() => { }}
                isUpdate={true}
              />
            </div>

            <BranchFormFooter
              currentStep={currentStep}
              onPrev={handlePrev}
              onNext={handleNext}
              onSubmit={handleUpdateClick}
              isLastStep={currentStep === 2}
              isPending={isPending}
              isUpdate={true}
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}