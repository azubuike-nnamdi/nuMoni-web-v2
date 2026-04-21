import api from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

interface ExportPointsRedeemedParams {
  fromDate: string;
  toDate: string;
}

const useExportPointsRedeemed = () => {
  const { mutate, isPending, isSuccess, reset } = useMutation({
    mutationFn: async ({ fromDate, toDate }: ExportPointsRedeemedParams) => {
      const response = await api.get(
        `/merchant/points-redeemed/export?fromDate=${fromDate}&toDate=${toDate}`,
        {
          responseType: "blob", // Important for file downloads
        }
      );
      return response;
    },
    onSuccess: (response) => {
      // Handle file download
      const blob = new Blob([response.data], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      // Try to get filename from Content-Disposition header, fallback to default
      const contentDisposition = response.headers["content-disposition"];
      let filename = "points-redeemed.csv"; // default filename

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(
          /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
        );
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/['"]/g, "");
        }
      }

      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Points redeemed exported successfully");
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(
        error?.response?.data?.message ?? "Failed to export points redeemed"
      );
    },
  });

  const handleExportPointsRedeemed = (params: ExportPointsRedeemedParams) => {
    mutate(params);
  };

  return { handleExportPointsRedeemed, isPending, isSuccess, reset };
};

export default useExportPointsRedeemed;