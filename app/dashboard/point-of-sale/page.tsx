import PointOfSale from "@/components/dashboard/point-of-sale";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: "Point of Sale",
  description: "Point of Sale",
};

export default function Page() {
  return <PointOfSale />;
}