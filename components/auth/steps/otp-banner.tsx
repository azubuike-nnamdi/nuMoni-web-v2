import { Check, X } from "lucide-react";

interface OtpBannerProps {
  contactInfo: string;
  onDismiss: () => void;
}

export const OtpBanner = ({ contactInfo, onDismiss }: OtpBannerProps) => {
  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <Check className="h-5 w-5 text-green-600" />
        <span className="text-sm text-green-800">OTP Sent To {contactInfo}</span>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        className="text-green-600 hover:text-green-800"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

