import PropertyDetail from "@/components/guest/roomType"
import { apiRequest } from "@/lib/api"
import type { RoomTypeResponse } from "@/types/room"
import { notFound } from "next/navigation"
import Header from "@/components/Home/Navbar"

async function Page({ params }: { params:  Promise<{ id: string }> }) {
  let roomType: RoomTypeResponse | null = null
  const { id } = await params
  const url = process.env.NEXT_PUBLIC_API_URL

  try {
    roomType = await apiRequest<RoomTypeResponse>({
      endpoint: `/roomtype/${id}`,
      method: "GET",
    })
  } catch (error) {
    throw error
  }

  if (!roomType) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-green-100 to-green-200">
      <Header tipeKamarHref="/" user={undefined} />
      <PropertyDetail roomType={roomType} url={url as string} />
    </div>
  )
}

export default Page
