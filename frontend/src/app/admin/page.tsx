import AdminDashboard from "@/components/admin/AdminDashboard";
import { apiRequest } from "@/lib/api";
import { authOptions } from "@/lib/auth";
import { FinanceDetailsResponse } from "@/types/finance";
import { RoomDetailResponse } from "@/types/room";
import { UserDetailResponse } from "@/types/user";
import { getServerSession } from "next-auth";

export const dynamic = "force-dynamic";

interface Activity {
  id: string;
  message: string;
  timestamp: string;
}


/**
 * Admin dashboard page component that fetches user details, financial data,
 * and room information from the server.
 * 
 * This component:
 * - Retrieves the user's session using getServerSession
 * - Makes parallel API requests to fetch various data
 * - Calculates metrics like empty rooms, occupied rooms, and net income
 * - Transforms financial data into activity logs
 * - Renders the AdminDashboard component with all fetched and calculated data
 * 
 * @returns {Promise<JSX.Element>} The rendered AdminDashboard component with all necessary props
 * @throws {Error} Throws any errors that occur during data fetching
 */

export default async function Home() {
  let user: UserDetailResponse | undefined;
  let accessToken: string = "";
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
      const [users, finance, room] = await Promise.all([
        apiRequest<UserDetailResponse>({
          endpoint: `/users/${session.id_user}`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${session.backendTokens.accessToken}`,
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
      kamarKosong={kamarKosong}
      pendapatan={pendapatan}
      accessToken={accessToken}
      user={user as UserDetailResponse}
    />
  );
}


export async function generateMetadata() {
  return {
    title: "Admin",
    description: "Jaya Green Kost",
  };
}