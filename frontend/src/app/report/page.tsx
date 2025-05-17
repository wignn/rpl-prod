import ReportPage from "@/components/report/Report";
import { apiRequest } from "@/lib/api";
import { authOptions } from "@/lib/auth";
import { FacilityDetailResponse } from "@/types/facility";
import { getServerSession } from "next-auth";
import React from "react";

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
