import { CustomerSectionProps } from "@/lib/types";
import CustomerCard from "./customer-card";

export default function CustomerSection({ title, customers }: Readonly<CustomerSectionProps>) {
  return (
    <div>
      <h2 className="text-base sm:text-lg font-semibold text-black/50 mb-3 sm:mb-4">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {customers.map((customer, index) => (
          <CustomerCard
            key={customer.customerId}
            customer={customer}
            rank={customer.rank || index + 1}
          />
        ))}
      </div>
    </div>
  );
}
