import { calculatePayloadSize, compressImage, formatFileSize } from "@/lib/helper";
import { formatPhoneNumber } from "@/lib/phone-utils";
import { BranchFormData } from "@/lib/schemas/branch-schema";
import { CreateBranchPayload } from "@/lib/types/branch-api";
import { useBranchStore } from "@/stores/branch-store";
import { toast } from "sonner";
import { useCreateBranch } from "./mutation/useCreateBranch";

// Helper function to convert base64 to File
const base64ToFile = (base64: string, filename: string): File => {
  const arr = base64.split(',');
  const mime = /:(.*?);/.exec(arr[0])?.[1] || 'image/jpeg';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

export const useBranchFormSubmission = () => {
  const { formData, managerId } = useBranchStore();

  const { handleCreateBranch, isPending, isSuccess, isError, error } = useCreateBranch();

  const createFormDataPayload = async (data: BranchFormData): Promise<CreateBranchPayload> => {
    // Use the actual form data, only fall back to store for images
    const completeData = {
      ...data,
      logo: data.logo || formData.logo,
      businessPhoto: data.businessPhoto || formData.businessPhoto,
      managerPhoto: data.managerPhoto || formData.managerPhoto,
    };

    // Create API payload
    const apiPayload: CreateBranchPayload = {
      name: completeData.branchName,
      state: completeData.branchState,
      region: completeData.branchRegion,
      lga: completeData.lga,
      openingTime: completeData.openingTime || '',
      closingTime: completeData.closingTime || '',
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

    // Add and compress files
    if (completeData.logo) {
      const logoFile = base64ToFile(completeData.logo, 'logo.jpg');
      apiPayload.logo = await compressImage(logoFile, 800, 0.8); // Compress logo more aggressively
    }

    if (completeData.businessPhotos && completeData.businessPhotos.length > 0) {
      const compressedPhotos = await Promise.all(
        completeData.businessPhotos.map(async (photo, index) => {
          const photoFile = base64ToFile(photo, `business-photo-${index}.jpg`);
          return await compressImage(photoFile, 1200, 0.7); // Compress business photos
        })
      );
      apiPayload.images = compressedPhotos;
    }

    if (completeData.managerPhoto) {
      const managerFile = base64ToFile(completeData.managerPhoto, 'manager-photo.jpg');
      apiPayload.managerProfilePhoto = await compressImage(managerFile, 800, 0.8); // Compress manager photo
    }

    return apiPayload;
  };

  const submitBranch = async (data: BranchFormData) => {

    try {
      const apiPayload = await createFormDataPayload(data);

      // Validate total payload size (10MB limit for server)
      const totalSize = calculatePayloadSize(apiPayload);
      const maxPayloadSize = 10 * 1024 * 1024; // 10MB

      if (totalSize > maxPayloadSize) {
        toast.error(`Total file size is ${formatFileSize(totalSize)}. Maximum allowed total size is 10MB. Please reduce image sizes or remove some images.`);
        return;
      }

      console.log('📊 Payload size:', formatFileSize(totalSize));

      // Use the mutation hook to submit the data
      handleCreateBranch(apiPayload);
    } catch (error) {
      console.error('Error processing images:', error);
      toast.error('Failed to process images. Please try again.');
    }
  };

  return {
    submitBranch,
    createFormDataPayload,
    isPending,
    isSuccess,
    isError,
    error,
  };
};
