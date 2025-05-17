import { ROLE } from '@prisma/client';

export class UserLoginRequest {
  phone: string;
  password: string;
}
class BackendTokens {
  accessToken: string;
  refreshToken: string;
}

enum ROLE {
    ADMIN,
    TENANT
}

export class UserLoginResponse {
  id_user: string;
  name: string;
  role: ROLE;
  backendTokens: BackendTokens;
}

export class UserDetailResponse {
  id_user: string;
  name: string;
  phone: string;
  role: ROLE;
  created_at: Date;
  updated_at: Date;
}

export class UserUpdateRequest {
  name?: string;
  password?: string;
  role?: ROLE;
  phone?: string;
}
