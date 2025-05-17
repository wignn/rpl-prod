import AdminDashboard from "@/components/admin/AdminDashboard";
import { apiRequest } from "@/lib/api";
import { authOptions } from "@/lib/auth";
import { FacilityDetailResponse } from "@/types/facility";
import { FinanceDetailsResponse } from "@/types/finance";
import { RoomDetailResponse, RoomTypeResponse } from "@/types/room";
import { UserDetailResponse } from "@/types/user";
import { getServerSession } from "next-auth";

export const dynamic = "force-dynamic";

interface Activity {
  id: string;
  message: string;
  timestamp: string;
}


export default async function Home() {
  let user: UserDetailResponse | undefined;
  let accessToken: string = "";
  let facilities: FacilityDetailResponse[] = [];
  let roomtype: RoomTypeResponse[] = [];
  let kamarKosong: number = 0;
  let pendapatan: number = 0;
  let kamarTerisi: number = 0;
  let kamar : number = 0;
  let actifity: Activity[] = [];
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  try {
    const session = await getServerSession(authOptions);

    if (session) {
      accessToken = session?.backendTokens.accessToken || "";
      const [users, facilitiy, roomtypes, finance, room] = await Promise.all([
        apiRequest<UserDetailResponse>({
          endpoint: `/users/${session.id_user}`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${session.backendTokens.accessToken}`,
          },
        }),
        apiRequest<FacilityDetailResponse[]>({
          endpoint: "/facility",
          method: "GET",
          headers: {
            Authorization: `Bearer ${session.backendTokens.accessToken}`,
          },
        }),

        apiRequest<RoomTypeResponse[]>({
          endpoint: "/roomtype",
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }),

        apiRequest<FinanceDetailsResponse[]>({
          endpoint: `/finance`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }),

        apiRequest<RoomDetailResponse[]>({
          endpoint: `/room`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }),
      ]);



      actifity = finance.map((item) => ({
        id: item.id_finance,
        message: `${item.tenant.name} melakukan transaksi ${item.category} sebesar ${item.amount}`,
        timestamp: new Date(item.created_at).toLocaleString(),
      })) as Activity[];

      kamarKosong = room.filter(
        (item) => item.status === "AVAILABLE"
      ).length;

      kamarTerisi = room.filter((item) => item.status === "NOTAVAILABLE").length;
      
      kamar = room.length;
      const income = finance
        .filter((item) => item.type === "INCOME")
        .reduce((acc, item) => acc + item.amount, 0);
      
      const expenses = finance
        .filter((item) => item.type === "OUTCOME")
        .reduce((acc, item) => acc + item.amount, 0);
      
      pendapatan = income - expenses;
      user = users;
      facilities = facilitiy;
      roomtype = roomtypes;
    }
  } catch (error) {
    throw error;
  }

  return (
    <AdminDashboard
      baseUrl={baseUrl as string}
      actifity={actifity}
      kamar={kamar}
      kamarTerisi={kamarTerisi}
      roomtype={roomtype}
      kamarKosong={kamarKosong}
      facilities={facilities}
      pendapatan={pendapatan}
      accessToken={accessToken}
      user={user as UserDetailResponse}
    />
  );
}
