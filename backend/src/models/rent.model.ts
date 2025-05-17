import { ApiProperty } from '@nestjs/swagger';

export class RentDetailsResponse {
  @ApiProperty({
    description: 'Unique identifier for the rent record',
    example: '12345678-1234-1234-1234-123456789012',
  })
  id_rent: string;
  @ApiProperty({
    description: 'Unique identifier for the tenant',
    example: '12345678-1234-1234-1234-123456789012',
  })
  tenantId: string;
  @ApiProperty({
    description: 'Unique identifier for the room',
    example: '12345678-1234-1234-1234-123456789012',
  })
  roomId: string;
  @ApiProperty({
    description: 'Date when the rent was made',
    example: '2023-10-01T00:00:00Z',
  })
  rent_date: Date;
  @ApiProperty({
    description: 'Date when the rent was returned',
    example: '2023-10-15T00:00:00Z',
    required: false,
  })
  rent_out?: Date;
  @ApiProperty({
    description: 'Date when the rent record was created',
    example: '2023-10-01T00:00:00Z',
  })
  created_at: Date;
  @ApiProperty({
    description: 'Date when the rent record was last updated',
    example: '2023-10-01T00:00:00Z',
  })
  updated_at: Date;
}
