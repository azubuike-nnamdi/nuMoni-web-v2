import Reward from "@/components/reward";
import LoadingSkeleton from "@/components/reward/loading-skeleton";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Reward Table",
  description: "Redeem your reward points at participating merchants across different categories, nationwide",
};

export default function Page() {
  return <Suspense fallback={<LoadingSkeleton />}>
    <Reward />
  </Suspense>;
}