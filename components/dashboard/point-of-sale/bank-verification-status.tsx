/**
 * BankVerificationStatus Component
 * 
 * Displays the verification status of a bank account
 * Shows success or error messages based on verification result
 */

interface BankVerificationStatusProps {
  isAccountValid: boolean;
  accountName?: string | null;
  accountNumber: string;
  isVerifying: boolean;
  hasAttemptedVerification: boolean;
}

export default function BankVerificationStatus({
  isAccountValid,
  accountName,
  accountNumber,
  isVerifying,
  hasAttemptedVerification,
}: BankVerificationStatusProps) {
  // Only show status if account number is valid length, not verifying, and verification was attempted
  if (!accountNumber || accountNumber.length < 10 || isVerifying || !hasAttemptedVerification) {
    return null;
  }

  return (
    <div className="mt-4">
      {isAccountValid && accountName && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium text-green-800">Account Verified</span>
          </div>
          <p className="text-sm text-green-700 mt-1">
            Account Name: <span className="font-semibold">{accountName}</span>
          </p>
        </div>
      )}

      {!isAccountValid && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="text-sm font-medium text-red-800">Account Verification Failed</span>
          </div>
          <p className="text-sm text-red-700 mt-1">
            Please check your account number and try again.
          </p>
        </div>
      )}
    </div>
  );
}

