
interface OtpHeaderProps {
  contactLabel: string;
  contactInfo: string;
}

export const OtpHeader = ({ contactLabel, contactInfo }: OtpHeaderProps) => {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-black mb-2">OTP Verification</h2>
      <p className="text-gray-600 text-sm">
        Please enter the 6 digits OTP code we sent to your {contactLabel}{" "}
        <span className="font-medium">{contactInfo}</span>.{" "}
        {/* <button
          type="button"
          className="text-theme-dark-green hover:underline inline-flex items-center gap-1"
        >
          <Edit className="h-3 w-3" />
          Edit
        </button> */}
      </p>
    </div>
  );
};

