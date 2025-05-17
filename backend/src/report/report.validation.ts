import { z, ZodType } from "zod";



export class ReportValidation {
  static readonly CREATE: ZodType = z.object({
    id_tenant: z.string().min(1),
    id_facility: z.string().min(1),
    report_desc: z.string().min(1),
    report_date: z.coerce.date(),
    status: z.enum(["PENDING", "PENDING"]),
  })

  static readonly UPDATE: ZodType = z.object({
    id_tenant: z.string().optional(),
    id_facility: z.string().optional(),
    report_desc: z.string().optional(),
    report_date: z.coerce.date().optional(),
    status: z.enum(["PENDING", "COMPLETED"]).optional(),
  })
}