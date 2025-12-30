interface OtpResendProps {
  otpResendTimer: number;
  isResendPending: boolean;
  onResend: () => void;
}

export const OtpResend = ({ otpResendTimer, isResendPending, onResend }: OtpResendProps) => {
  return (
    <div className="text-center text-sm text-gray-600">
      Did not receive any OTP?{" "}
      {otpResendTimer > 0 ? (
        <span className="text-gray-500">Resend In {otpResendTimer}sec</span>
      ) : (
        <button
          type="button"
          onClick={onResend}
          disabled={isResendPending}
          className="text-theme-dark-green hover:underline font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isResendPending ? "Resending..." : "Resend"}
        </button>
      )}
    </div>
  );
};

