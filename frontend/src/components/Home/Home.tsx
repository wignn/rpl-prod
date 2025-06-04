"use client";
import type { RoomTypeResponse } from "@/types/room";
import Image from "next/image";
import RoomTypeCard from "@/components/Home/Card";
import Link from "next/link";
import { UserDetailResponse } from "@/types/user";
import Navbar from "./Navbar";

interface Props {
  roomtype: RoomTypeResponse[];
  user?: UserDetailResponse;
  url: string;
}

/**
 * Home component that serves as the main landing page for a kost service.
 *
 * The component displays information about the housing facility (Green Kost Jaya),
 * room types available for rent, and additional functionality for tenants.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Array<Object>} props.roomtype - Array of room type objects to be displayed
 * @param {Object|null} props.user - Current user object with role information, if authenticated
 * @param {string} props.url - Base URL for API requests or resource paths
 *
 * @example
 * ```tsx
 * <Home
 *   roomtype={roomTypeData}
 *   user={currentUser}
 *   url="https://api.example.com"
 * />
 * ```
 *
 * @returns React component that displays the home page with navigation, property information,
 *          room type listings, and conditional maintenance reporting section for tenants
 */
export default function Home({ roomtype, user, url }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 via-green-200 to-green-400">
      <Navbar tipeKamarHref="#kamar" user={user} />
      <main className="max-w-6xl mx-auto px-8 py-6">
        <section className="mb-12">
          <h1 className="text-3xl font-bold text-gray-800 mb-1">
            Green Kost Jaya
          </h1>
          <p className="text-gray-700 text-sm mb-4">
            Jl. Surotokunto, Dsn. Bendasari 2 RT 12 RW 05 No 25, Desa
            Kondangjaya
          </p>

          <div className="relative w-full h-64 rounded-lg overflow-hidden mb-8">
            <Image
              src="/banner.png?height=400&width=800"
              alt="Nama Kost"
              fill
              className="object-cover"
              priority
            />
          </div>
        </section>

        <section id="kamar" className="mb-16">
          <h2 className="text-xl font-bold text-gray-800 mb-6 bg-green-300/50 inline-block px-3 py-1 rounded-md">
            Tipe Kamar
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-6">
            {roomtype.map((type) => (
              <RoomTypeCard
                key={type.id_roomtype}
                room={type}
                url={url}
              />
            ))}
          </div>
        </section>

        {user && user.role === "TENANT" && (
          <section className="mb-10">
            <div className="bg-white rounded-xl shadow-sm p-6 flex gap-6">
              <div className="flex-1">
                <h2 className="text-xl font-semibold mb-2">
                  Ada kerusakan? Laporkan
                </h2>
                <p className="text-gray-600 mb-4 text-sm">
                  Sampaikan jenis kerusakan dan penjelasan secukupnya agar
                  teknisi kami dapat segera memperbaiki. Jika butuh bantuan
                  segera, silakan hubungi nomor yang tertera di bawah.
                </p>
                <Link href={"/report"}>
                  <button className="cursor-pointer bg-black text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-800">
                    Ada kerusakan? Report
                  </button>
                </Link>
              </div>
              <div className="flex-none w-1/4">
                <div className="bg-gray-200 h-full w-full rounded-lg"></div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
