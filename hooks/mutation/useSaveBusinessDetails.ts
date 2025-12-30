import api from "@/lib/api";
import { RegisterBusinessFormData } from "@/lib/schemas/business-registration-schema";
import { MutationErrorType } from "@/lib/types";
import { useUserAuthStore } from "@/stores/user-auth-store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface BusinessOperationTypeData {
  isRegistered: string;
  salesChannels: string[];
}

interface SaveBusinessDetailsPayload {
  userId: string;
  registeredBusiness: boolean;
  sellOffline: boolean;
  sellOnline: boolean;
  businessLogoPath?: string | null;
  businessPhoneNo: string;
  brandName?: string;
  businessEmail: string;
  businessName: string;
  description: string;
  category: string[]; // Array of category IDs
  businessImagePath?: string[]; // Array of image URLs from upload
  businessOpenHours: string;
  businessClosingHours: string;
}

export const useSaveBusinessDetails = () => {
  const queryClient = useQueryClient();
  const { user } = useUserAuthStore();

  const { mutate, isPending, isSuccess, isError } = useMutation<
    { success: boolean; message: string },
    MutationErrorType,
    { businessDetails: RegisterBusinessFormData; operationType: BusinessOperationTypeData }
  >({
    mutationFn: ({ businessDetails, operationType }) => {
      if (!user?.id) {
        throw new Error("User ID is required");
      }

      // Map operation type data
      const registeredBusiness = operationType.isRegistered === "yes";
      const sellOffline = operationType.salesChannels.includes("offline");
      const sellOnline = operationType.salesChannels.includes("online");

      // Map business details data
      const category = Array.isArray(businessDetails.businessCategories)
        ? businessDetails.businessCategories
        : businessDetails.businessCategories ? [businessDetails.businessCategories] : [];

      // Build JSON payload
      const payload: SaveBusinessDetailsPayload = {
        userId: user.id,
        registeredBusiness,
        sellOffline,
        sellOnline,
        businessPhoneNo: businessDetails.businessPhone,
        businessEmail: businessDetails.businessEmail,
        businessName: businessDetails.businessName,
        description: businessDetails.businessDescription,
        category,
        businessOpenHours: businessDetails.businessOpenHours,
        businessClosingHours: businessDetails.businessClosingHours,
      };

      // Add optional image URL fields
      if (businessDetails.logo) {
        payload.businessLogoPath = businessDetails.logo;
      }
      if (businessDetails.businessPhoto && Array.isArray(businessDetails.businessPhoto) && businessDetails.businessPhoto.length > 0) {
        payload.businessImagePath = businessDetails.businessPhoto;
      }

      return api.post("/merchant/addBusinessInformation", payload);
    },
    onSuccess: (response) => {
      toast.success(response.message || "Business details saved successfully");
      queryClient.invalidateQueries({ queryKey: ["business-registration"] });
    },
    onError: (error: MutationErrorType) => {
      const errorMessage = error?.response?.data?.message ?? error?.message ?? "Failed to save business details";
      toast.error(errorMessage);
    },
  });

  const handleSaveBusinessDetails = (data: { businessDetails: RegisterBusinessFormData; operationType: BusinessOperationTypeData }) => {
    mutate(data);
  };

  return {
    handleSaveBusinessDetails,
    isPending,
    isSuccess,
    isError,
  };
};

