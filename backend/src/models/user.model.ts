import { ROLE } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UserLoginRequest {
  @ApiProperty({
    example: 'wign',
    required: true,
  })
  phone: string;

  @ApiProperty({
    example: 'password',
    required: true,
  })
  password: string;
}
class BackendTokens {
  @ApiProperty({
    example: 'backendTokens with access tokens',
    required: true,
  })
  accessToken: string;

  @ApiProperty({
    example: 'backendTokens with refresh tokens',
    required: true,
  })
  refreshToken: string;
}

export class UserLoginResponse {
  @ApiProperty({
    example: 'pqiwoqkmwknq',
    required: true,
  })
  id_user: string;

  @ApiProperty({
    example: 'wign',
    required: true,
  })
  name: string;

  @ApiProperty({
    example: 'ADMIN',
    required: true,
  })
  role: ROLE;

  @ApiProperty({
    example: `{ 
    "accessTokens:"randomJwtToken",
    "RefreshTokens":"randmonRefreshTokens" }`,
    required: false,
  })
  backendTokens: BackendTokens;
}

export class UserDetailResponse {
  @ApiProperty({
    example: 'wign',
    required: false,
  })
  id_user: string;

  @ApiProperty({
    example: 'wign',
    required: false,
  })
  id_tenant?: string;

  @ApiProperty({
    example: 'wign',
    required: false,
  })
  name: string;

  @ApiProperty({
    example: 'wign',
    required: true,
  })
  phone: string;

  @ApiProperty({
    example: 'GUEST',
    enum: ROLE,
    required: false,
  })
  role: ROLE;

  @ApiProperty({
    example: '2021-08-02T14:00:00.000Z',
    required: true,
  })
  created_at: Date;

  @ApiProperty({
    example: '2021-08-02T14:00:00.000Z',
    required: false,
  })
  updated_at: Date;
}

export class UserUpdateRequest {
  @ApiProperty({
    example: 'wign',
    required: false,
  })
  name?: string;

  @ApiProperty({
    example: 'randompassword',
    required: false,
  })
  password?: string;

  @ApiProperty({
    example: 'TENANT',
    required: false,
  })
  role?: ROLE;

  @ApiProperty({
    example: '08123456789',
    required: false,
  })
  phone?: string;
}

export class userCreate {
  @ApiProperty({
    example: 'wign',
    required: true,
  })
  name: string;

  @ApiProperty({
    example: 'randompassword',
    required: true,
  })
  password: string;

  @ApiProperty({
    example: 'TENANT',
    required: true,
  })
  role: ROLE;

  @ApiProperty({
    example: '08123456789',
    required: true,
  })
  phone: string;
}

export class passwordUpdate {
  @ApiProperty({
    example: '081xxxxxx',
    required: true,
    description: 'Phone number of the user',
  })
  phone: string;

  @ApiProperty({
    example: 'wign',
    required: true,
  })
  token: string;

  @ApiProperty({
    example: 'randompassword',
    required: true,
  })
  password: string;
}
