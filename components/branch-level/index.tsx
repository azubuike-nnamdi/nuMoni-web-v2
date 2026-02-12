"use client";

import Hero from "@/components/common/hero";
import useGetAllBranches from "@/hooks/query/useGetAllBranches";
import LoadingSpinner from "../ui/loading-spinner";
import BranchDashboard from "./branch-dashboard";
import EmptyBranch from "./empty-branch";

export default function BranchLevel() {

  const { data, isPending } = useGetAllBranches();

  const branches = data?.data?.data;


  const isBranch = branches?.length === 0;

  // Show loading state while data is being fetched
  if (isPending) {
    return (
      <main>
        <Hero />
        <LoadingSpinner message="Loading branches..." />
      </main>
    );
  }

  return (
    <main>
      <Hero />
      {isBranch ? <EmptyBranch /> : <BranchDashboard branches={branches} />}
    </main>
  )
}