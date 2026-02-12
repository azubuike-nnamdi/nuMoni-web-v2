import { z } from "zod";

export const exportTransactionSchema = z
  .object({
    posId: z.string().optional(),
    startDate: z.date().optional(),
    endDate: z.date().optional(),
    transactionType: z.string().optional(),
  })
  .superRefine((data, ctx) => {
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

export type ExportTransactionFormData = z.infer<typeof exportTransactionSchema>;
