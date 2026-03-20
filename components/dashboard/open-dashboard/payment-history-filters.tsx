'use client';

import { DateRangeOption, DateRangeSelector } from "@/components/ui/date-range-selector";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

export type FilterType = 'customerEmail' | 'customerPhoneNo' | 'customerId';

export interface PaymentHistoryFiltersState {
  filterType: FilterType;
  searchValue: string;
  debouncedSearchValue: string;
  dateRangeOption: DateRangeOption;
  customStartDate?: Date;
  customEndDate?: Date;
}

interface PaymentHistoryFiltersProps {
  onFiltersChange: (filters: PaymentHistoryFiltersState) => void;
}

export function PaymentHistoryFilters({ onFiltersChange }: Readonly<PaymentHistoryFiltersProps>) {
  const [filterType, setFilterType] = useState<FilterType>('customerEmail');
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearchValue, setDebouncedSearchValue] = useState("");
  const [dateRangeOption, setDateRangeOption] = useState<DateRangeOption>('Today');
  const [customStartDate, setCustomStartDate] = useState<Date | undefined>();
  const [customEndDate, setCustomEndDate] = useState<Date | undefined>();

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchValue(searchValue);
    }, 600);
    return () => clearTimeout(handler);
  }, [searchValue]);

  // Propagate changes
  useEffect(() => {
    onFiltersChange({
      filterType,
      searchValue,
      debouncedSearchValue,
      dateRangeOption,
      customStartDate,
      customEndDate
    });
  }, [filterType, searchValue, debouncedSearchValue, dateRangeOption, customStartDate, customEndDate, onFiltersChange]);

  const getPlaceholder = () => {
    switch (filterType) {
      case 'customerEmail': return "Enter customer email";
      case 'customerPhoneNo': return "Enter customer phone number";
      case 'customerId': return "Enter customer ID";
      default: return "Search...";
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 my-4">
      <div className="flex-1 flex gap-2">
        <Select value={filterType} onValueChange={(v) => {
          setFilterType(v as FilterType);
          setSearchValue("");
        }}>
          <SelectTrigger className="w-[180px] h-11 bg-gray-50/50 border-gray-100 shadow-none text-sm font-medium">
            <SelectValue placeholder="Filter by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="customerEmail">Customer Email</SelectItem>
            <SelectItem value="customerPhoneNo">Phone Number</SelectItem>
            <SelectItem value="customerId">Customer ID</SelectItem>
          </SelectContent>
        </Select>

        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder={getPlaceholder()}
            className="pl-10 h-11 bg-gray-50/50 border-gray-100 shadow-none focus-visible:ring-emerald-500 rounded-lg text-sm"
          />
        </div>
      </div>

      <div className="w-full md:w-[280px]">
        <DateRangeSelector
          value={dateRangeOption}
          onValueChange={setDateRangeOption}
          onDatesChange={(start, end) => {
            setCustomStartDate(start ?? undefined);
            setCustomEndDate(end ?? undefined);
          }}
          showCustomRange
        />
      </div>
    </div>
  );
}
