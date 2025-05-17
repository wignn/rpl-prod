import { z, ZodType } from 'zod';

export class TenantValidation {
  static readonly CREATE: ZodType = z.object({
    address: z.string().min(4),
    no_ktp: z.string().min(4),
    status: z.enum(['MARRIED', 'SINGLE']),
    no_telp: z.string().min(4),
    id_room: z.string(),
    rent_in: z.coerce.date(),
    full_name: z.string(),
  });

  static readonly UPDATE: ZodType = z.object({
    address: z.string().min(4).optional(),
    no_ktp: z.string().min(4).optional(),
    status: z.enum(['MARRIED', 'SINGLE']).optional(),
    no_telp: z.string().min(4).optional(),
    id_room: z.string().optional(),
    rent_in: z.coerce.date().optional(),
    full_name: z.string().optional(),
  })
}
