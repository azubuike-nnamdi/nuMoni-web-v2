/**
 * BankFormFields Component
 * 
 * Reusable form fields section for bank information
 */

import { FormCombobox } from "@/components/ui/form-combobox";
import { FormInputTopLabel } from "@/components/ui/form-input";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Control, Path } from "react-hook-form";
import { FieldValues } from "react-hook-form";

interface BankFormFieldsProps<T extends FieldValues> {
  control: Control<T>;
  bankCodeField: Path<T>;
  accountNumberField: Path<T>;
  accountNameField: Path<T>;
  bankTransferCodeField: Path<T>;
  bankOptions: Array<{ value: string; label: string }>;
  isBanksPending: boolean;
  onAccountNumberChange?: () => void;
}

export function BankFormFields<T extends FieldValues>({
  control,
  bankCodeField,
  accountNumberField,
  accountNameField,
  bankTransferCodeField,
  bankOptions,
  isBanksPending,
  onAccountNumberChange,
}: BankFormFieldsProps<T>) {
  return (
    <div className="space-y-4">
      <h4 className="text-md font-semibold text-gray-900">Bank Information</h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormCombobox
          control={control}
          name={bankCodeField}
          label="Select Bank"
          options={bankOptions}
          placeholder={
            isBanksPending ? "Loading banks..." : "Search and select a bank..."
          }
          searchPlaceholder="Search banks..."
          emptyMessage="No bank found."
          disabled={isBanksPending}
          required
        />

        <FormField
          control={control}
          name={accountNumberField}
          render={({ field, fieldState: { error } }) => (
            <FormItem className="w-full">
              <label
                htmlFor={accountNumberField as string}
                className="mb-1 block text-sm font-medium text-[#838383]"
              >
                Account Number <span className="text-red-500">*</span>
              </label>
              <FormControl>
                <input
                  {...field}
                  id={accountNumberField as string}
                  type="text"
                  placeholder="Enter account number"
                  onChange={(e) => {
                    onAccountNumberChange?.();
                    field.onChange(e.target.value);
                  }}
                  className={`w-full rounded-lg border px-4 py-3 text-base text-gray-900 placeholder-gray-400 disabled:cursor-not-allowed ${
                    error
                      ? "border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-200 bg-gray-50 focus:border-blue-500 focus:ring-blue-500"
                  }`}
                />
              </FormControl>
              <div className="min-h-[20px]">
                <FormMessage className="text-sm text-red-600" />
              </div>
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInputTopLabel
          control={control}
          name={accountNameField as string}
          label="Account Holder Name"
          placeholder="Enter account holder name"
          required
        />

        <FormInputTopLabel
          control={control}
          name={bankTransferCodeField as string}
          label="Bank Transfer Code"
          placeholder="Enter bank transfer code"
        />
      </div>
    </div>
  );
}

