import api from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

interface ExportTransactionsParams {
  posName: string;
  posId?: string;
  transactionType?: string;
  fromDate?: string;
  toDate?: string;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

const DEFAULT_FILENAME = "pos-transactions.xlsx";

const getFilenameFromHeaders = (
  contentDisposition: string | undefined,
  fallbackParams?: ExportTransactionsParams,
): string => {
  if (contentDisposition) {
    const filenameMatch = /filename="?([^"]+)"?/.exec(contentDisposition);
    if (filenameMatch?.[1]) {
      return filenameMatch[1].replace(/['"]/g, "");
    }
  }

  if (fallbackParams?.posName) {
    // Sanitize posName to be safe for filenames
    const sanitizedPosName = fallbackParams.posName
      .replace(/[^a-z0-9]/gi, "-")
      .toLowerCase();
    return `${sanitizedPosName}-transactions.xlsx`;
  }

  return DEFAULT_FILENAME;
};

const triggerFileDownload = (data: Blob, filename: string) => {
  const url = window.URL.createObjectURL(new Blob([data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

export const useExportTransactions = () => {
  const { mutate, isPending, isSuccess, reset } = useMutation({
    mutationFn: async (params: ExportTransactionsParams) => {
      const queryParams = new URLSearchParams();

      if (params.posId) queryParams.append("posId", params.posId);
      if (params.transactionType) {
        queryParams.append("transactionType", params.transactionType);
      }
      if (params.fromDate) queryParams.append("fromDate", params.fromDate);
      if (params.toDate) queryParams.append("toDate", params.toDate);

      const queryString = queryParams.toString();
      return await api.get(
        `/merchant/transaction-history-csv?${queryString}`,
        {
          responseType: "blob",
        },
      );
    },
    onSuccess: (response, variables) => {
      const filename = getFilenameFromHeaders(
        response.headers["content-disposition"],
        variables,
      );
      triggerFileDownload(response.data, filename);
      toast.success("Transactions exported successfully");
    },
    onError: (error: ApiError) => {
      toast.error(
        error?.response?.data?.message ?? "Failed to export transactions",
      );
    },
  });

  const handleExportPosTransaction = (params: ExportTransactionsParams) => {
    mutate(params);
  };

  return { handleExportPosTransaction, isPending, isSuccess, reset };
};

export default useExportTransactions;
