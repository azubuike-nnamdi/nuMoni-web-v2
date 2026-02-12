import { z } from 'zod';

export const exportPosTransactionSchema = z.object({
  posId: z.string().min(1, "POS is required"),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  transactionType: z.string().optional(),
  customerEmail: z.union([
    z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address"),
    z.literal("")
  ]).optional(),
  customerPhoneNo: z.string().optional(),
  customerId: z.string().optional(),
}).superRefine((data, ctx) => {
  if (!data.startDate) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Start date is required",
      path: ["startDate"],
    });
  }
  if (!data.endDate) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "End date is required",
      path: ["endDate"],
    });
  }
  if (data.startDate && data.endDate && data.endDate < data.startDate) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "End date must be after start date",
      path: ["endDate"],
    });
  }
});

export type ExportPosTransactionFormData = z.infer<typeof exportPosTransactionSchema>;

