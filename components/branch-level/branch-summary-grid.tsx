"use client";

import { Branch } from "@/lib/types";
import BranchSummaryCard from "./branch-summary-card";

interface BranchSummaryGridProps {
  branches?: Branch[];
}

export default function BranchSummaryGrid({ branches }: Readonly<BranchSummaryGridProps>) {


  // Handle case where branches is undefined or not an array
  if (!branches || !Array.isArray(branches)) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <p className="text-gray-500">No branches available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Branch Summary</h2>
        <p className="text-sm text-gray-600">
          {branches.length} branches found
        </p>
      </div> */}

      <div className="grid grid-cols-1 md:grid-cols-2  gap-6">
        {branches.map((branch) => (
          <BranchSummaryCard key={branch.branchId} data={branch} />
        ))}
      </div>
    </div>
  );
}
