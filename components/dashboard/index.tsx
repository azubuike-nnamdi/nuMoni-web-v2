'use client';

import Hero from "../common/hero";
import PointsDistribution from "./points-distribution";

export default function Dashboard() {
  // const { data: pointsRedeemedData, isPending: isPendingPointsRedeemed, isError: isErrorPointsRedeemed, error: errorPointsRedeemed } = useGetPointsRedeemed();

  // console.log('points redeemed', pointsRedeemedData);

  return (
    <main>
      <Hero />
      <PointsDistribution />
    </main>
  );
}