import { apiRequest } from '@/lib/api';
import { RoomTypeResponse } from '@/types/room'
import React from 'react'
import Home from '@/components/Home/Home'  ;
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { UserDetailResponse } from '@/types/user';

/**
 * Renders the home page of the application.
 * 
 * This async function fetches room types and user details (if authenticated) from the API,
 * then renders the Home component with the fetched data.
 * 
 * @async
 * @function page
 * @returns {Promise<JSX.Element>} The rendered Home component wrapped in a div
 * 
 * @throws {Error} When API requests fail
 * 
 * @example
 * // This function is typically used by Next.js routing
 * // and doesn't need to be called directly
 */


async function page() {
    let roomtype:RoomTypeResponse[] = []
    let user:UserDetailResponse | undefined = undefined; 
    const url = process.env.NEXT_PUBLIC_API_URL;
    const session = await getServerSession(authOptions);
    try{
        roomtype = await apiRequest<RoomTypeResponse[]>({
            endpoint: "/roomtype",
            method: "GET",
        })
        if(session?.id_user){
        user = await apiRequest<UserDetailResponse>({
            endpoint: `/users/${session?.id_user}`,
            method: "GET",
            headers: {
                Authorization: `Bearer ${session?.backendTokens.accessToken}`,
            },
        })        
    }
    }catch (error){ 
       throw error;
    }
  return(
  <div>
    <Home user={user} roomtype={roomtype} url={url as string}/>
  </div>
  )
}

export default page


export async function generateMetadata() {
    return {
        title: 'Home',
        description: 'Jaya Green Kost',
    }
}