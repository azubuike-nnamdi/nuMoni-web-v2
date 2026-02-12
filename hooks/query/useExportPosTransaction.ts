import api from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

interface ExportPosTransactionParams {
  merchantId: string;
  posId?: string;
  transactionType?: string;
  startDate?: string;
  endDate?: string;
  customerEmail?: string;
  customerPhoneNo?: string;
  customerId?: string;
}

export const useExportPosTransaction = () => {
  const { mutate, isPending, isSuccess, reset } = useMutation({
    mutationFn: async (params: ExportPosTransactionParams) => {
      const queryParams = new URLSearchParams();
      queryParams.append("merchantId", params.merchantId);

      if (params.posId) queryParams.append("posId", params.posId);
      if (params.transactionType) queryParams.append("transactionType", params.transactionType);
      if (params.startDate) queryParams.append("startDate", params.startDate);
      if (params.endDate) queryParams.append("endDate", params.endDate);
      if (params.customerEmail) queryParams.append("customerEmail", params.customerEmail);
      if (params.customerPhoneNo) queryParams.append("customerPhoneNo", params.customerPhoneNo);
      if (params.customerId) queryParams.append("customerId", params.customerId);

      const queryString = queryParams.toString();
      const response = await api.get(`/auth/pos/exportTransactions?${queryString}`, {
        responseType: 'blob', // Important for file downloads
      });
      return response;
    },
    onSuccess: (response) => {
      // Handle file download
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      // Try to get filename from Content-Disposition header, fallback to default
      const contentDisposition = response.headers['content-disposition'];
      let filename = 'pos-transactions.xlsx'; // default filename

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/['"]/g, '');
        }
      }

      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Transactions exported successfully");
    },
    onError: (error: { response: { data: { message: string } } }) => {
      toast.error(error?.response?.data?.message ?? "Failed to export transactions");
    },
  });

  const handleExportPosTransaction = (params: ExportPosTransactionParams) => {
    mutate(params);
  };

  return { handleExportPosTransaction, isPending, isSuccess, reset };
};

export default useExportPosTransaction;

