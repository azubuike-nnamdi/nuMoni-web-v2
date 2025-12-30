import api from "@/lib/api";
import { BusinessLocationFormData } from "@/lib/schemas/business-registration-schema";
import { MutationErrorType } from "@/lib/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface SaveBusinessLocationPayload {
  merchantId: string;
  storeNo: string;
  address: string;
  street?: string | null;
  city?: string | null;
  state?: string | null;
  country: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  active: boolean;
  id?: string;
}

const buildPayload = (data: BusinessLocationFormData): SaveBusinessLocationPayload => {
  const payload: SaveBusinessLocationPayload = {
    merchantId: data.merchantId,
    storeNo: data.storeNo,
    address: data.address,
    // Convert empty strings to null for optional fields
    street: data.street && data.street.trim() ? data.street.trim() : null,
    city: data.city && data.city.trim() ? data.city.trim() : null,
    state: data.state && data.state.trim() ? data.state.trim() : null,
    country: data.country,
    postalCode: data.postalCode,
    latitude: data.latitude,
    longitude: data.longitude,
    active: data.active,
  };

  // Only include id if it's not null (matching the API requirement)
  if (data.id != null) {
    payload.id = data.id;
  }

  return payload;
};

export const useSaveBusinessLocation = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isSuccess, isError } = useMutation<
    { success: boolean; message: string },
    MutationErrorType,
    BusinessLocationFormData
  >({
    mutationFn: (data: BusinessLocationFormData) => {
      const payload = buildPayload(data);
      return api.post("/merchant/location", payload);
    },
    onSuccess: (response) => {
      toast.success(response.message || "Business location saved successfully");
      queryClient.invalidateQueries({ queryKey: ["business-registration"] });
    },
    onError: (error: MutationErrorType) => {
      const errorMessage = error?.response?.data?.message ?? error?.message ?? "Failed to save business location";
      toast.error(errorMessage);
    },
  });

  const handleSaveBusinessLocation = (data: BusinessLocationFormData) => {
    mutate(data);
  };

  return {
    handleSaveBusinessLocation,
    isPending,
    isSuccess,
    isError,
  };
};

