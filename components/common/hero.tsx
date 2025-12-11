'use client';

import useGetMerchant from "@/hooks/query/useGetMerchant";
import { cleanS3Url } from "@/lib/helper";
import { DashboardProps } from "@/lib/types";
import { usePathname } from "next/navigation";
import BrandProfile from "../dashboard/brand-profile";
import BrandSummary from "../dashboard/brand-summary";
import MainBranchSummary from "../dashboard/main-branch-summary";
import QRCodeCard from "../dashboard/qr-code-card";


export default function Hero({
  qrTitle = "Brand's QR Code",
  qrDescription = "Print your store's QR code and display it for customers. They can scan to make quick transfers.",
  summaryContent,
  onAccountSettings,
  onDownload,
  onShare
}: DashboardProps) {
  const pathname = usePathname();

  const { data: merchant, isPending, isError, error } = useGetMerchant();
  const merchantInfo = merchant?.data?.data;



  // Merchant is verified if all three verification fields are true
  const isVerified = merchantInfo?.verifiedNin === true &&
    merchantInfo?.verifiedTin === true &&
    merchantInfo?.verifiedCac === true;

  // Determine which summary component to show based on route
  const getSummaryComponent = () => {
    if (pathname.includes("branch-level")) {
      return <MainBranchSummary />;
    }
    return summaryContent || <BrandSummary />;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 bg-white rounded-2xl p-4">
      <BrandProfile
        brandName={merchantInfo?.businessName}
        merchantId={merchantInfo?.merchantId}
        logoUrl={merchantInfo?.businessImagePath}
        onAccountSettings={onAccountSettings}
        isLoading={isPending}
        isError={isError}
        error={error}
        isVerified={isVerified}
      />

      <QRCodeCard
        qrCodeUrl={cleanS3Url(merchantInfo?.qrCode)}
        title={qrTitle}
        description={qrDescription}
        onDownload={onDownload}
        onShare={onShare}
        isLoading={isPending}
        isError={isError}
        error={error}
      />

      {getSummaryComponent()}
    </div>
  );
}