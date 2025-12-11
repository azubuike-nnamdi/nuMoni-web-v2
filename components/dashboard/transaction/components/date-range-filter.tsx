'use client';

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DateRangeOption } from "../utils/date-range-utils";
import { ChevronDown } from "lucide-react";

interface DateRangeFilterProps {
  selectedRange: DateRangeOption;
  onRangeChange: (range: DateRangeOption) => void;
}

export default function DateRangeFilter({ selectedRange, onRangeChange }: DateRangeFilterProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          {selectedRange}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuItem onClick={() => onRangeChange('Today')}>
          Today
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onRangeChange('Yesterday')}>
          Yesterday
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onRangeChange('This Week')}>
          This Week
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onRangeChange('This Month')}>
          This Month
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onRangeChange('Last Month')}>
          Last Month
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onRangeChange('All Time')}>
          All Time
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onRangeChange('Custom Duration')}>
          Custom Duration
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

