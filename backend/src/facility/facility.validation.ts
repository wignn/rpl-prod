import { z, ZodType } from "zod";

export class FasilityValidation {
    static readonly CREATE: ZodType = z.object({
        facility_name: z.string().min(4),
        desc : z.string().min(4),
    })

    static readonly UPDATE: ZodType = z.object({
        facility_name: z.string().optional(),
        desc : z.string().optional(),
    })
}