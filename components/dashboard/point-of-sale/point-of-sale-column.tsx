import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useDeletePos } from "@/hooks/mutation/useDeletePos";
import { downloadQRCodeImageWithLogo, formatDateTime } from "@/lib/helper";
import { PointOfSaleData } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpRight, Copy, Download, Edit, MoreVertical, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import DeletePOSDialog from "./delete-pos-dialog";
import UpdatePOSDialog from "./update-pos-dialog";

export const pointOfSaleColumns: ColumnDef<PointOfSaleData>[] = [
  {
    accessorKey: "posName",
    header: "Name",
  },
  {
    accessorKey: "accountNo",
    header: "Account No",
  },
  {
    accessorKey: "merchantName",
    header: "Merchant Name",
  },
  {
    accessorKey: "bankName",
    header: "Bank Name",
  },
  {
    accessorKey: "accountHolderName",
    header: "Account Holder Name",
  },
  {
    accessorKey: "bankCode",
    header: "Bank Code",
  },
  // {
  //   accessorKey: "bankTransferCode",
  //   header: "Bank Transfer Code",
  // },

  {
    accessorKey: "location",
    header: "Location",
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "createDate",
    header: "Created Date",
    cell: ({ row }) => {
      const createDate = row.getValue("createDate") as string;
      return <div>{formatDateTime(createDate)}</div>;
    },
  },
  {
    accessorKey: "updatedDate",
    header: "Updated Date",
    cell: ({ row }) => {
      const updatedDate = row.getValue("updatedDate") as string;
      return <div>{formatDateTime(updatedDate)}</div>;
    },
  },
  {
    accessorKey: "transactions",
    header: "View Transactions",
    cell: ({ row }) => {
      const posId = row.original.posId;
      const merchantName = row.original.merchantName;
      const posName = row.original.posName;
      const merchantId = row.original.merchantId;

      const handleCopyLink = async () => {
        try {
          const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
          const transactionLink = `${baseUrl}/pos-transaction-history/${posId}?merchantName=${merchantName}&posName=${posName}&merchantId=${merchantId}`;
          await navigator.clipboard.writeText(transactionLink);
          toast.success("Transaction link copied to clipboard");
        } catch {
          toast.error("Failed to copy link");
        }
      };

      return (
        <div className="flex items-center gap-2">
          <Link href={`/pos-transaction-history/${posId}?merchantName=${merchantName}&posName=${posName}&merchantId=${merchantId}`} target="_blank">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              title="View Transactions"
            >
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </Link>
          <Button
            type="button"
            size="sm"
            className="h-8 w-8 p-0 bg-theme-dark-green"
            onClick={handleCopyLink}
            title="Copy Transaction Link"
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
  {
    accessorKey: "posQRCode",
    header: "POS QR Code",
    cell: ({ row }) => {
      const qrCode = row.getValue("posQRCode") as string | null | undefined;
      const posId = row.original.posId;

      const posName = row.getValue("posName") as string;
      const merchantLogo = row.original.merchantLogo as string | null | undefined;
      const location = row.original.location as string | null | undefined;
      const address = row.original.address as string | null | undefined;

      const handleDownloadQRCode = async () => {
        if (!qrCode) return;

        try {
          const filename = posName || posId || 'pos';
          await downloadQRCodeImageWithLogo(qrCode, filename, merchantLogo, location, address, posId);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to download QR code';
          console.error('Error downloading QR code:', errorMessage, error);
          toast.error(errorMessage);
        }
      };

      if (!qrCode) {
        return (
          <div className="text-gray-400 text-sm">
            N/A
          </div>
        );
      }

      return (
        <div className="flex items-center gap-2">
          <div className="relative w-12 h-12 rounded border border-gray-200 overflow-hidden bg-white">
            <Image
              src={qrCode}
              alt={`QR Code for ${posName || posId}`}
              width={48}
              height={48}
              className="object-contain"
              unoptimized
            />
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleDownloadQRCode}
            className="h-8 w-8 p-0"
            title="Download QR Code as PDF"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const statusColors: Record<string, string> = {
        "ACTIVE": "bg-green-100 text-green-700",
        "INACTIVE": "bg-red-100 text-red-700",
      };
      const colorClass = statusColors[status] || "bg-gray-100 text-gray-700";
      return (
        <div className={`px-2 py-1 rounded-full text-xs font-medium inline-block ${colorClass}`}>
          {status}
        </div>
      );
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return <ActionCell posData={row.original} />;
    },
  }
]

function ActionCell({ posData }: { posData: PointOfSaleData }) {

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);

  const { handleDeletePos, isPending: isDeletePending, isSuccess: isDeleteSuccess } = useDeletePos();

  const handleUpdatePOSClick = () => {
    setIsUpdateDialogOpen(true);
  };

  const handleDeletePOSClick = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    handleDeletePos(posData.id);
  };

  useEffect(() => {
    if (isDeleteSuccess) {
      setIsDeleteDialogOpen(false);
    }
  }, [isDeleteSuccess]);
  return <div>
    <div className="flex items-center justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none">
            <MoreVertical className="h-4 w-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            onClick={handleUpdatePOSClick}
            className="cursor-pointer"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit POS
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleDeletePOSClick}
            className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete POS
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>

    <DeletePOSDialog
      isOpen={isDeleteDialogOpen}
      onClose={() => setIsDeleteDialogOpen(false)}
      onConfirm={handleDeleteConfirm}
      posName={posData.posName}
      posId={posData.id}
      isLoading={isDeletePending}
    />

    <UpdatePOSDialog
      isOpen={isUpdateDialogOpen}
      onClose={() => setIsUpdateDialogOpen(false)}
      pos={posData}
    />
  </div>;
}