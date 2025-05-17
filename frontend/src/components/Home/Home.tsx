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

          <div className="grid grid-cols-2 gap-6 mb-6">
            {roomtype.slice(0, 4).map((type, index) => (
              <RoomTypeCard
                key={type.id_roomtype}
                room={{ ...type, room_type: String.fromCharCode(65 + index) }}
                url={url}
              />
            ))}
          </div>

          {roomtype.length > 4 && (
            <div className="flex justify-center">
              <div className="w-1/2">
                <RoomTypeCard
                  room={{ ...roomtype[4], room_type: "E" }}
                  url={url}
                />
              </div>
            </div>
          )}
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
