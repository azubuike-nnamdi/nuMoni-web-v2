import z from "zod";

const merchantSchema = z.object({
  // Profile
  profileImage: z.string().optional(),

  // Business Information
  businessName: z.string().min(1, 'Business name is required'),
  emailAddress: z.string().email('Invalid email address'),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits'),
  businessCategory: z.string().min(1, 'Business category is required'),
  rcNumber: z.string().regex(/^RC[A-Z0-9]+$/i, 'RC number must start with "RC" followed by alphanumeric characters'),
  businessType: z.string().min(1, 'Business type is required'),
  headquarterAddress: z.string().min(1, 'Headquarter address is required'),
  country: z.string().min(1, 'Country is required'),
  region: z.string().min(1, 'Region is required'),
  state: z.string().min(1, 'State is required'),
  lga: z.string().min(1, 'LGA is required'),
  businessDescription: z.string().min(10, 'Business description must be at least 10 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),

  // Contact Information
  contactPersonName: z.string().min(1, 'Contact person name is required'),
  contactEmailAddress: z.string().email('Invalid contact email address'),
  contactPhoneNumber: z.string().min(10, 'Contact phone number must be at least 10 digits'),
  contactAddress: z.string().min(1, 'Contact address is required'),
  contactRegion: z.string().min(1, 'Contact region is required'),
  contactState: z.string().min(1, 'Contact state is required'),
  contactLga: z.string().min(1, 'Contact LGA is required'),

  // Payout Information
  bankName: z.string().min(1, 'Bank name is required'),
  bankCode: z.string().min(1, 'Bank code is required'),
  bankAccountNumber: z.string().min(10, 'Bank account number must be at least 10 digits'),
  accountName: z.string().min(1, 'Account name is required'),
  verifiedAccountName: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type MerchantFormData = z.infer<typeof merchantSchema>;


export interface FormData {
  [key: string]: string | undefined;
}

export interface FormErrors {
  [key: string]: string;
}

export interface FormComponentProps {
  formData: Partial<MerchantFormData>;
  setFormData: (data: Partial<MerchantFormData> | ((prev: Partial<MerchantFormData>) => Partial<MerchantFormData>)) => void;
  errors: FormErrors;
}

export interface DropdownState {
  [key: string]: boolean;
}

export interface ProfileUploadProps {
  onImageChange: (imageUrl: string | null) => void;
  imageUrl?: string | null;
}



export type Admin = {
  id: number;
  name: string;
  adminId: string;
  avatar: string;
  dateCreated: string;
  email: string;
  phone: string;
  role: string;
  team: string;
  status: "Active" | "Suspended" | "Pending";
  statusColor: "green" | "red" | "orange";
};