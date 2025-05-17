import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponse {
  @ApiProperty({ example: 'User not found' })
  message: string;

  constructor(statusCode: number, message: string, error: string) {
    this.message = message;
  }
}
