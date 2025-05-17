export interface loginResponse {
  id_user: string;
  name: string;
  role: string;
  backendTokens: backendTokens;
}

interface backendTokens {
  accessToken: string;
  refreshToken: string;
}
