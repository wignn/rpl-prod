import { z, ZodType } from "zod";


export class FinanceValidation {
  static readonly CREATE: ZodType = z.object({
    id_tenant: z.string().optional(),
    id_rent: z.string().optional(),
    type: z.enum(["INCOME", "OUTCOME"]),
    category: z.string(),
    amount: z.number().positive(),
    payment_date: z.coerce.date(),
  })
}