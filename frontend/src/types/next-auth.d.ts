import "next-auth"

declare module "next-auth" {
  interface Session {
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
    name: string;
    token: string;    
    id_user: string;
    user: {
      name: string;
      email: string;
      image: string;
    };

    backendTokens: {
      accessToken: string;
      refreshToken: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
    name: string;
    token: string;    
    id_user: string;
    exp: number;
    iat: number;
    role: boolean;
    backendTokens: {
      accessToken: string;
      refreshToken: string;
      expiresIn: number;
    };
  }
}