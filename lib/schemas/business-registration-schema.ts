import { z } from 'zod';



// Step 2: Register Business Schema
export const registerBusinessSchema = z.object({
  logo: z.string().url('Invalid logo URL').nullable().optional(),
  businessName: z.string().min(1, 'Business name is required'),
  businessCategories: z
    .array(z.string())
    .min(1, 'Please select at least one business category'),
  businessDescription: z
    .string()
    .min(10, 'Business description must be at least 10 characters'),
  businessPhone: z
    .string()
    .regex(/^\d{10,11}$/, 'Phone number must be 10 or 11 digits'),
  businessEmail: z.string().email('Please enter a valid email address'),
  businessPhoto: z.array(z.string().url('Invalid photo URL')).optional(),
  businessOpenHours: z.string().min(1, 'Business open hours is required'),
  businessClosingHours: z.string().min(1, 'Business closing hours is required'),
});

// Step 3: Business Location Schema
export const businessLocationSchema = z.object({
  id: z.string().nullable().optional(),
  merchantId: z.string().min(1, 'Merchant ID is required'),
  storeNo: z.string().min(1, 'Store number is required'),
  address: z.string().min(1, 'Business address is required'),
  street: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  state: z.string().nullable().optional(),
  country: z.string().min(1, 'Country is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  latitude: z.number().min(-90).max(90, 'Invalid latitude'),
  longitude: z.number().min(-180).max(180, 'Invalid longitude'),
  active: z.boolean(),
});

// Step 4: Business Document Schema
export const businessDocumentSchema = z.object({
  identificationType: z.enum(['nin', 'cac', 'bn', 'other'], {
    message: 'Please select an identification type',
  }),
  registrationNumber: z.string().min(1, 'Business registration number is required'),
  tin: z.string().optional(),
  cacDocument: z.string().url('Invalid document URL').nullable(),
  certificateOfRegistration: z.string().url('Invalid document URL').nullable().optional(),
  tinDocument: z.string().url('Invalid document URL').nullable().optional(),
  menuOrCatalogue: z.string().url('Invalid document URL').nullable().optional(),
}).refine(
  (data) => data.cacDocument !== null && data.cacDocument.length > 0,
  {
    message: 'CAC document is required',
    path: ['cacDocument'],
  }
);

// Step 5: Business Collection Account Schema
export const businessCollectionAccountSchema = z.object({
  bank: z.string().min(1, 'Please select a bank'),
  accountNumber: z.string().min(10, 'Account number must be at least 10 digits').max(12, 'Account number must be at most 12 digits'),
  bankAccountName: z.string().optional(),
  minPayment: z.number().min(0, 'Minimum payment amount must be greater than or equal to 0'),
});


// Type exports
export type RegisterBusinessFormData = z.infer<typeof registerBusinessSchema>;
export type BusinessLocationFormData = z.infer<typeof businessLocationSchema>;
export type BusinessDocumentFormData = z.infer<typeof businessDocumentSchema>;
export type BusinessCollectionAccountFormData = z.infer<typeof businessCollectionAccountSchema>;

