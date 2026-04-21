'use client';

import { Skeleton } from "@/components/ui/skeleton";

export function PaymentHistoryLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {["sk1", "sk2", "sk3", "sk4", "sk5", "sk6"].map((id) => (
        <div key={id} className="bg-white rounded-xl p-6 border border-gray-100">
          <Skeleton className="h-10 w-10 rounded-lg mb-4" />
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-8 w-32" />
        </div>
      ))}
    </div>
  );
}
