import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface BusinessLocationSubmitButtonProps {
  isLoading: boolean;
  disabled: boolean;
  skipDocumentStep: boolean;
}

export default function BusinessLocationSubmitButton({
  isLoading,
  disabled,
  skipDocumentStep,
}: BusinessLocationSubmitButtonProps) {
  return (
    <div className="flex gap-4">
      <Button
        type="submit"
        disabled={disabled}
        className="flex-1 bg-theme-dark-green text-white py-6 rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        isLoading={isLoading}
        loadingText="Saving..."
      >
        {skipDocumentStep ? "Complete Registration" : "Save Business Address And Continue"}
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

