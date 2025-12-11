"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DateSectionProps } from "@/lib/types";
import { cn } from "@/lib/utils";
import { format, isBefore, startOfDay } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

export default function DateSection({ startDate, setStartDate, endDate, setEndDate }: DateSectionProps) {
  // Convert string dates to Date objects for the calendar
  const startDateObj = startDate ? new Date(startDate) : undefined;
  const endDateObj = endDate ? new Date(endDate) : undefined;

  // Handle date selection and convert to ISO string
  const handleStartDateSelect = (date: Date | undefined) => {
    if (date) {
      setStartDate(date.toISOString());
    } else {
      setStartDate("");
    }
  };

  const handleEndDateSelect = (date: Date | undefined) => {
    if (date) {
      setEndDate(date.toISOString());
    } else {
      setEndDate("");
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Start Issuing Reward From */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-900">
          Start Issuing Reward From <span className="text-red-500">*</span>
        </label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              data-empty={!startDateObj}
              className={cn(
                "w-full py-6 mt-2 justify-start text-left font-normal",
                !startDateObj && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {startDateObj ? format(startDateObj, "PPP") : <span>Pick a start date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={startDateObj}
              onSelect={handleStartDateSelect}
              disabled={(date) => {
                const today = startOfDay(new Date());
                const dateToCheck = startOfDay(date);
                return isBefore(dateToCheck, today);
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Close Reward On */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-900">Close Reward On</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              data-empty={!endDateObj}
              className={cn(
                "w-full py-6 mt-2 justify-start text-left font-normal",
                !endDateObj && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {endDateObj ? format(endDateObj, "PPP") : <span>Pick an end date (optional)</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={endDateObj}
              onSelect={handleEndDateSelect}
              disabled={(date) => {
                // Disable dates before today and before start date
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const startDateMin = startDateObj || today;
                return date < startDateMin;
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
