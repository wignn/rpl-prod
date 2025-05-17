"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { X } from 'lucide-react'
import { apiRequest } from "@/lib/api"
import type { RoomDetailResponse } from "@/types/room"
import type { TenantCreateRequest, TenantWithRentAndRoom } from "@/types/tenat"
import { z } from "zod"

enum ROOMSTATUS {
  AVAILABLE = "AVAILABLE",
  NOTAVAILABLE = "NOTAVAILABLE",
}

// Define Zod schema for form validation
const tenantFormSchema = z.object({
  nama: z.string().min(3, "Nama wajib diisi"),
  nomorTelepon: z
    .string()
    .min(1, "Nomor telepon wajib diisi")
    .regex(/^[0-9]{10,15}$/, "Nomor telepon harus berisi 10-15 digit angka"),
  status: z.enum(["SINGLE", "MARRIED"], {
    errorMap: () => ({ message: "Status wajib dipilih" }),
  }),
  alamat: z.string().min(3, "Alamat wajib diisi"),
  room: z.string().min(3, "Kamar wajib dipilih"),
  harga: z.string().optional(),
  tanggalMasuk: z
    .string()
    .min(3, "Tanggal masuk wajib diisi")
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Format tanggal tidak valid",
    }),
  noKtp: z
    .string()
    .min(16, "Nomor KTP wajib diisi")
    .regex(/^[0-9]{16}$/, "Nomor KTP harus berisi 16 digit angka"),
})

type FormData = z.infer<typeof tenantFormSchema>

interface TenantModalProps {
  isOpen: boolean
  onClose: () => void
  onRefresh: () => void
  showAlert: (type: "success" | "error", message: string) => void
  tenant?: TenantWithRentAndRoom
  accessToken?: string
}

