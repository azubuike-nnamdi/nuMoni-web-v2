import { z } from 'zod';

// Step 1: New Account
export const step1Schema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Please enter a valid email address'),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits'),
});

// Step 2: OTP Verification
export const step2Schema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

// Step 3: Set Password
export const step3Schema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Complete schema for final validation
export const signUpSchema = z.object({
  // Step 1: New Account
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Please enter a valid email address'),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits'),

  // Step 2: OTP Verification
  otp: z.string().length(6, 'OTP must be 6 digits'),

  // Step 3: Set Password
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type SignUpFormData = z.infer<typeof signUpSchema>;
export type Step1FormData = z.infer<typeof step1Schema>;
export type Step2FormData = z.infer<typeof step2Schema>;
export type Step3FormData = z.infer<typeof step3Schema>;

