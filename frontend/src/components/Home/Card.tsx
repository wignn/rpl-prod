"use client"
import Image from "next/image"
import Link from "next/link"
import type { RoomTypeResponse } from "@/types/room"

interface RoomTypeCardProps {
  room: RoomTypeResponse & { room_type: string }
  url: string
}

export default function RoomTypeCard({ room, url }: RoomTypeCardProps) {
  return (
    <Link href={`/view/${room.id_roomtype}`}>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 h-full flex flex-col">
        <div className="relative w-full h-48 md:h-64 lg:h-80">
          <Image src={`${url}/${room.image}`} alt={`Tipe ${room.room_type}`} fill className="object-cover" />
          <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-md text-xs font-medium">
            Tipe {room.room_type}
          </div>
        </div>
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-semibold text-gray-800 mb-1">Kamar Tipe {room.room_type}</h3>
          <div className="flex justify-between items-center">
            <p className="font-bold text-gray-900">Rp {room.price.toLocaleString("id-ID")}</p>
          </div>
        </div>
      </div>
    </Link>
  )
}
