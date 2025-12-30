import { FieldErrors } from "react-hook-form";
import { BusinessLocationFormData } from "@/lib/schemas/business-registration-schema";

interface FormErrorsDisplayProps {
  errors: FieldErrors<BusinessLocationFormData>;
}

export default function FormErrorsDisplay({ errors }: FormErrorsDisplayProps) {
  const errorEntries = Object.entries(errors);

  if (errorEntries.length === 0) {
    return null;
  }

  return (
    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
      <p className="text-sm font-medium text-red-800 mb-1">Please fix the following errors:</p>
      <ul className="text-xs text-red-700 list-disc list-inside">
        {errorEntries.map(([field, error]) => (
          <li key={field}>
            {field}: {error?.message as string}
          </li>
        ))}
      </ul>
    </div>
  );
}

