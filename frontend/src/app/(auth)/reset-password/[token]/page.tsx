import ResetPasswordPage from "@/components/reset-password/ResetPasswordForm";
import { apiRequest } from "@/lib/api";
import NotFound from "@/components/reset-password/Error";
import React from "react";

type PageProps = {
  params: Promise<{ token: string }>;
  searchParams:Promise<{ phone?: string }>;
};

async function page({ params, searchParams }:PageProps) {
  const token = (await params).token;
  const phone = (await searchParams).phone;
  try {
    const isValidToken = await apiRequest({
      endpoint: `/users/verify-token`,
      method: "POST",
      body: {
        token,
        phone,
      },
    });

    if (isValidToken === null) {
     return <NotFound />;
    }
  } catch (error) {
    throw error;
  }

  return <ResetPasswordPage token={token} phone={phone as string} />;
}

export default page;


export async function generateMetadata() {
  return {
    title: "Reset Password",
    description: 'Reset Password',
  };
}