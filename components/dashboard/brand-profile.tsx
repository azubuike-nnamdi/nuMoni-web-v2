import { Button } from "@/components/ui/button";
import { blueVerifiedIcon, rightArrowIcon } from "@/constant/icons";
import { BrandProfileProps } from "@/lib/types";
import Image from "next/image";
import { Skeleton } from "../ui/skeleton";



export default function BrandProfile({
  brandName = "",
  merchantId = "",
  logoUrl = "",
  isLoading,
  isError,
  error,
  onAccountSettings,
  isVerified = false
}: BrandProfileProps) {

  if (isLoading) {
    return (
      <section className="shadow-none border-none rounded-2xl p-4 bg-[#FAFAFA]">
        <div className="flex flex-col items-center text-center">
          {/* Logo skeleton */}
          <div className=" rounded-full p-3 mb-3 w-30 h-30">
            <Skeleton className="rounded-full w-30 h-30" />
          </div>

          {/* Brand name skeleton */}
          <div className="flex items-center gap-2 mb-1">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="w-4 h-4 rounded-full" />
          </div>

          {/* Merchant ID skeleton */}
          <Skeleton className="h-4 w-40 mb-4" />

          {/* Button skeleton */}
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="shadow-none border-none rounded-2xl p-4 bg-[#FAFAFA]">
        <div className="flex flex-col items-center text-center">
          <div className="text-red-500 text-sm mb-2">
            Failed to load brand profile
          </div>
          <div className="text-xs text-gray-500">
            {error?.message || "Something went wrong"}
          </div>
        </div>
      </section>
    );
  }
  return (
    <section className="shadow-none border-none rounded-2xl p-4 bg-[#FAFAFA]">
      <div className="flex flex-col items-center text-center">
        {logoUrl && (
          <div className=" rounded-full p-3 mb-3 w-40 h-40 flex items-center justify-center overflow-hidden">
            <Image
              src={logoUrl}
              alt={brandName}
              width={60}
              height={60}
              className="rounded-full object-cover w-full h-full"
            />
          </div>
        )}
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-lg font-bold text-gray-900">{brandName}</h2>
          {isVerified && (
            <Image src={blueVerifiedIcon} alt="verified-badge" width={16} height={16} />
          )}
        </div>
        <p className="text-xs text-gray-600 mb-4">
          Merchant ID: <span className="text-green-600 font-medium">{merchantId}</span>
        </p>
        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2 border-gray-300 hover:bg-gray-50 text-sm py-2"
          onClick={onAccountSettings}
        >
          Account Settings
          <Image src={rightArrowIcon} alt="arrow-right" width={16} height={16} />
        </Button>
      </div>
    </section>
  );
}
