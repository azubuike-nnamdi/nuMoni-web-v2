import api from "@/lib/api";
import { MutationErrorType } from "@/lib/types";
import { useUserAuthStore } from "@/stores/user-auth-store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface BusinessDocumentPayload {
  identificationType: string;
  identificationTypeNumber?: string;
  businessRegNo?: string;
  tinNo?: string;
  cacDocumentPath?: string | null;
  reqCertificatePath?: string | null;
  tinPath?: string | null;
  menuPath?: string | null;
  verifiedNin?: boolean;
  verifiedTinNo?: boolean;
  verifiedCac?: boolean;
}

export const useSaveBusinessDocuments = () => {
  const queryClient = useQueryClient();
  const { user, setUser } = useUserAuthStore();

  const { mutate, isPending, isSuccess, isError } = useMutation<
    { success: boolean; message: string },
    MutationErrorType,
    BusinessDocumentPayload
  >({
    mutationFn: (data: BusinessDocumentPayload) => {
      if (!user?.id) {
        throw new Error("User ID is required");
      }

      // Build payload matching API expectations
      const payload: Record<string, string | null> = {
        userId: user.id,
        identificationType: data.identificationType,
      };

      // Map registration number - could be identificationTypeNumber or businessRegNo
      if (data.identificationTypeNumber) {
        payload.identificationTypeNumber = data.identificationTypeNumber;
      }
      if (data.businessRegNo) {
        payload.businessRegNo = data.businessRegNo;
      }

      // Map TIN
      if (data.tinNo) {
        payload.tinNo = data.tinNo;
      }

      // Map document paths
      if (data.cacDocumentPath) {
        payload.cacDocumentPath = data.cacDocumentPath;
      }
      if (data.reqCertificatePath) {
        payload.reqCertificatePath = data.reqCertificatePath;
      }
      if (data.tinPath) {
        payload.tinPath = data.tinPath;
      }
      if (data.menuPath) {
        payload.menuPath = data.menuPath;
      }

      // Verified fields (optional, can be null)
      payload.verifiedNin = data.verifiedNin ? "true" : "false";
      payload.verifiedTinNo = data.verifiedTinNo ? "true" : "false";
      payload.verifiedCac = data.verifiedCac ? "true" : "false";

      return api.post("/merchant/businessDocuments", payload);
    },
    onSuccess: (response) => {
      toast.success(response.message || "Business documents saved successfully");
      queryClient.invalidateQueries({ queryKey: ["business-registration"] });

      // Update regLevel to 3 after completing documents (if not already higher)
      if (user && (!user.regLevel || user.regLevel < 3)) {
        const updatedUser = {
          ...user,
          regLevel: 3,
        };
        setUser(updatedUser); // This will update cookies via setUser
      }
    },
    onError: (error: MutationErrorType) => {
      const errorMessage = error?.response?.data?.message ?? error?.message ?? "Failed to save business documents";
      toast.error(errorMessage);
    },
  });

  const handleSaveBusinessDocuments = (data: BusinessDocumentPayload) => {
    mutate(data);
  };

  return {
    handleSaveBusinessDocuments,
    isPending,
    isSuccess,
    isError,
  };
};

