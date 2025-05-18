"use client"
import Image from "next/image"
import Link from "next/link"
import type { RoomTypeResponse } from "@/types/room"

interface RoomTypeCardProps {
  room: RoomTypeResponse & { room_type: string }
  url: string
}

/**
 * A component that displays a card for a room type with image, room type label, and price.
 * The card is wrapped in a Link that navigates to a detailed view of the room type.
 * 
 * @component
 * @param {Object} props - The component props
 * @param {Object} props.room - The room type data object
 * @param {string} props.room.id_roomtype - Unique identifier for the room type
 * @param {string} props.room.image - The image filename for the room
 * @param {string} props.room.room_type - The room type designation
 * @param {number} props.room.price - The room price
 * @param {string} props.url - The base URL for the room images
 * @returns {JSX.Element} A clickable room type card component
 */
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
