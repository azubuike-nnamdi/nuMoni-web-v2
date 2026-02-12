'use client';

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon, ChevronDownIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export type DateRangeOption = 'Today' | 'Yesterday' | 'This Week' | 'This Month' | 'Last Month' | 'Custom Range' | 'All Time' | null;

interface DateRangeSelectorProps {
  value: DateRangeOption;
  onValueChange: (option: DateRangeOption) => void;
  onDatesChange?: (startDate: Date | undefined, endDate: Date | undefined) => void;
  placeholder?: string;
  showAllTime?: boolean;
  showCustomRange?: boolean;
  className?: string;
  disabled?: boolean;
}

export function DateRangeSelector({
  value,
  onValueChange,
  onDatesChange,
  placeholder = 'Select Date Range',
  showAllTime = false,
  showCustomRange = false,
  className,
  disabled = false,
}: Readonly<DateRangeSelectorProps>) {
  const [popoverOpen, setPopoverOpen] = useState(false);

  // Committed dates (synced with parent)
  const [customStartDate, setCustomStartDate] = useState<Date | undefined>();
  const [customEndDate, setCustomEndDate] = useState<Date | undefined>();

  // Modal state
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [tempStartDate, setTempStartDate] = useState<Date | undefined>();
  const [tempEndDate, setTempEndDate] = useState<Date | undefined>();

  // Popovers inside modal
  const [startDatePopoverOpen, setStartDatePopoverOpen] = useState(false);
  const [endDatePopoverOpen, setEndDatePopoverOpen] = useState(false);

  const handleOptionChange = useCallback((option: DateRangeOption) => {
    setPopoverOpen(false);

    if (option === 'Custom Range' && showCustomRange) {
      // Initialize temp dates with current committed dates
      setTempStartDate(customStartDate);
      setTempEndDate(customEndDate);
      setShowCustomModal(true);
      // We don't call onValueChange yet to avoid triggering redundant fetches
      // until user applies dates. 
      // However, the UI needs to show "Custom Range" is selected or about to be.
      // Ideally we only switch value when Apply is hit, OR we switch it but the fetch is disabled (which we handled in parent).
      // Let's call it to update the dropdown label, trusting the parent's enabled logic.
      onValueChange(option);
    } else {
      onValueChange(option);
    }
  }, [onValueChange, showCustomRange, customStartDate, customEndDate]);

  const handleApplyCustomDates = () => {
    setCustomStartDate(tempStartDate);
    setCustomEndDate(tempEndDate);
    setShowCustomModal(false);
  };

  const handleCancelCustomDates = () => {
    setShowCustomModal(false);
    // If we cancelled and had no valid dates set previously, maybe we should revert the selection?
    // But keeping "Custom Range" selected with no dates is fine given our "enabled" logic in parent.
  };

  // Notify parent of date changes when custom dates are commited
  useEffect(() => {
    if (showCustomRange && value === 'Custom Range' && onDatesChange) {
      onDatesChange(customStartDate, customEndDate);
    }
  }, [customStartDate, customEndDate, value, showCustomRange, onDatesChange]);

  // Reset custom dates when switching away from Custom Range
  useEffect(() => {
    if (value !== 'Custom Range') {
      setCustomStartDate(undefined);
      setCustomEndDate(undefined);
      // Also notify parent to reset its dates
      if (onDatesChange) {
        onDatesChange(undefined, undefined);
      }
    }
  }, [value, onDatesChange]);

  const options: Array<{ value: DateRangeOption; label: string }> = [
    ...(showAllTime ? [{ value: null as DateRangeOption, label: 'Today' }] : []),
    { value: 'Today' as DateRangeOption, label: 'Today' },
    { value: 'Yesterday' as DateRangeOption, label: 'Yesterday' },
    { value: 'This Week' as DateRangeOption, label: 'This Week' },
    { value: 'This Month' as DateRangeOption, label: 'This Month' },
    { value: 'Last Month' as DateRangeOption, label: 'Last Month' },
    ...(showCustomRange ? [{ value: 'Custom Range' as DateRangeOption, label: 'Custom Range' }] : []),
  ];

  return (
    <div className={className}>
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start text-left font-normal gap-2 p-5 shadow-none"
            disabled={disabled}
          >
            <span>{value || placeholder}</span>
            <ChevronDownIcon className="h-4 w-4 ml-auto" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-38 p-1 shadow-none">
          {options.map((option) => (
            <button
              key={option.value || 'null'}
              className={`px-3 py-2 text-sm cursor-pointer rounded-md transition-colors w-full text-left ${value === option.value
                ? 'bg-gray-100 font-medium'
                : 'hover:bg-gray-100'
                }`}
              onClick={() => handleOptionChange(option.value)}
            >
              {option.label}
            </button>
          ))}
        </PopoverContent>
      </Popover>

      <Dialog open={showCustomModal} onOpenChange={setShowCustomModal}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Select Date Range</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <label htmlFor="start-date" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Start Date
              </label>
              <Popover open={startDatePopoverOpen} onOpenChange={setStartDatePopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !tempStartDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {tempStartDate ? format(tempStartDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={tempStartDate}
                    onSelect={(date) => {
                      setTempStartDate(date);
                      setStartDatePopoverOpen(false);
                      // Reset end date if it's before start date
                      if (tempEndDate && date && date > tempEndDate) {
                        setTempEndDate(undefined);
                      }
                    }}
                    initialFocus
                    disabled={(date) =>
                      date > new Date() ||
                      (tempEndDate ? date > tempEndDate : false)
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <label htmlFor="end-date" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                End Date
              </label>
              <Popover open={endDatePopoverOpen} onOpenChange={setEndDatePopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !tempEndDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {tempEndDate ? format(tempEndDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={tempEndDate}
                    onSelect={(date) => {
                      setTempEndDate(date);
                      setEndDatePopoverOpen(false);
                    }}
                    initialFocus
                    disabled={(date) =>
                      date > new Date() ||
                      (tempStartDate ? date < tempStartDate : false)
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelCustomDates}>Cancel</Button>
            <Button onClick={handleApplyCustomDates} disabled={!tempStartDate || !tempEndDate} className="bg-theme-dark-green disabled:bg-theme-dark-green">Apply</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

