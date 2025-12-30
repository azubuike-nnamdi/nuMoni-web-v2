/**
 * POSFormFields Component
 * 
 * Reusable form fields section for POS information
 */

import { FormInputTopLabel } from "@/components/ui/form-input";
import { Control, FieldValues } from "react-hook-form";

interface POSFormFieldsProps<T extends FieldValues> {
  control: Control<T>;
  posNameField: string;
  locationField: string;
  addressField: string;
}

export function POSFormFields<T extends FieldValues>({
  control,
  posNameField,
  locationField,
  addressField,
}: POSFormFieldsProps<T>) {
  return (
    <div className="space-y-4">
      <h4 className="text-md font-semibold text-gray-900">POS Information</h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInputTopLabel
          control={control}
          name={posNameField}
          label="POS Name"
          placeholder="Enter POS name"
          required
        />

        <FormInputTopLabel
          control={control}
          name={locationField}
          label="Location"
          placeholder="Enter location"
        />
      </div>

      <FormInputTopLabel
        control={control}
        name={addressField}
        label="Address"
        placeholder="Enter address"
      />
    </div>
  );
}

