import Transaction from "@/components/dashboard/transaction";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: "Transactions ",
  description: "Transactions",
};

export default function Page() {
  return <Transaction />;
}