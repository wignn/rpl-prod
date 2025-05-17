"use client"

import { useEffect, useRef } from "react"
import { X, Phone, MapPin, CreditCard, Calendar, Home, UserCheck } from "lucide-react"

interface TenantRent {
  id_rent: string | null
  id_tenant: string | null
  id_room: string | null
  rent_date: string | null
  rent_out: string | null
}

interface TenantRoom {
  id_room: string
  room_name: string | null
  rent_in: string | null
  rent_out: string | null
  status: string | null
}

interface Tenant {
  id_tenant: string
  address: string
  no_ktp: string
  status: string
  no_telp: string
  full_name: string
  rent: TenantRent
  room: TenantRoom | null
}

interface TenantDetailModalProps {
  isOpen: boolean
  onClose: () => void
  tenant: Tenant | null
}

export default function RecordDetailModal({ isOpen, onClose, tenant }: TenantDetailModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  // Handle ESC key press
  useEffect(() => {
    function handleEscKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscKey)
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey)
    }
  }, [isOpen, onClose])

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-"
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  if (!isOpen || !tenant) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div ref={modalRef} className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center z-10">
          <h2 className="text-xl font-semibold text-gray-800">Detail Penghuni</h2>
          <button title="Close" onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 space-y-6">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mr-4">
                  <span className="text-green-600 font-bold text-2xl">{tenant.full_name.charAt(0).toUpperCase()}</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{tenant.full_name}</h3>
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      !tenant.room?.rent_out ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {!tenant.room?.rent_out ? "Aktif" : "Tidak Aktif"}
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                <h4 className="font-medium text-gray-700">Informasi Pribadi</h4>

                <div className="flex items-start">
                  <UserCheck className="w-5 h-5 text-gray-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Status Pernikahan</p>
                    <p className="text-sm text-gray-600">
                      {tenant.status === "MARRIED" ? "Menikah" : tenant.status === "SINGLE" ? "Lajang" : tenant.status}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Phone className="w-5 h-5 text-gray-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Nomor Telepon</p>
                    <p className="text-sm text-gray-600">{tenant.no_telp}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <CreditCard className="w-5 h-5 text-gray-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Nomor KTP</p>
                    <p className="text-sm text-gray-600">{tenant.no_ktp}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-gray-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Alamat</p>
                    <p className="text-sm text-gray-600">{tenant.address}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Room Info */}
            <div className="flex-1 space-y-6">
              <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                <h4 className="font-medium text-gray-700">Informasi Kamar</h4>

                <div className="flex items-start">
                  <Home className="w-5 h-5 text-gray-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Tipe Kamar</p>
                    <p className="text-sm text-gray-600">{tenant.room?.room_name || "-"}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Calendar className="w-5 h-5 text-gray-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Tanggal Masuk</p>
                    <p className="text-sm text-gray-600">{formatDate(tenant.room?.rent_in || null)}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Calendar className="w-5 h-5 text-gray-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Tanggal Keluar</p>
                    <p className="text-sm text-gray-600">{formatDate(tenant.room?.rent_out || null)}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-5 h-5 flex-shrink-0 mr-3" /> {/* Spacer for alignment */}
                  <div>
                    <p className="text-sm font-medium text-gray-700">ID Kamar</p>
                    <p className="text-sm text-gray-600 font-mono">{tenant.room?.id_room || "-"}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-5 h-5 flex-shrink-0 mr-3" /> {/* Spacer for alignment */}
                  <div>
                    <p className="text-sm font-medium text-gray-700">Status Kamar</p>
                    <p className="text-sm text-gray-600">
                      {tenant.room?.status === "AVAILABLE"
                        ? "Tersedia"
                        : tenant.room?.status === "NOTAVAILABLE"
                          ? "Tidak Tersedia"
                          : tenant.room?.status || "-"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-700 mb-2">Informasi Sewa</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">ID Sewa</span>
                    <span className="text-gray-800 font-mono">{tenant.rent?.id_rent || "-"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">ID Penghuni</span>
                    <span className="text-gray-800 font-mono">{tenant.id_tenant}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tanggal Sewa</span>
                    <span className="text-gray-800">{formatDate(tenant.rent?.rent_date)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tanggal Keluar</span>
                    <span className="text-gray-800">{formatDate(tenant.rent?.rent_out)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  )
}
