import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export type FileUploadType = 'images' | 'documents' | 'deallmage' | string;

interface UploadFileParams {
  formData: FormData;
  type: FileUploadType;
}

export const useUploadDealsFile = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending, isSuccess } = useMutation({
    mutationFn: ({ formData, type }: UploadFileParams) => {
      return api.post(`/merchant/file?type=${type}`, formData);
    },
    onSuccess: (data) => {
      if (data) {
        const imagePath = data?.data?.name;
        if (imagePath) {
          console.log('Uploaded file URL:', imagePath);
        }
        toast.success(data?.data?.message ?? "File uploaded successfully");
      }
    },
    onError: (error: { response: { data: { message: string } } }) => {
      toast.error(error?.response?.data?.message ?? "Failed to upload file");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["deals"] });
    },
  });

  const handleUploadDealsFile = async (formData: FormData, type: FileUploadType = 'images') => {
    const result = await mutateAsync({ formData, type });
    const imagePath = result?.data?.name;
    return imagePath;
  };

  return { handleUploadDealsFile, isPending, isSuccess };
};