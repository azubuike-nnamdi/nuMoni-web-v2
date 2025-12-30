import api from "@/lib/api";
import { BusinessCollectionAccountFormData } from "@/lib/schemas/business-registration-schema";
import { Bank, MutationErrorType } from "@/lib/types";
import { useUserAuthStore } from "@/stores/user-auth-store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface SaveBusinessCollectionAccountResponse {
  success: boolean;
  message: string;
  data?: unknown;
}


interface SaveBusinessCollectionAccountPayload {
  userId: string;
  bankname: string;
  bankcode: string;
  bankTransferCode: string;
  accountNo: string;
  accountHolderName?: string;
  primary: boolean;
  minimumSpendAmount: number;
}

const buildPayload = (
  data: BusinessCollectionAccountFormData,
  userId: string,
  banks: Bank[] | undefined
): SaveBusinessCollectionAccountPayload => {
  // Find bank name from bank code
  const allBanks = Array.isArray(banks) ? banks : [];

  const selectedBankData = allBanks.find((bank: Bank) => bank.code === data.bank);
  const bankName = selectedBankData?.name || '';

  const payload: SaveBusinessCollectionAccountPayload = {
    userId,
    bankname: bankName,
    bankcode: data.bank,
    bankTransferCode: data.bank, // Using bank code as transfer code (may need adjustment based on API requirements)
    accountNo: data.accountNumber,
    primary: true, // This is the primary collection account
    minimumSpendAmount: data.minPayment,
  };

  // Add account holder name if available (from verification)
  if (data.bankAccountName) {
    payload.accountHolderName = data.bankAccountName;
  }

  return payload;
};

export const useSaveBusinessCollectionAccount = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { user, setUser } = useUserAuthStore();

  const { mutate, isPending, isSuccess, isError } = useMutation<
    SaveBusinessCollectionAccountResponse,
    MutationErrorType,
    { data: BusinessCollectionAccountFormData; banks?: Bank[] }
  >({
    mutationFn: ({ data, banks }) => {
      if (!user?.id) {
        throw new Error("User ID is required");
      }

      const payload = buildPayload(data, user.id, banks);
      return api.post("/merchant/bankInformation", payload);
    },
    onSuccess: (response) => {
      toast.success(response.message || "Collection account saved successfully");
      queryClient.invalidateQueries({ queryKey: ["business-registration"] });

      // Update regLevel to 4 after completing collection account (final step)
      if (user) {
        const updatedUser = {
          ...user,
          regLevel: 4,
        };
        setUser(updatedUser); // This will update cookies via setUser
      }

      // Redirect to dashboard after successful save
      router.push("/dashboard");
    },
    onError: (error: MutationErrorType) => {
      const errorMessage = error?.response?.data?.message ?? error?.message ?? "Failed to save collection account";
      toast.error(errorMessage);
    },
  });

  const handleSaveBusinessCollectionAccount = (data: BusinessCollectionAccountFormData, banks?: Bank[]) => {
    mutate({ data, banks });
  };

  return {
    handleSaveBusinessCollectionAccount,
    isPending,
    isSuccess,
    isError,
  };
};

