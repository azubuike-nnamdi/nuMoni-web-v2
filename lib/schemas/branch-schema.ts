import { z } from 'zod'

export const branchFormSchema = z.object({
  // Step 1: Branch Info
  logo: z.string().optional(),
  branchName: z.string().min(1, 'Branch name is required'),
  branchRegion: z.string().min(1, 'Branch region is required'),
  branchState: z.string().min(1, 'Branch state is required'),
  lga: z.string().min(1, 'LGA is required'),
  openingTime: z.string().min(1, 'Opening time is required'),
  closingTime: z.string().min(1, 'Closing time is required'),
  description: z.string().min(1, 'Branch description is required'),
  phone: z.string().min(1, 'Phone number is required'),
  email: z.string().email('Invalid email address'),
  businessPhoto: z.string().optional(),
  businessPhotos: z.array(z.string()).optional(),

  // Step 2: Location
  address: z.string().min(1, 'Address is required'),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),

  // Step 3: Manager
  managerPhoto: z.string().optional(),
  managerName: z.string().min(1, 'Manager name is required'),
  managerPhone: z.string().min(1, 'Manager phone is required'),
  managerEmail: z.string().email('Invalid manager email address'),

  // Step 4: Social Media
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
  whatsapp: z.string().optional(),
  linkedin: z.string().url('Invalid LinkedIn URL').optional().or(z.literal('')),
  instagram: z.string().url('Invalid Instagram URL').optional().or(z.literal('')),
  twitter: z.string().url('Invalid Twitter URL').optional().or(z.literal('')),
  snapchat: z.string().url('Invalid Snapchat URL').optional().or(z.literal('')),

  // Step 5: Collection Account
  bank: z.string().min(1, 'Bank is required'), // Bank code
  payOnUsBank: z.string().optional(), // Pay-on-us bank code
  accountNumber: z.string().min(10, 'Account number must be at least 10 digits'),
  bankAccountName: z.string().optional(), // Verified account name from bank API
  minPayment: z.string().min(1, 'Minimum payment amount is required'),
})

export type BranchFormData = z.infer<typeof branchFormSchema>

