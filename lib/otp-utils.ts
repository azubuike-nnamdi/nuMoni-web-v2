/**
 * Masks an email address for display purposes
 * @param email - The email address to mask
 * @returns Masked email (e.g., "ab***@example.com")
 */
export const getMaskedEmail = (email: string): string => {
  if (!email) return "";
  const [localPart, domain] = email.split("@");
  if (localPart.length <= 2) return email;
  const masked = localPart.slice(0, 2) + "***";
  return `${masked}@${domain}`;
};

/**
 * Masks a phone number for display purposes
 * @param phone - The phone number to mask
 * @returns Masked phone number (e.g., "***1234")
 */
export const getMaskedPhone = (phone: string): string => {
  if (!phone) return "";
  if (phone.length <= 4) return phone;
  return `***${phone.slice(-4)}`;
};

/**
 * Gets the contact information based on OTP type
 * @param otpType - The current OTP type ('EMAIL' | 'MOBILE' | null)
 * @param email - The email address
 * @param phoneNumber - The phone number
 * @returns Object with contact info and label
 */
export const getContactInfo = (
  otpType: 'EMAIL' | 'MOBILE' | null,
  email: string,
  phoneNumber: string
) => {
  const isEmailOtp = otpType === 'EMAIL';
  return {
    contactInfo: isEmailOtp ? getMaskedEmail(email) : getMaskedPhone(phoneNumber),
    contactLabel: isEmailOtp ? "email" : "phone number",
    isEmailOtp,
    isMobileOtp: otpType === 'MOBILE',
  };
};

import { removeLeadingZero } from "./helper";

/**
 * Creates OTP validation payload for API request
 * @param otp - The OTP code
 * @param otpType - The current OTP type ('EMAIL' | 'MOBILE' | null)
 * @param email - The email address
 * @param phoneNumber - The phone number
 * @returns OTP validation payload object
 */
export const createOtpValidationPayload = (
  otp: string,
  otpType: 'EMAIL' | 'MOBILE' | null,
  email: string,
  phoneNumber: string
) => {
  const isEmailOtp = otpType === 'EMAIL';
  return {
    otp,
    username: isEmailOtp ? email : removeLeadingZero(phoneNumber),
    usertype: "MERCHANT",
    otptype: otpType || "EMAIL",
  };
};

