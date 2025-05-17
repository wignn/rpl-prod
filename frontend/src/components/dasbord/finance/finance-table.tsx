"use client"

import { type FinanceDetailsResponse } from "@/types/finance"
enum INOUT {
  INCOME = "INCOME",
  OUTCOME = "OUTCOME",
}

interface FinanceTableProps {
  data: FinanceDetailsResponse[]
  onEdit: (transaction: FinanceDetailsResponse) => void
}

export function FinanceTable({ data, onEdit }: FinanceTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Penyewa</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipe</th>
            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah</th>
            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((finance) => (
            <tr key={finance.id_finance} className="hover:bg-gray-50">
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                {new Date(finance.payment_date).toLocaleDateString("id-ID")}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{finance.category}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{finance.tenant.name}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    finance.type === INOUT.INCOME ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {finance.type === INOUT.INCOME ? "Pemasukan" : "Pengeluaran"}
                </span>
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-medium">
                <span className={finance.type === INOUT.INCOME ? "text-green-600" : "text-red-600"}>
                  {finance.amount.toLocaleString("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    minimumFractionDigits: 0,
                  })}
                </span>
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
                <button
                  title="Edit"
                  onClick={() => onEdit(finance)}
                  className="p-2 text-gray-500 hover:text-slate-700 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

