"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CheckIcon, ChevronDownIcon, ChevronsUpDownIcon } from "lucide-react";
import { useState } from "react";

interface FilterDropdownProps {
  options: string[];
  value: string;
  onValueChange: (value: string) => void;
  searchPlaceholder?: string;
  enableSearch?: boolean;
  buttonClassName?: string;
  contentClassName?: string;
  showCustomRange?: boolean;
  onCustomRangeClick?: () => void;
}

export default function FilterDropdown({
  options,
  value,
  onValueChange,
  searchPlaceholder,
  enableSearch = false,
  buttonClassName = "",
  contentClassName = "",
  showCustomRange = false,
  onCustomRangeClick,
}: FilterDropdownProps) {
  const [open, setOpen] = useState(false);

  const handleSelect = (selectedValue: string) => {
    if (selectedValue === "Custom Range" && onCustomRangeClick) {
      onCustomRangeClick();
      setOpen(false);
    } else {
      onValueChange(selectedValue);
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full sm:w-[260px] justify-between px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-black bg-white border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-theme-dark-green-700",
            buttonClassName
          )}
        >
          <span className="truncate">{value}</span>
          <ChevronsUpDownIcon className="ml-2 h-3 w-3 sm:h-4 sm:w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn("w-[200px] sm:w-[250px] p-0", contentClassName)}>
        <Command>
          {enableSearch && searchPlaceholder && (
            <CommandInput placeholder={searchPlaceholder} className="h-8 text-sm" />
          )}
          <CommandList>
            <CommandEmpty>No option found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option}
                  value={option}
                  onSelect={() => handleSelect(option)}
                  className={cn(
                    "text-xs sm:text-sm",
                    option === "Custom Range" ? "flex items-center justify-between" : ""
                  )}
                >
                  <div className="flex items-center">
                    <CheckIcon
                      className={cn(
                        "mr-2 h-3 w-3 sm:h-4 sm:w-4",
                        value === option ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <span className="truncate">{option}</span>
                  </div>
                  {option === "Custom Range" && showCustomRange && (
                    <ChevronDownIcon className="h-3 w-3 sm:h-4 sm:w-4 -rotate-90]" />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
