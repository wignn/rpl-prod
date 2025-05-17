"use client"

import type React from "react"
import { useState, useEffect } from "react"
import type { FinanceDetailsResponse } from "@/types/finance"
import { apiRequest } from "@/lib/api"
import { z } from "zod"

const financeFormSchema = z.object({
  id_finance: z.string().optional(),
  type: z.enum(["INCOME", "OUTCOME"]),
  category: z.string().min(3, "Kategori wajib diisi minimal 3 karakter"),
  amount: z
    .string()
    .min(3, "Jumlah wajib diisi minimal 3 karakter")
    .refine((val) => !isNaN(Number(val.replace(/\./g, ""))), {
      message: "Jumlah harus berupa angka valid",
    }),
  payment_date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Tanggal tidak valid",
  }),
  id_tenant: z.string().min(1, "Penyewa wajib dipilih"),
  id_rent: z.string().optional(),
})

type FormData = z.infer<typeof financeFormSchema>

interface TransactionModalProps {
  transaction: FinanceDetailsResponse | null
  onClose: () => void
  showAlert: (type: "success" | "error", message: string) => void
  onRefresh: () => void
  accessToken: string
}

enum INOUT {
  INCOME = "INCOME",
  OUTCOME = "OUTCOME",
}

interface Tenant {
  id_tenant: string
  full_name: string
  room?: {
    id_room: string
    room_name: string
    rent_in: string
    rent_out: string | null
    status: string
  }
  rent?: {
    id_rent: string
    id_tenant: string
    id_room: string
    rent_date: string
    rent_out: string | null
  }
}

export function TransactionModal({ onClose, transaction, accessToken, showAlert, onRefresh }: TransactionModalProps) {
  const isEditing = !!transaction
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState<FormData>({
    id_finance: transaction?.id_finance || "",
    type: transaction?.type || INOUT.INCOME,
    category: transaction?.category || "",
    amount: transaction?.amount ? formatNumberWithDots(transaction.amount) : "",
    payment_date: transaction?.payment_date
      ? new Date(transaction.payment_date).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
    id_tenant: transaction?.id_tenant || "",
    id_rent: transaction?.id_rent || "",
  })

  // Format number with dots as thousand separators
  function formatNumberWithDots(num: number | string): string {
    return Number(num).toLocaleString("id-ID").replace(/,/g, ".")
  }

  // Parse formatted number back to number
  function parseFormattedNumber(formattedNum: string): number {
    return Number(formattedNum.replace(/\./g, ""))
  }

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const tenantsData = await apiRequest<Tenant[]>({
          endpoint: "/tenant",
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })

        if (tenantsData) {
          setTenants(tenantsData)
        }
      } catch (err) {
        showAlert("error", "Gagal memuat data penyewa. Silakan coba lagi.")
        throw err
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [accessToken])

  useEffect(() => {
    const selectedTenant = tenants.find((t) => t.id_tenant === formData.id_tenant)
    if (selectedTenant?.room?.id_room) {
      setFormData((prev) => ({
        ...prev,
        id_rent: selectedTenant.rent?.id_rent || "",
      }))
    }
  }, [formData.id_tenant, tenants])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    if (name === "amount") {
      // Handle amount field with formatting
      const numericValue = value.replace(/\./g, "")
      if (numericValue === "" || /^\d+$/.test(numericValue)) {
        const formattedValue = numericValue === "" ? "" : formatNumberWithDots(numericValue)
        setFormData((prev) => ({
          ...prev,
          [name]: formattedValue,
        }))
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }

    // Clear error for this field when user makes changes
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
      financeFormSchema.parse(formData)
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

    const payload = {
      ...formData,
      amount: parseFormattedNumber(formData.amount),
    }

    try {
      const res = await apiRequest<FinanceDetailsResponse>({
        endpoint: isEditing ? `/finance/${formData.id_finance}` : "/finance",
        method: isEditing ? "PUT" : "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: {
          id_tenant: payload.id_tenant,
          id_rent: payload.id_rent,
          type: payload.type,
          category: payload.category,
          amount: payload.amount,
          payment_date: payload.payment_date,
        },
      })

      if (res) {
        showAlert("success", "Transaksi berhasil disimpan.")
        onRefresh()
        onClose()
      } else {
        showAlert("error", "Gagal menyimpan transaksi. Silakan coba lagi.")
      }
    } catch (err) {
      showAlert("error", "Terjadi kesalahan saat menyimpan transaksi.")
      throw err
    }
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {isEditing ? "Edit Transaksi" : "Tambah Transaksi Baru"}
            </h3>
            <button title="x" onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-slate-500"></div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                  Tipe Transaksi
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md ${errors.type ? "border-red-500" : "border-gray-300"}`}
                  required
                >
                  <option value={INOUT.INCOME}>Pemasukan</option>
                  <option value={INOUT.OUTCOME}>Pengeluaran</option>
                </select>
                {errors.type && <p className="mt-1 text-xs text-red-500">{errors.type}</p>}
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Kategori
                </label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="Contoh: Sewa Kamar, Listrik, dll"
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.category ? "border-red-500" : "border-gray-300"
                  }`}
                  required
                />
                {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category}</p>}
              </div>

              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                  Jumlah (Rp)
                </label>
                <input
                  type="text"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="0"
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.amount ? "border-red-500" : "border-gray-300"
                  }`}
                  required
                />
                {errors.amount && <p className="mt-1 text-xs text-red-500">{errors.amount}</p>}
              </div>

              <div>
                <label htmlFor="payment_date" className="block text-sm font-medium text-gray-700 mb-1">
                  Tanggal
                </label>
                <input
                  type="date"
                  id="payment_date"
                  name="payment_date"
                  value={formData.payment_date}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.payment_date ? "border-red-500" : "border-gray-300"
                  }`}
                  required
                />
                {errors.payment_date && <p className="mt-1 text-xs text-red-500">{errors.payment_date}</p>}
              </div>

              <div>
                <label htmlFor="id_tenant" className="block text-sm font-medium text-gray-700 mb-1">
                  Penyewa
                </label>
                <select
                  id="id_tenant"
                  name="id_tenant"
                  value={formData.id_tenant}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.id_tenant ? "border-red-500" : "border-gray-300"
                  }`}
                  required
                >
                  <option value="">Pilih Penyewa</option>
                  {tenants.map((tenant) => (
                    <option key={tenant.id_tenant} value={tenant.id_tenant}>
                      {tenant.full_name}
                    </option>
                  ))}
                </select>
                {errors.id_tenant && <p className="mt-1 text-xs text-red-500">{errors.id_tenant}</p>}
              </div>

              <div>
                <label htmlFor="id_rent" className="block text-sm font-medium text-gray-700 mb-1">
                  Kamar
                </label>
                <select
                  id="id_rent"
                  name="id_rent"
                  value={formData.id_rent}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
                >
                  <option value="">
                    {formData.id_rent
                      ? tenants.find((t) => t.id_tenant === formData.id_tenant)?.room?.id_room
                      : "Pilih kamar"}
                  </option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md text-sm font-medium text-white bg-slate-600 hover:bg-slate-700"
                >
                  {isEditing ? "Simpan Perubahan" : "Simpan"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
