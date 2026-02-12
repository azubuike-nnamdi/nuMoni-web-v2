import { extractErrorMessage } from "@/lib/helper";
import { Transaction } from "@/lib/types";
import { ErrorState } from "../ui/error-state";
import LoadingSpinner from "../ui/loading-spinner";
import TransactionItem from "./transaction-item";

interface TransactionListProps {
  transactionData: Transaction[] | undefined;
  isPending: boolean;
  isError: boolean;
  error: Error | null;
}

export default function TransactionList({ transactionData, isPending, isError, error }: Readonly<TransactionListProps>) {
  if (isError) {
    return <ErrorState title="Error loading transactions" message={extractErrorMessage(error)} />;
  }

  if (isPending) {
    return <LoadingSpinner message="Loading transactions..." />;
  }

  if (!transactionData?.length) {
    return <p className="p-4 text-center text-gray-500">No transactions found for the selected date range</p>;
  }

  return (
    <>
      {transactionData.map((transaction, index) => (
        <TransactionItem
          key={transaction.transactionViewId}
          transaction={transaction}
          isLast={index === transactionData.length - 1}
        />
      ))}
    </>
  );
}
