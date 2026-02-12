"use client";

import LoadingErrorState from "@/components/common/loading-error-state";
import { Button } from "@/components/ui/button";
import {
  DateRangeOption,
  DateRangeSelector,
} from "@/components/ui/date-range-selector";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useExportTransactions from "@/hooks/query/useExportTransactions";
import useGetAllPos from "@/hooks/query/useGetAllPos";
import { extractErrorMessage, getDatesFromRangeOption } from "@/lib/helper";
import {
  ExportTransactionFormData,
  exportTransactionSchema,
} from "@/lib/schemas/export-transaction-schema";
import { PointOfSaleData } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

interface ExportTransactionProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ExportTransaction({
  isOpen,
  onClose,
}: Readonly<ExportTransactionProps>) {
  const {
    isPending: isLoadingPos,
    data: posData,
    error,
    isError,
  } = useGetAllPos();
  const {
    handleExportPosTransaction,
    isPending: isExporting,
    isSuccess,
    reset,
  } = useExportTransactions();

  const todayDates = useMemo(() => getDatesFromRangeOption("Today"), []);
  const [dateRangeOption, setDateRangeOption] =
    useState<DateRangeOption>("Today");
  const [startDate, setStartDate] = useState<Date | undefined>(
    todayDates?.start,
  );
  const [endDate, setEndDate] = useState<Date | undefined>(todayDates?.end);

  // Extract POS list
  const posList = useMemo(() => {
    const allPos = posData?.data?.data as PointOfSaleData[] | undefined;
    return allPos || [];
  }, [posData]);

  const form = useForm<ExportTransactionFormData>({
    resolver: zodResolver(exportTransactionSchema),
    defaultValues: {
      posId: "all",
      transactionType: "SALES",
      startDate: todayDates?.start,
      endDate: todayDates?.end,
    },
  });

  // Handle date range option changes
  const handleDateRangeOptionChange = useCallback(
    (option: DateRangeOption) => {
      setDateRangeOption(option);

      if (option && option !== "Custom Range") {
        const dates = getDatesFromRangeOption(option);
        if (dates) {
          setStartDate(dates.start);
          setEndDate(dates.end);
          form.setValue("startDate", dates.start, {
            shouldValidate: true,
          });
          form.setValue("endDate", dates.end, { shouldValidate: true });
        }
      } else {
        // Reset dates for 'Custom Range' or when option is null
        setStartDate(undefined);
        setEndDate(undefined);
        form.setValue("startDate", undefined, { shouldValidate: true });
        form.setValue("endDate", undefined, { shouldValidate: true });
      }
    },
    [form],
  );

  // Handle custom date changes from DateRangeSelector
  const handleCustomDatesChange = useCallback(
    (customStart: Date | undefined, customEnd: Date | undefined) => {
      if (dateRangeOption === "Custom Range") {
        setStartDate(customStart);
        setEndDate(customEnd);
        if (customStart) {
          form.setValue("startDate", customStart, {
            shouldValidate: true,
          });
        }
        if (customEnd) {
          form.setValue("endDate", customEnd, { shouldValidate: true });
        }
      }
    },
    [dateRangeOption, form],
  );

  const handleClose = useCallback(() => {
    form.reset();
    setStartDate(todayDates?.start);
    setEndDate(todayDates?.end);
    setDateRangeOption("Today");
    reset(); // Reset the mutation state to clear isSuccess
    onClose();
  }, [form, onClose, reset, todayDates]);

  const handleSubmit = async (formData: ExportTransactionFormData) => {
    if (!formData.startDate || !formData.endDate) {
      form.setError("startDate", { message: "Date range is required" });
      return;
    }

    // Format dates as DD-MM-YYYY
    const startDateStr = format(formData.startDate, "dd-MM-yyyy");
    const endDateStr = format(formData.endDate, "dd-MM-yyyy");

    const selectedPos = posList.find((p) => p.posId === formData.posId);
    const posName =
      formData.posId === "all" || !formData.posId
        ? "All POS"
        : (selectedPos?.posName ?? "POS");

    handleExportPosTransaction({
      posName,
      posId:
        formData.posId === "all" || !formData.posId
          ? undefined
          : formData.posId,
      fromDate: startDateStr,
      toDate: endDateStr,
      transactionType: formData.transactionType || undefined,
    });
  };

  useEffect(() => {
    if (isSuccess && isOpen) {
      handleClose();
    }
  }, [isSuccess, isOpen, handleClose]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <DialogContent className="sm:max-w-xl max-h-[90vh] flex flex-col p-0 text-left">
        <DialogHeader className="px-6 pt-6 pb-4 border-b text-left">
          <DialogTitle>Export Transactions</DialogTitle>
        </DialogHeader>

        <LoadingErrorState
          isLoading={isLoadingPos}
          hasError={isError}
          loadingMessage="Loading data..."
          errorMessage={extractErrorMessage(error)}
        >
          <>
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleSubmit)}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 gap-4">
                    {/* Date Range Picker - Required */}
                    <div className="space-y-2">
                      <label
                        htmlFor="dateRange"
                        className="text-sm font-medium text-[#838383]"
                      >
                        Date Range{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <DateRangeSelector
                        value={dateRangeOption}
                        onValueChange={handleDateRangeOptionChange}
                        onDatesChange={handleCustomDatesChange}
                        showCustomRange={true}
                        placeholder="Select Date Range"
                      />
                      {form.formState.errors.startDate && (
                        <p className="text-sm font-medium text-destructive">
                          {form.formState.errors.startDate.message}
                        </p>
                      )}
                      {form.formState.errors.endDate && (
                        <p className="text-sm font-medium text-destructive">
                          {form.formState.errors.endDate.message}
                        </p>
                      )}
                    </div>
                    {/* POS Selection */}
                    <FormField
                      control={form.control}
                      name="posId"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <label
                            htmlFor="posId"
                            className="text-sm font-medium text-[#838383]"
                          >
                            POS{" "}
                            <span className="text-red-500">
                              *
                            </span>
                          </label>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full p-5 shadow-none disabled:bg-gray-50 disabled:cursor-not-allowed">
                                <SelectValue placeholder="Select a POS" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="all">
                                All POS
                              </SelectItem>
                              {posList.map((pos) => (
                                <SelectItem
                                  key={pos.posId}
                                  value={pos.posId}
                                >
                                  {pos.posName}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="transactionType"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <label
                            htmlFor="transactionType"
                            className="text-sm font-medium text-[#838383]"
                          >
                            Transaction Type
                          </label>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full p-5 shadow-none">
                                <SelectValue placeholder="Select transaction type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="SERVICEFEE">
                                SERVICE FEE
                              </SelectItem>
                              <SelectItem value="PAYOUT">
                                PAYOUT
                              </SelectItem>
                              <SelectItem value="SALES">
                                SALES
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </form>
              </Form>
            </div>

            <div className="px-6 py-4 border-t flex justify-end gap-4">
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={isExporting}
              >
                Cancel
              </Button>

              <Button
                onClick={form.handleSubmit(handleSubmit)}
                disabled={
                  isExporting ||
                  !startDate ||
                  !endDate ||
                  !form.getValues("posId")
                }
                className="bg-theme-dark-green text-white disabled:opacity-50 disabled:cursor-not-allowed"
                isLoading={isExporting}
                loadingText="Exporting..."
              >
                Export
              </Button>
            </div>
          </>
        </LoadingErrorState>
      </DialogContent>
    </Dialog>
  );
}
