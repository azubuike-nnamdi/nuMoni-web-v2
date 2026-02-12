"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

export type SummaryDateRangeOption =
  | "Today"
  | "Yesterday"
  | "This Week"
  | "This Month"
  | "Last Month";

interface SummaryDateRangeFilterProps {
  selectedRange: SummaryDateRangeOption;
  onRangeChange: (range: SummaryDateRangeOption) => void;
}

export default function SummaryDateRangeFilter({
  selectedRange,
  onRangeChange,
}: Readonly<SummaryDateRangeFilterProps>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="shadow-none">
        <Button variant="outline" className="gap-2">
          {selectedRange}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuItem onClick={() => onRangeChange("Today")}>
          Today
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onRangeChange("Yesterday")}>
          Yesterday
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onRangeChange("This Week")}>
          This Week
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onRangeChange("This Month")}>
          This Month
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onRangeChange("Last Month")}>
          Last Month
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
