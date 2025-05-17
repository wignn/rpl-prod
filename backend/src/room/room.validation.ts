import { z, ZodType } from 'zod';

export class RoomValidation {
  static readonly CREATE: ZodType = z.object({
    id_roomtype: z.string().min(4),
    status: z.enum(['AVAILABLE', 'NOTAVAILABLE']),
  });

  static readonly UPDATE: ZodType = z.object({
    id_roomtype: z.string().optional(),
    status: z.enum(['AVAILABLE', 'NOTAVAILABLE']).optional(),
  });
}

export class RoomtypeValidation {
  static readonly CREATE: ZodType = z.object({
    image: z.string().optional(),
    facilities: z.array(z.string()).min(1),
    room_type: z.string().min(4),
    price: z.number().positive(),
  });

  static readonly UPDATE: ZodType = z.object({
    facilities: z.array(z.string()).min(1),
    image: z.string().optional(),
    room_type: z.string().optional(),
    price: z.number().positive().optional(),
  })
}
