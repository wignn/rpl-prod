import Contact from '@/components/Contact'
import { apiRequest } from '@/lib/api';
import { authOptions } from '@/lib/auth';
import { UserDetailResponse } from '@/types/user';
import { getServerSession } from 'next-auth';
import React from 'react'
import Navbar from '@/components/Home/Navbar';



async function page() {
  let user:UserDetailResponse | undefined = undefined;
  const session = await getServerSession(authOptions);

  try{
    if(session?.id_user){
      user = await apiRequest<UserDetailResponse>({
      endpoint: `/users/${session?.id_user}`,
      method:"GET",
      headers:{
        Authorization: `Bearer ${session?.backendTokens.accessToken}`,
      },
    })
  }
  }catch(error){
    throw error;
  }
  
  return (
    <div className='bg-gradient-to-b from-green-100 via-green-200 to-green-400'>
      <Navbar user={user} tipeKamarHref='/'  />
        <Contact/>
    </div>
  )
}

export default page

export async function generateMetadata() {
  return {
    title: 'Tentang Kami',
    description: 'Jaya Green Kost',
  }
}