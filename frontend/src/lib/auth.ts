import { JWT } from "next-auth/jwt";
import { apiRequest } from "./api";
import { loginResponse } from "@/types/auth";
import { jwtDecode } from "jwt-decode";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

/*
this function is used to refresh the access token when it is expired
it will be called in the api route when the access token is expired
it will check if the refresh token is valid or not
if it is valid it will get a new access token and return it
otherwise it will return null
*/

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function refreshAccessToken(Token: JWT): Promise<any> {
  try {
    const response = await apiRequest<loginResponse>({
      endpoint: "/users/refresh",
      method: "PATCH",
      body: {
        role: Token.role,
        sub: Token.name,
      },
      headers: {
        Authorization: `Refresh ${Token.backendTokens.refreshToken}`,
      },
    });

    const newToken = response.backendTokens;
    const decodeToken = newToken.accessToken
      ? jwtDecode(newToken.accessToken)
      : null;

    return {
      ...Token,
      backendTokens: {
      ...newToken,
      },
      accessTokenExpired: decodeToken?.exp
      ? decodeToken.exp * 1000
      : Date.now() + 24 * 60 * 60 * 1000, 
    };
  } catch (error) {
    throw error;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        phone: { label: "phone", type: "text", placeholder: "wignn" },
        password: { label: "password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.phone || !credentials?.password) {
          return null;
        }

        const response = await apiRequest<loginResponse>({
          endpoint: "/users",
          method: "PATCH",
          body: {
            phone: credentials.phone,
            password: credentials.password,
          },
        });

        if (response === null) {
          return null;
        }
        /*
        this is the response from the backend 
        it contains the user data and the tokens
        token will be decoded to get the expiration time
        and wil return the user data with the tokens
        and the expiration time of the access token
        */
        const user = response;
        const newTokens = user.backendTokens;
        const decodedToken = newTokens?.accessToken
          ? jwtDecode(newTokens.accessToken)
          : null;

        return {
          id: user.id_user,
          ...user,
          accessTokenExpires: decodedToken?.exp
            ? decodedToken.exp * 1000
            : Date.now(),
        };
      },
    }),
  ],
  pages: {
    signIn: "/sign",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return { ...token, ...user };
      }
      // Return previous token if the access token has not expired yet
      if (Date.now() < token.accessTokenExpires) {
        return token;
      }
      // Access token has expired, try to update it
      // Send refresh token to get a new access token
      return await refreshAccessToken(token);
    },

    async session({ session, token }) {
      return { ...session, ...token };
    },
  },
  //this is secret for the next auth
  secret: process.env.NEXTAUTH_SECRET,
};
