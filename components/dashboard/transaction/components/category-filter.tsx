'use client';

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

export type CategoryOption = 'All' | 'direct transfer' | 'service fee' | 'pay out' | 'direct transfer reward' | 'deal purchase' | 'deal purchase reward' | 'issues' | 'redeem';

interface CategoryFilterProps {
  selectedCategory: CategoryOption;
  onCategoryChange: (category: CategoryOption) => void;
}

export default function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  const formatCategoryLabel = (category: CategoryOption): string => {
    if (category === 'All') return 'All';
    return category
      ?.split(' ')
      ?.map(word => word.charAt(0).toUpperCase() + word.slice(1))
      ?.join(' ');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          Category: {formatCategoryLabel(selectedCategory)}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuItem onClick={() => onCategoryChange('All')}>
          All
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onCategoryChange('direct transfer')}>
          Direct Transfer
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onCategoryChange('service fee')}>
          Service Fee
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onCategoryChange('pay out')}>
          Pay Out
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onCategoryChange('direct transfer reward')}>
          Direct Transfer Reward
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onCategoryChange('deal purchase')}>
          Deal Purchase
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onCategoryChange('deal purchase reward')}>
          Deal Purchase Reward
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onCategoryChange('issues')}>
          Issues
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onCategoryChange('redeem')}>
          Redeem
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

