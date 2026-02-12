"use client";

import { formatCurrency, getStatusColor, getStatusText } from "@/lib/helper";
import { Branch } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";

interface BranchSummaryCardProps {
  data: Branch;
}

export default function BranchSummaryCard({ data }: Readonly<BranchSummaryCardProps>) {
  const { name, merchantId, logo, status, totalAmountRecieved, totalPayout, fees } = data;

  return (
    <div
      className="bg-[#FAFAFA] rounded-2xl shadow-none border border-gray-100 p-6 duration-200 cursor-pointer  transition-all"
    >
      {/* Merchant Information Section */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          {/* Merchant Logo */}
          <div className="w-[50px] h-[50px] rounded-full overflow-hidden shrink-0 bg-gray-100 flex items-center justify-center">
            {logo && logo.trim() !== '' ? (
              <Image
                src={logo}
                alt={`${name} logo`}
                width={50}
                height={50}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs font-medium">
                {name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Merchant Details */}
          <div>
            <Link href={`/dashboard/branch-level/${data.branchId}/?branchName=${data.name}`}>
              <h3 className="sm:text-lg text-base font-semibold text-gray-900 mb-1 hover:text-theme-dark-green">
                {name}
              </h3>
            </Link>
            <p className="text-sm text-gray-600">
              Merchant ID: <span className="text-green-600 font-medium">{merchantId}</span>
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>
          {getStatusText(status)}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100 mb-4"></div>

      <div className="bg-white rounded-2xl p-4">
        {/* Branch Information Header */}
        <div className="mb-4">
          <h4 className="text-base font-semibold text-gray-900">
            Branch Information
          </h4>
        </div>

        {/* Branch Details */}
        <div className="space-y-3">


          {/* Total Amount Received */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-1 h-6 bg-theme-dark-green rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">Allocated Budget</span>
            </div>
            <span className="text-sm font-semibold text-gray-900">
              {formatCurrency(totalAmountRecieved || 0)}
            </span>
          </div>

          {/* Total Payout */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-1 h-6 bg-red-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">Amount Spent</span>
            </div>
            <span className="text-sm font-semibold text-gray-900">
              {formatCurrency(totalPayout || 0)}
            </span>
          </div>

          {/* Fees */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-1 h-6 bg-theme-gray-600 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">Fees</span>
            </div>
            <span className="text-sm font-semibold text-gray-900">
              {formatCurrency(fees || 0)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}