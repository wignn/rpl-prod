"use client"

import Image from "next/image"
import {Wifi, Droplets, Zap, Home, MapPin } from "lucide-react"
import type { RoomTypeResponse } from "@/types/room"
import Link from "next/link"
import { useState } from "react"
import { data } from "@/lib/static"
import dynamic from 'next/dynamic';

const MapLeaflet = dynamic(() => import('@/components/MapLeaflet'), { ssr: false });

interface Props {
  roomType: RoomTypeResponse
  url: string
}

export default function PropertyDetail({ roomType, url }: Props) {
  const [isImageFullscreen, setIsImageFullscreen] = useState(false)

  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  }

  const getFacilityIcon = (name: string) => {
    const lowerName = name.toLowerCase()
    if (lowerName.includes("wifi")) return <Wifi className="w-5 h-5 text-green-600" />
    if (lowerName.includes("air") || lowerName.includes("water")) return <Droplets className="w-5 h-5 text-green-600" />
    if (lowerName.includes("listrik") || lowerName.includes("electric"))
      return <Zap className="w-5 h-5 text-green-600" />
    return <Home className="w-5 h-5 text-green-600" />
  }

  return (
    <main className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-gray-600 mb-4">
        <Link href="/" className="hover:text-green-600">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/" className="hover:text-green-600">
          Tipe Kamar
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 font-medium">Kost {roomType.room_type}</span>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Kost {roomType.room_type}</h1>
        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
          <div className="flex items-center">
            <MapPin className="w-4 h-4 text-gray-600 mr-1" />
            <p className="text-sm text-gray-600">
              {data.alamat}
            </p>
          </div>
          {/* <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-500 mr-1" />
            <span className="text-sm font-medium">4.8</span>
            <span className="text-sm text-gray-600 ml-1">(12 reviews)</span>
          </div> */}
        </div>
      </div>


      <div className="mb-8">
        <div className="relative">
          <div
            className="relative w-full aspect-[16/9] bg-white rounded-lg overflow-hidden shadow-md cursor-pointer"
            onClick={() => setIsImageFullscreen(true)}
          >
            <Image
              src={`${url}/${roomType.image}`}
              alt={`Kost ${roomType.room_type}`}
              className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
              width={800}
              height={600}
              priority
            />
            <div className="absolute bottom-3 right-3 bg-white bg-opacity-90 px-3 py-1 rounded-md text-xs font-medium">
              Klik untuk memperbesar
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Deskripsi Kost</h2>
            <p className="text-gray-700 leading-relaxed">
              Kost tipe {roomType.room_type} terdapat kamar dengan pintu untuk privasi penyewa serta terdapat ruang
              makan sendiri. Untuk harga single dan pasutri itu sama yaitu {formatPrice(roomType.price)}.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Fasilitas</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {roomType.facility.map((facility, index) => (
                <div key={index} className="flex items-center p-3 bg-green-50 rounded-lg border border-green-100">
                  {getFacilityIcon(facility.facility_name)}
                  <span className="ml-3 text-sm font-medium text-gray-800">{facility.facility_name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Lokasi</h2>
            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
              <div className="w-full h-full flex items-center justify-center">
            <MapLeaflet lat={-6.322189261099615} lng={107.33368275548138} />
              </div>
            
            </div>
            <p className="mt-4 text-gray-700">{data.alamat}</p>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-6 sticky top-4">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Rp {formatPrice(roomType.price)}
              <span className="text-sm font-normal text-gray-600 ml-1">/bulan</span>
            </h3>

            <div className="border-t border-b border-gray-100 py-4 my-4">
              <h4 className="font-medium text-gray-800 mb-3">Informasi Tambahan:</h4>
              <div className="space-y-2">
                <p className="text-sm text-gray-600 flex items-center">
                  <Zap className="w-4 h-4 mr-2 text-gray-500" />
                  Token listrik bayar sendiri
                </p>
                <p className="text-sm text-gray-600 flex items-center">
                  <Droplets className="w-4 h-4 mr-2 text-gray-500" />
                  Termasuk token air
                </p>
              </div>
            </div>

            <Link
              href={`https://wa.me/6285215810688?text=Halo,%20saya%20tertarik%20dengan%20Kost%20${roomType.room_type}`}
              target="_blank"
              className="block w-full"
            >
              <button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg mb-4 transition-colors duration-200">
                Pesan Sekarang
              </button>
            </Link>
          </div>
        </div>
      </div>

      {isImageFullscreen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setIsImageFullscreen(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <button
            title="Close"
              className="absolute top-4 right-4 bg-white rounded-full p-2 text-black"
              onClick={() => setIsImageFullscreen(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <Image
              src={`${url}/${roomType.image}`}
              alt={`Kost ${roomType.room_type}`}
              className="object-contain max-h-[85vh]"
              width={1200}
              height={900}
            />
          </div>
        </div>
      )}
    </main>
  )
}
