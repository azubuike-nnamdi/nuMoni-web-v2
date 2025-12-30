import api from "@/lib/api";
import { generateUUID } from "@/lib/helper";
import { formatPhoneWithPlus234 } from "@/lib/phone-utils";
import { SignUpFormData } from "@/lib/schemas/signup-schema";
import { AuthUser } from "@/lib/types";
import { useSignUpStore } from "@/stores/signup-store";
import { useUserAuthStore } from "@/stores/user-auth-store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface SignUpPayload {
  username: string;
  password: string;
  userType: string;
  phoneNumber: string;
  name: string;
  firstname: string;
  lastName: string;
  deviceId: string;
  fcmToken: string | null;
}

export const useSignUp = () => {
  const queryClient = useQueryClient();
  const { setShowWelcomeModal } = useSignUpStore();
  const { setUser, setLoading } = useUserAuthStore();

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: (payload: SignUpPayload) => {
      return api.post("/auth/signup", payload);
    },
    onSuccess: ({ data }) => {
      if (data) {
        // Transform the response data to match our AuthUser type
        const userData: AuthUser = {
          id: data.id,
          username: data.username,
          usertype: data.usertype,
          roles: data.roles,
          token: data.token,
          refreshToken: data.refreshToken,
        };

        // Store user data in the auth store (saves token and user info)
        setUser(userData);
        toast.success(data.message ?? "Account created successfully");

        // Show welcome modal on success
        setShowWelcomeModal(true);
      }
    },
    onError: (error: { response: { data: { message: string } } }) => {
      toast.error(error?.response?.data?.message ?? "Failed to create account");
      setLoading(false);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      setLoading(false);
    },
  });

  const handleSignUp = (formData: SignUpFormData) => {
    // Split fullName into firstname and lastName
    const nameParts = (formData.fullName || "").trim().split(" ");
    const firstname = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || firstname; // Use firstname as fallback if no last name

    const payload: SignUpPayload = {
      username: formData.email,
      password: formData.password,
      userType: "MERCHANT",
      phoneNumber: formatPhoneWithPlus234(formData.phoneNumber),
      name: formData.fullName,
      firstname: firstname,
      lastName: lastName,
      deviceId: generateUUID(),
      fcmToken: null,
    };

    mutate(payload);
  };

  return { handleSignUp, isPending, isSuccess };
};