'use client';

import EmptyState from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/ui/error-state";
import LoadingSpinner from "@/components/ui/loading-spinner";
import useGetAllPos from "@/hooks/query/useGetAllPos";
import { PointOfSaleData } from "@/lib/types";
import { Plus } from "lucide-react";
import { useState } from "react";
import AddPOSDialog from "./add-pos-dialog";
import PointOfSaleTable from "./point-of-sale-table";

export default function PointOfSale() {
  const [isAddPOSOpen, setIsAddPOSOpen] = useState(false);
  const { data, isPending, isError, error } = useGetAllPos();

  if (isPending) {
    return <LoadingSpinner size="lg" message="Loading point of sale..." />;
  }

  if (isError) {
    return <ErrorState title="Error loading data" message={error?.message || "An error occurred while loading point of sale."} />;
  }

  const posData: PointOfSaleData[] = data?.data?.data;

  if (posData?.length === 0) {
    return <EmptyState
      title="No Point of Sale Available"
      description="There are currently no point of sale available. Check back later for exciting offers!"
    />;
  }

  return <main>
    <section className="flex justify-between items-center px-1">
      <h1 className="text-2xl font-bold">POS Management</h1>
      <Button
        onClick={() => setIsAddPOSOpen(true)}
        className="bg-theme-dark-green hover:bg-theme-dark-green/90 text-white px-12 py-6 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Plus /> Add POS
      </Button>
    </section>

    <PointOfSaleTable data={posData} title="POS List" />

    <AddPOSDialog
      isOpen={isAddPOSOpen}
      onClose={() => setIsAddPOSOpen(false)}
    />
  </main>;
}