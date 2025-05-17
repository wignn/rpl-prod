import { z, ZodType } from 'zod';

export class UserValidation {
  static readonly LOGIN:ZodType = z.object({
    phone: z.string().min(10),
    password: z.string().min(6),
  })

  static readonly UPDATE:ZodType = z.object({
    name: z.string().optional(),
    password: z.string().optional().optional(),
    role: z.enum(['TENANT', 'ADMIN']).optional(),
    phone: z.string().optional(),
  })

  static readonly CREATE:ZodType = z.object({
    name: z.string().min(3),
    password: z.string().min(6),
    role: z.enum(['TENANT', 'ADMIN']),
    phone: z.string().min(10),
  })

  static readonly RESET:ZodType = z.object({
    token: z.string().min(8),
    phone: z.string().min(10),
    password: z.string().min(8),
  })
}
