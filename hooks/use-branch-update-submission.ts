import { formatPhoneNumber } from "@/lib/phone-utils";
import { BranchFormData } from "@/lib/schemas/branch-schema";
import { UpdateBranchPayload } from "@/lib/types/branch-api";
import { useBranchStore } from "@/stores/branch-store";
import { useUpdateBranch } from "./mutation/useUpdateBranch";

// Helper function to convert base64 to File
const base64ToFile = (base64: string, filename: string): File => {
  // Check if it's a URL instead of base64
  if (base64.startsWith('http')) {
    console.warn('URL detected instead of base64, skipping file conversion:', base64);
    return new File([''], filename, { type: 'image/jpeg' });
  }

  // Check if it's a valid base64 string
  if (!base64.includes(',')) {
    console.warn('Invalid base64 string, missing comma separator:', base64);
    return new File([''], filename, { type: 'image/jpeg' });
  }

  const arr = base64.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';

  try {
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  } catch (error) {
    console.error('Error decoding base64:', error);
    return new File([''], filename, { type: 'image/jpeg' });
  }
};

export const useBranchUpdateSubmission = (branchId: string) => {
  const { formData, managerId } = useBranchStore();

  const { handleUpdateBranch, isPending, isSuccess, isError, error } = useUpdateBranch();

  const createFormDataPayload = (data: BranchFormData): UpdateBranchPayload => {
    // Use the actual form data, only fall back to store for images
    const completeData = {
      ...data,
      logo: data.logo || formData.logo,
      businessPhoto: data.businessPhoto || formData.businessPhoto,
      managerPhoto: data.managerPhoto || formData.managerPhoto,
    };

    // Create API payload
    const apiPayload: UpdateBranchPayload = {
      branchId: branchId,
      name: completeData.branchName,
      state: completeData.branchState,
      region: completeData.branchRegion,
      lga: completeData.lga,
      openingTime: completeData.openingTime || '08:00',
      closingTime: completeData.closingTime || '17:00',
      description: completeData.description,
      phoneNumber: formatPhoneNumber(completeData.phone, 'compact-int'),
      emailAddress: completeData.email,
      address: completeData.address,
      managerId: managerId || '',
      bankCode: completeData.bank,
      bankAccountNumber: completeData.accountNumber,
      bankAccountName: completeData.bankAccountName || completeData.managerName, // Use verified account name, fallback to manager name
      minimumPaymentAmount: completeData.minPayment,
    };

    // Add optional fields
    if (completeData.latitude) {
      apiPayload.latitude = completeData.latitude.toString();
    }
    if (completeData.longitude) {
      apiPayload.longitude = completeData.longitude.toString();
    }
    if (completeData.website) {
      apiPayload.website = completeData.website;
    }
    if (completeData.whatsapp) {
      apiPayload.whatsApp = formatPhoneNumber(completeData.whatsapp, 'compact-int');
    }

    // Add files - only if they are base64 strings (new uploads)
    if (completeData.logo && completeData.logo.startsWith('data:')) {
      apiPayload.logo = base64ToFile(completeData.logo, 'logo.jpg');
    }

    if (completeData.businessPhotos && completeData.businessPhotos.length > 0) {
      // Only convert base64 strings, skip URLs
      const base64Photos = completeData.businessPhotos.filter(photo => photo.startsWith('data:'));
      if (base64Photos.length > 0) {
        apiPayload.images = base64Photos.map((photo, index) =>
          base64ToFile(photo, `business-photo-${index}.jpg`)
        );
      }
    }

    if (completeData.managerPhoto && completeData.managerPhoto.startsWith('data:')) {
      apiPayload.managerProfilePhoto = base64ToFile(completeData.managerPhoto, 'manager-photo.jpg');
    }

    return apiPayload;
  };

  const submitBranchUpdate = async (data: BranchFormData) => {
    console.log('🎉 BRANCH UPDATE SUBMISSION SUCCESSFUL! 🎉');
    console.log('Branch update triggered with data:', data);
    console.log('🔍 Image data types:', {
      logo: data.logo?.substring(0, 50) + '...',
      businessPhotos: data.businessPhotos?.map(p => p.substring(0, 50) + '...'),
      managerPhoto: data.managerPhoto?.substring(0, 50) + '...'
    });

    const apiPayload = createFormDataPayload(data);

    // Use the mutation hook to submit the data
    handleUpdateBranch(apiPayload);
  };

  return {
    submitBranchUpdate,
    createFormDataPayload,
    isPending,
    isSuccess,
    isError,
    error,
  };
};
