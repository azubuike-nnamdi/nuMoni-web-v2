import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface DeletePosPayload {
  id: string;
}

export const useDeletePos = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: (data: DeletePosPayload) =>
      api.delete(`/merchant/pos/${data.id}`),
    onSuccess: (data) => {
      toast.success(data?.data?.message ?? "POS deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["pos"] });
    },
    onError: (error: { response: { data: { message: string } } }) => {
      // console.log("Failed to delete POS", error);
      toast.error(error?.response?.data?.message ?? "Failed to delete POS");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["pos"] });
    },
  });

  const handleDeletePos = (id: string) => {
    mutate({ id });
  };

  return { handleDeletePos, isPending, isSuccess };
};
