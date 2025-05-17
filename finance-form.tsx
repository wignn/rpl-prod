"use client"

import type React from "react"

import { useState } from "react"


interface FinanceFormProps {
  onClose: () => void
}

enum INOUT {
  INCOME = "INCOME",
  OUTCOME = "OUTCOME",
}
export function FinanceForm({ onClose }: FinanceFormProps) {
  const [formData, setFormData] = useState({
    type: INOUT.INCOME,
    category: "",
    amount: "",
    payment_date: new Date().toISOString().split("T")[0],
    id_tenant: "",
    id_rent: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the data to your API
    console.log("Form submitted:", formData)
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Tambah Transaksi Baru</h3>

      <div className="grid grid-cols-1 gap-4">
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
            Tipe Transaksi
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500"
            required
          >
            <option value={INOUT.INCOME}>Pemasukan</option>
            <option value={INOUT.OUTCOME}>Pengeluaran</option>
          </select>
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500"
            required
          />
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
            Jumlah (Rp)
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500"
            required
          />
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500"
            required
          />
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500"
            required
          >
            <option value="">Pilih Penyewa</option>
            <option value="tenant-1">Ahmad Fauzi</option>
            <option value="tenant-2">Budi Santoso</option>
            <option value="tenant-3">Citra Dewi</option>
          </select>
        </div>

        <div>
          <label htmlFor="id_rent" className="block text-sm font-medium text-gray-700 mb-1">
            Kamar
          </label>
          <select
            id="id_rent"
            name="id_rent"
            value={formData.id_rent}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500"
            required
          >
            <option value="">Pilih Kamar</option>
            <option value="rent-1">Kamar A1</option>
            <option value="rent-2">Kamar A2</option>
            <option value="rent-3">Kamar B1</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
        >
          Batal
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-slate-600 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
        >
          Simpan
        </button>
      </div>
    </form>
  )
}

