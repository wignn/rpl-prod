import { apiRequest } from '@/lib/api';
import { RoomTypeResponse } from '@/types/room';
import Home from '@/components/Home/Home';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { UserDetailResponse } from '@/types/user';
import React from 'react';

async function page() {
  const url = process.env.NEXT_PUBLIC_API_URL;
  const session = await getServerSession(authOptions);

  let roomtype: RoomTypeResponse[] = [];
  let user: UserDetailResponse | undefined = undefined;

  try {
    // Fetch all room types
    roomtype = await apiRequest<RoomTypeResponse[]>({
      endpoint: "/roomtype",
      method: "GET",
    });

    // Optionally fetch user if session exists
    if (session?.id_user && session.backendTokens?.accessToken) {
      try {
        user = await apiRequest<UserDetailResponse>({
          endpoint: `/users/${session.id_user}`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${session.backendTokens.accessToken}`,
          },
        });
      } catch (err) {
        console.warn("Failed to fetch user info:", err);
        user = undefined;
      }
    }
  } catch (error) {
    // Optional: Handle overall API failure
    console.error("Home page fetch error:", error);
    throw error;
  }

  return (
    <div>
      <Home user={user} roomtype={roomtype} url={url as string} />
    </div>
  );
}

export default page;

export async function generateMetadata() {
  return {
    title: 'Home',
    description: 'Jaya Green Kost',
  };
}
