import Transaction from "@/components/dashboard/transaction";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: "Transactions | Dashboard",
  description: "Transactions | Dashboard",
};

export default function Page() {
  return <Transaction />;
}