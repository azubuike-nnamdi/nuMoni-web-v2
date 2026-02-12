'use client';

import EmptyState from "@/components/common/empty-state";
import useGetAllDeals from "@/hooks/query/useGetAllDeals";
import { extractErrorMessage } from "@/lib/helper";
import { Button } from "../ui/button";
import { ErrorState } from "../ui/error-state";
import LoadingSpinner from "../ui/loading-spinner";

export default function Deals() {
  const { data, isPending, isError, error } = useGetAllDeals();

  if (isPending) {
    return <LoadingSpinner message="Loading deals..." />;
  }
  if (isError) {
    return <ErrorState title="Error loading deals" message={extractErrorMessage(error)} />;
  }

  const dealsData = data?.data?.data;

  // Check if there's no data
  if (!dealsData || dealsData.totalRows === 0 || dealsData.pageData?.length === 0) {
    return (
      <main>
        <Button
          className="bg-theme-dark-green hover:bg-theme-green text-white rounded-lg p-6 flex items-center gap-2 shadow-sm cursor-pointer"
        >
          + Add Deal
        </Button>
        <EmptyState
          title="No Deals Available"
          description="There are currently no deals and promotions available. Check back later for exciting offers!"
        />
      </main>
    );
  }

  return <div>Deals</div>;
}