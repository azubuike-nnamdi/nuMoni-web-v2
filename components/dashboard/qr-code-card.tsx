import { PrintableQRCode, QRCodeActions, QRCodeDisplay } from "@/components/common/qr-code";
import { qrCode } from "@/constant/images";
import { downloadQRCodeAsImage } from "@/lib/helper";
import { QRCodeCardProps } from "@/lib/types";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Skeleton } from "../ui/skeleton";


export default function QRCodeCard({
  qrCodeUrl = qrCode,
  title = "Brand's QR Code",
  description = "Print your store's QR code and display it for customers. They can scan to make quick transfers.",
  onDownload,
  onShare,
  isLoading,
  isError,
  error
}: Readonly<QRCodeCardProps>) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrintAndDownload = useReactToPrint({
    contentRef: printRef,
    documentTitle: `${title} - QR Code`,
    onAfterPrint: () => {
      console.log('QR Code printed successfully');
    },
  });

  if (isLoading) {
    return (
      <section className="shadow-none border-none rounded-2xl p-4 bg-[#FAFAFA]">
        <div className="flex flex-col items-center text-center">
          <Skeleton className="rounded-full w-30 h-30" />
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="border border-gray-100 shadow-none rounded-xl sm:rounded-2xl p-3 sm:p-4">
        <div className="flex flex-col items-center text-center">
          <div className="text-red-500 text-sm mb-2">
            Failed to load QR code
          </div>
          <div className="text-xs text-gray-500">
            {error?.message || "Something went wrong"}
          </div>
        </div>
      </section>
    );
  }

  const handleDownloadAsImage = async () => {
    try {
      await downloadQRCodeAsImage(printRef, title);
    } catch (error) {
      console.error('Error downloading QR code as image:', error);
      // Fallback to print if image download fails
      handlePrintAndDownload();
    }
  };

  const handleDownloadAction = () => {
    if (onDownload) {
      onDownload();
    } else {
      // Default behavior: download as image
      handleDownloadAsImage();
    }
  };

  const handleShareAction = () => {
    if (onShare) {
      onShare();
    } else {
      // Default behavior: print
      handlePrintAndDownload();
    }
  };

  return (
    <>
      {/* Hidden printable content */}
      <div ref={printRef} className="hidden print:block">
        <PrintableQRCode
          value={qrCodeUrl}
          title={title}
          description={description}
          size={300}
        />
      </div>

      {/* Visible card */}
      <section className="border border-gray-100 shadow-none rounded-xl sm:rounded-2xl p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4">
          <div className="rounded-lg shrink-0 w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 lg:w-44 lg:h-44 xl:w-48 xl:h-48">
            <QRCodeDisplay
              value={qrCodeUrl || ""}
              size={180}
            />
          </div>
          <div className="text-center sm:text-left flex-1">
            <h3 className="text-sm sm:text-md lg:text-md font-semibold text-gray-900 mb-1 sm:mb-2">{title}</h3>
            <p className="text-xs sm:text-sm lg:text-md text-gray-600 leading-relaxed">
              {description}
            </p>
          </div>
        </div>
        <hr className="border-gray-50 my-3 sm:my-4" />
        <QRCodeActions
          onDownload={handleDownloadAction}
          onPrint={handleShareAction}
        />
      </section>
    </>
  );
}