export default function TenantModal({
  isOpen,
  onClose,
  showAlert,
  onRefresh,
  tenant,
  accessToken,
}: TenantModalProps) {
  const [rooms, setRooms] = useState<RoomDetailResponse[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const isUpdateMode = !!tenant

  const [formData, setFormData] = useState<FormData>({
    nama: "",
    nomorTelepon: "",
    status: "SINGLE",
    alamat: "",
    room: "",
    harga: "",
    tanggalMasuk: "",
    noKtp: "",
  })

  useEffect(() => {
    if (tenant) {
      setFormData({
        nama: tenant.full_name || "",
        nomorTelepon: tenant.no_telp || "",
        status: (tenant.status as "SINGLE" | "MARRIED") || "SINGLE",
        alamat: tenant.address || "",
        room: tenant.room?.id_room || "",
        harga: "",
        tanggalMasuk: tenant.rent?.rent_date ? new Date(tenant.rent.rent_date).toISOString().split("T")[0] : "",
        noKtp: tenant.no_ktp || "",
      })
    } else {
      resetForm()
    }
  }, [tenant, isOpen])

  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        setIsLoading(true)
        try {
          const response = await apiRequest<RoomDetailResponse[]>({
            endpoint: "/room",
            method: "GET",
          })
          if (response) {
            setRooms(response)
          } else {
            showAlert("error", "Gagal memuat data kamar. Silakan coba lagi.")
          }
        } catch (error) {
          showAlert("error", "Gagal memuat data kamar. Silakan coba lagi.")
          throw error
        } finally {
          setIsLoading(false)
        }
      }
      fetchData()
    }
  }, [isOpen, showAlert])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    if (name === "room") {
      const selectedRoom = rooms.find((r) => r.id_room === value)
      setFormData((prev) => ({
        ...prev,
        room: value,
        harga: selectedRoom ? selectedRoom.roomtype.price.toString() : "",
      }))
    } else if (name === "nomorTelepon") {
      if (value === "" || /^\d+$/.test(value)) {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }))
      }
    } else if (name === "noKtp") {
      if (value === "" || /^\d+$/.test(value)) {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }))
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = (): boolean => {
    try {
      tenantFormSchema.parse(formData)
      setErrors({})
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {}
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message
          }
        })
        setErrors(newErrors)
      }
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) {
      return
    }
    setIsSubmitting(true)

    try {
      const requestData = {
        full_name: formData.nama,
        no_telp: formData.nomorTelepon,
        address: formData.alamat,
        id_room: formData.room,
        rent_in: new Date(formData.tanggalMasuk),
        status: formData.status,
        no_ktp: formData.noKtp,
      }

      let res

      if (isUpdateMode && tenant?.id_tenant) {
        res = await apiRequest<TenantCreateRequest>({
          endpoint: `/tenant/${tenant.id_tenant}`,
          method: "PUT",
          body: requestData,
          headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
        })
      } else {
        res = await apiRequest<TenantCreateRequest>({
          endpoint: "/tenant",
          method: "POST",
          body: requestData,
          headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
        })
      }

      if (res) {
        showAlert("success", `Data penghuni berhasil ${isUpdateMode ? "diperbarui" : "disimpan"}`)
        onRefresh()
        resetForm()
        onClose()
      } else {
        showAlert("error", "Gagal menyimpan data penghuni. Silakan coba lagi.")
      }
    } catch (error) {
      showAlert("error", "Gagal menyimpan data penghuni. Silakan coba lagi.")
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({
      nama: "",
      nomorTelepon: "",
      status: "SINGLE",
      alamat: "",
      room: "",
      harga: "",
      tanggalMasuk: "",
      noKtp: "",
    })
    setErrors({})
  }

  if (!isOpen) return null

  const availableRooms = isUpdateMode
    ? [...rooms.filter((r) => r.status === ROOMSTATUS.AVAILABLE || r.id_room === formData.room)]
    : rooms.filter((r) => r.status === ROOMSTATUS.AVAILABLE)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center z-10">
          <h2 className="text-xl font-semibold text-gray-800">
            {isUpdateMode ? "Edit Penghuni" : "Tambah Penghuni Baru"}
          </h2>
          <button title="Close" onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nama */}
                <div className="space-y-2">
                  <label htmlFor="nama" className="block text-sm font-medium text-gray-700">
                    Nama
                  </label>
                  <input
                    type="text"
                    id="nama"
                    name="nama"
                    value={formData.nama}
                    onChange={handleChange}
                    className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      errors.nama ? "border-red-500" : "border-gray-300"
                    }`}
                    required
                  />
                  {errors.nama && <p className="mt-1 text-xs text-red-500">{errors.nama}</p>}
                </div>

                {/* Room */}
                <div className="space-y-2">
                  <label htmlFor="room" className="block text-sm font-medium text-gray-700">
                    Pilih Kamar
                  </label>
                  <select
                    id="room"
                    name="room"
                    value={formData.room}
                    onChange={handleChange}
                    className={`w-full p-2 border rounded-lg bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      errors.room ? "border-red-500" : "border-gray-300"
                    }`}
                    required
                  >
                    <option value="" disabled>
                      Pilih kamar tersedia
                    </option>
                    {availableRooms.map((r, i) => (
                      <option key={r.id_room} value={r.id_room}>
                        {i + 1}. {r.roomtype.room_type} - {`Kamar ${r.id_room}`} - Rp
                        {r.roomtype.price.toLocaleString()}
                      </option>
                    ))}
                  </select>
                  {errors.room && <p className="mt-1 text-xs text-red-500">{errors.room}</p>}
                </div>

                {/* Nomor Telepon */}
                <div className="space-y-2">
                  <label htmlFor="nomorTelepon" className="block text-sm font-medium text-gray-700">
                    Nomor Telepon
                  </label>
                  <input
                    type="tel"
                    id="nomorTelepon"
                    name="nomorTelepon"
                    value={formData.nomorTelepon}
                    onChange={handleChange}
                    placeholder="Contoh: 081234567890"
                    className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      errors.nomorTelepon ? "border-red-500" : "border-gray-300"
                    }`}
                    required
                  />
                  {errors.nomorTelepon && <p className="mt-1 text-xs text-red-500">{errors.nomorTelepon}</p>}
                </div>

                {/* Harga */}
                <div className="space-y-2">
                  <label htmlFor="harga" className="block text-sm font-medium text-gray-700">
                    Harga
                  </label>
                  <input
                    type="text"
                    id="harga"
                    name="harga"
                    value={formData.harga ? `Rp ${Number(formData.harga).toLocaleString("id-ID")}` : ""}
                    className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50"
                    readOnly
                  />
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className={`w-full p-2 border rounded-lg bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      errors.status ? "border-red-500" : "border-gray-300"
                    }`}
                    required
                  >
                    <option value="MARRIED">Married</option>
                    <option value="SINGLE">Single</option>
                  </select>
                  {errors.status && <p className="mt-1 text-xs text-red-500">{errors.status}</p>}
                </div>

                {/* No KTP */}
                <div className="space-y-2">
                  <label htmlFor="noKtp" className="block text-sm font-medium text-gray-700">
                    No KTP
                  </label>
                  <input
                    type="text"
                    id="noKtp"
                    name="noKtp"
                    value={formData.noKtp}
                    onChange={handleChange}
                    placeholder="16 digit nomor KTP"
                    className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      errors.noKtp ? "border-red-500" : "border-gray-300"
                    }`}
                    required
                    maxLength={16}
                  />
                  {errors.noKtp && <p className="mt-1 text-xs text-red-500">{errors.noKtp}</p>}
                </div>

                {/* Alamat */}
                <div className="space-y-2 md:col-span-1">
                  <label htmlFor="alamat" className="block text-sm font-medium text-gray-700">
                    Alamat
                  </label>
                  <textarea
                    id="alamat"
                    name="alamat"
                    value={formData.alamat}
                    onChange={handleChange}
                    rows={4}
                    className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      errors.alamat ? "border-red-500" : "border-gray-300"
                    }`}
                    required
                  />
                  {errors.alamat && <p className="mt-1 text-xs text-red-500">{errors.alamat}</p>}
                </div>

                {/* Tanggal Masuk */}
                <div className="space-y-2">
                  <label htmlFor="tanggalMasuk" className="block text-sm font-medium text-gray-700">
                    Tanggal Masuk
                  </label>
                  <input
                    type="date"
                    id="tanggalMasuk"
                    name="tanggalMasuk"
                    value={formData.tanggalMasuk}
                    onChange={handleChange}
                    className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      errors.tanggalMasuk ? "border-red-500" : "border-gray-300"
                    }`}
                    required
                  />
                  {errors.tanggalMasuk && <p className="mt-1 text-xs text-red-500">{errors.tanggalMasuk}</p>}
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  disabled={isSubmitting}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors disabled:bg-green-300"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Menyimpan...
                    </span>
                  ) : isUpdateMode ? (
                    "Perbarui"
                  ) : (
                    "Simpan"
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
