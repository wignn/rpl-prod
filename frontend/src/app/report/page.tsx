import ReportPage from "@/components/report/Report";
import { apiRequest } from "@/lib/api";
import { authOptions } from "@/lib/auth";
import { FacilityDetailResponse } from "@/types/facility";
import { getServerSession } from "next-auth";
import React from "react";

/**
 * Renders the report page component.
 * 
 * This async server component:
 * 1. Retrieves the user session using getServerSession
 * 2. Fetches facility details from the backend API
 * 3. Gets the tenant ID associated with the current user
 * 4. Renders the ReportPage client component with the required props
 * 
 * @returns {JSX.Element} The rendered ReportPage component wrapped in a div
 * @throws {Error} If API requests fail or authentication is invalid
 */

async function page() {
  const session = await getServerSession(authOptions);
  let accessToken: string = "";
  let facility: FacilityDetailResponse[] = [];
  let tenatId: string = "";

  try {
    accessToken = session?.backendTokens.accessToken as string;
    facility = await apiRequest<FacilityDetailResponse[]>({
      endpoint: "/facility",
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    
    const res = await apiRequest<{ id_tenant: string }>({
      endpoint: `/users/${session?.id_user}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    tenatId = res.id_tenant;
  } catch (error) {
    throw error;
  }

  return (
    <div>
      <ReportPage accessToken={accessToken} facilities={facility} tenatId={tenatId}/>
    </div>
  );
}

export default page;


export async function generateMetadata() {
  return {
    title: "Report",
    description: "Jaya Green Kost",
  };
}