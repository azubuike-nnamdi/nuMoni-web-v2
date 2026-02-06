"use client";

import { MerchantInfo } from "@/lib/types";
import { Building2, Check, Copy, CreditCard, User } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function MerchantBankInformation({
  merchantInfo,
}: Readonly<{ merchantInfo: MerchantInfo }>) {
  const pathname = usePathname();
  const [copied, setCopied] = useState(false);

  // Don't show on branch-level routes
  if (pathname?.includes("branch-level")) {
    return null;
  }

  // Don't show if no bank information
  if (!merchantInfo?.bankInformation || merchantInfo.bankInformation.length === 0) {
    return null;
  }

  // Get primary bank or first bank
  const primaryBank = merchantInfo.bankInformation.find(bank => bank.primary) || merchantInfo.bankInformation[0];

  const handleCopyAccountNumber = async () => {
    if (!primaryBank?.accountNo) return;

    try {
      await navigator.clipboard.writeText(primaryBank.accountNo);
      setCopied(true);
      toast.success("Account number copied to clipboard!");

      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy account number:", error);
      toast.error("Failed to copy account number");
    }
  };

  return (
    <div className="shadow-none border-none p-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-1">Bank Accounts</h3>
      <p className="text-xs text-gray-600 mb-4">
        Manage your registered bank accounts for receiving payments.
      </p>

      <div className="space-y-3 border border-gray-100 rounded-2xl p-3">
        {/* Primary Account Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-blue-600" />
            <p className="text-xs text-gray-600">Primary Account</p>
          </div>
          <span className="px-2 py-1 bg-blue-600 text-white text-[10px] font-medium rounded-full">
            Primary
          </span>
        </div>
        <hr className="border-gray-50" />

        {/* Bank Name */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-gray-500" />
            <p className="text-xs text-gray-600">Bank Name</p>
          </div>
          <p className="text-xs font-medium text-gray-900 text-right">
            {primaryBank?.bankname || 'N/A'}
          </p>
        </div>
        <hr className="border-gray-50" />

        {/* Account Number */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-gray-500" />
            <p className="text-xs text-gray-600">Account Number</p>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-gray-900">
              {primaryBank?.accountNo || 'N/A'}
            </p>
            {primaryBank?.accountNo && (
              <button
                onClick={handleCopyAccountNumber}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
                aria-label="Copy account number"
                title="Copy account number"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-500" />
                )}
              </button>
            )}
          </div>
        </div>
        <hr className="border-gray-50" />

        {/* Account Holder */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-500" />
            <p className="text-xs text-gray-600">Account Holder</p>
          </div>
          <p className="text-xs font-medium text-gray-900 text-right">
            {primaryBank?.accountHolderName || 'N/A'}
          </p>
        </div>

        {/* Status */}
        {primaryBank?.active !== undefined && (
          <>
            <hr className="border-gray-50" />
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-600">Status</p>
              <span className={`px-2 py-1 text-[10px] font-medium rounded-full ${primaryBank.active
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-700'
                }`}>
                {primaryBank.active ? 'Active' : 'Inactive'}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}