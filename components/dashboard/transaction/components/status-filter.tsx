'use client';

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

export type StatusOption = 'All' | 'SUCCESSFUL' | 'COMPLETED' | 'PENDING' | 'FAILED' | 'CANCELLED';

interface StatusFilterProps {
  selectedStatus: StatusOption;
  onStatusChange: (status: StatusOption) => void;
}

export default function StatusFilter({ selectedStatus, onStatusChange }: Readonly<StatusFilterProps>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          Status: {selectedStatus}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuItem onClick={() => onStatusChange('All')}>
          All
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onStatusChange('COMPLETED')}>
          Completed
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onStatusChange('SUCCESSFUL')}>
          Successful
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onStatusChange('PENDING')}>
          Pending
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onStatusChange('FAILED')}>
          Failed
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onStatusChange('CANCELLED')}>
          Cancelled
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

