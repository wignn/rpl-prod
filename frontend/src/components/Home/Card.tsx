import Image from "next/image"
import Link from "next/link"
import type { RoomTypeResponse } from "@/types/room"

interface RoomTypeCardProps {
  room: RoomTypeResponse & { room_type: string }
  url: string
}

/**
 * Uniform room type card with consistent dimensions
 * All cards have the same size regardless of content length
 */
export default function RoomTypeCard({ room, url }: RoomTypeCardProps) {
  return (
    <Link href={`/view/${room.id_roomtype}`} className="block h-full">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 h-80 flex flex-col">
        {/* Image - Fixed Height */}
        <div className="relative w-full h-48 flex-shrink-0">
          <Image
            src={`${url}/${room.image}`}
            alt={`Kamar ${room.room_type}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        {/* Content - Fixed Height */}
        <div className="p-4 h-32 flex flex-col justify-between flex-shrink-0">
          {/* Room Name - Fixed Height with Truncation */}
          <div className="h-12 mb-2">
            <h3 className="font-semibold text-gray-900 text-base leading-6 line-clamp-2 overflow-hidden">
              Kamar {room.room_type}
            </h3>
          </div>

          {/* Price - Fixed Height */}
          <div className="h-8 flex items-center justify-between">
            <p className="text-lg font-bold text-emerald-600 truncate">Rp {room.price.toLocaleString("id-ID")}</p>
            <span className="text-sm text-gray-500 flex-shrink-0 ml-2">/bulan</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
