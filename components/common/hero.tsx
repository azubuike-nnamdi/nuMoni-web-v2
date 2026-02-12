'use client';

import useGetMerchant from "@/hooks/query/useGetMerchant";
import { cleanS3Url } from "@/lib/helper";
import { DashboardProps } from "@/lib/types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import BrandProfile from "../dashboard/brand-profile";
import BrandSummary from "../dashboard/brand-summary";
import MainBranchSummary from "../dashboard/main-branch-summary";
import MerchantBankInformation from "../dashboard/merchant-bank-information";
import QRCodeCard from "../dashboard/qr-code-card";


export default function Hero({
  qrTitle = "Brand's QR Code",
  qrDescription = "Print your store's QR code and display it for customers. They can scan to make quick transfers.",
  summaryContent,
  onAccountSettings,
  onDownload,
  onShare
}: Readonly<DashboardProps>) {
  const pathname = usePathname();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const { data: merchant, isPending, isError, error } = useGetMerchant();
  const merchantInfo = merchant?.data?.data;

  // Merchant is verified if all three verification fields are true
  const isVerified = merchantInfo?.verifiedNin === true &&
    merchantInfo?.verifiedTin === true &&
    merchantInfo?.verifiedCac === true;

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      checkScrollButtons();
      container.addEventListener('scroll', checkScrollButtons);
      window.addEventListener('resize', checkScrollButtons);

      return () => {
        container.removeEventListener('scroll', checkScrollButtons);
        window.removeEventListener('resize', checkScrollButtons);
      };
    }
  }, [merchantInfo]);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -300,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 300,
        behavior: 'smooth'
      });
    }
  };

  // Determine which summary component to show based on route
  // const getSummaryComponent = () => {
  //   if (pathname.includes("branch-level")) {
  //     return <MainBranchSummary />;
  //   }
  //   return summaryContent || (
  //     <>
  //       <BrandSummary />
  //       <MerchantBankInformation merchantInfo={merchantInfo} />
  //     </>
  //   );
  // };

  return (
    <div className="bg-white rounded-2xl p-4 relative">
      {/* Left Arrow */}
      {canScrollLeft && (
        <button
          onClick={scrollLeft}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-300 rounded-full p-2 shadow-md hover:bg-gray-50 transition-colors"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-5 w-5 text-gray-700" />
        </button>
      )}

      {/* Right Arrow */}
      {canScrollRight && (
        <button
          onClick={scrollRight}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-300 rounded-full p-2 shadow-md hover:bg-gray-50 transition-colors"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-5 w-5 text-gray-700" />
        </button>
      )}

      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto items-stretch [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        <div className="min-w-[380px] shrink-0 flex">
          <div className="w-full h-full">
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
          </div>
        </div>

        <div className="w-[380px] shrink-0 flex">
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
        </div>

        {pathname.includes("branch-level") ? (
          <div className="min-w-[380px] shrink-0 flex">
            <div className="w-full h-full">
              <MainBranchSummary />
            </div>
          </div>
        ) : (
          <>
            <div className="min-w-[380px] shrink-0 flex">
              <div className="w-full h-full">
                {summaryContent || <BrandSummary minimumThreshold={merchantInfo?.minimumThreshold} />}
              </div>
            </div>

            <div className="min-w-[280px] shrink-0 flex">
              <div className="w-full h-full">
                <MerchantBankInformation merchantInfo={merchantInfo} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}