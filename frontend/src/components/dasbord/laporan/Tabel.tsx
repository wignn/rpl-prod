"use client"

import { useState } from "react"
import { Pencil, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"
import type { PaginatedReportResponse } from "@/types/report"
import { formatDate } from "@/lib/utils/dateNormalize"
import { EditStatusModal } from "./edit-modal-status"
import AlertMessage from "@/components/alert/alertMessage"

interface ReportTableProps extends PaginatedReportResponse {
  onPageChange: (page: number) => void
  accessToken: string
  showAlert: (type: "success" | "error", message: string) => void
  onRefresh: () => void
}

export default function ReportTable({
  data,
  currentPage,
  totalPages,
  onPageChange,
  showAlert,
  onRefresh,
  accessToken,
}: ReportTableProps) {
  const [editingReport, setEditingReport] = useState<{
    id: string
    status: string
  } | null>(null)

    const [alert, setAlert] = useState({
      type: "success" as "success" | "error",
      message: "",
      isOpen: false,
    })
  

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "text-yellow-500"
      case "completed":
        return "text-green-500"
      case "rejected":
        return "text-red-500"
      default:
        return "text-gray-500"
    }
  }

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      onPageChange(page)
    }
  }

  const handleEditClick = (id: string, status: string) => {
    setEditingReport({ id, status })
  }

  const handleCloseModal = () => {
    setEditingReport(null)
  }

  const handleStatusUpdated = async () => {
    onPageChange(currentPage)
    setEditingReport(null)
  }

  return (
    <div className="mt-4 rounded-lg bg-white p-6 shadow-md">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b text-left">
              <th className="pb-2 pl-2">No.</th>
              <th className="pb-2">
                Nama Pengirim
                <ChevronDown className="ml-1 inline h-4 w-4" />
              </th>
              <th className="pb-2">
                Masa Berlaku
                <ChevronDown className="ml-1 inline h-4 w-4" />
              </th>
              <th className="pb-2">
                Status
                <ChevronDown className="ml-1 inline h-4 w-4" />
              </th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-4 text-center text-gray-500">
                  Tidak ada data laporan untuk bulan ini
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item.id_report} className="border-b">
                  <td className="py-3 pl-2">{item.count}</td>
                  <td className="py-3">{item.tenant.full_name}</td>
                  <td className="py-3">{formatDate(item.created_at.toString())}</td>
                  <td className="flex items-center justify-between py-3">
                    <span className={getStatusColor(item.status)}>{item.status}</span>
                    <button
                      title="Edit status"
                      className="rounded p-1 text-blue-500 hover:bg-blue-50 transition-colors"
                      onClick={() => handleEditClick(item.id_report, item.status)}
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center space-x-1">
          <button
            title="previous page"
            className="rounded px-2 py-1 hover:bg-gray-100"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum
            if (totalPages <= 5) {
              pageNum = i + 1
            } else if (currentPage <= 3) {
              pageNum = i + 1
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i
            } else {
              pageNum = currentPage - 2 + i
            }

            return (
              <button
                key={pageNum}
                className={`rounded px-3 py-1 ${
                  currentPage === pageNum ? "bg-gray-800 text-white" : "hover:bg-gray-100"
                }`}
                onClick={() => handlePageChange(pageNum)}
              >
                {pageNum}
              </button>
            )
          })}

          <button
            title="next page"
            className="rounded px-2 py-1 hover:bg-gray-100"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {editingReport && (
        <EditStatusModal
          isOpen={!!editingReport}
          onClose={handleCloseModal}
          OnRefresh={onRefresh}
          reportId={editingReport.id}
          currentStatus={editingReport.status}
          onStatusUpdated={handleStatusUpdated}
          accessToken={accessToken}
          showAlert={showAlert}
        />
      )}

      

      <AlertMessage  
       type={alert.type}
       message={alert.message}
       isOpen={alert.isOpen}
       onClose={() => setAlert({ ...alert, isOpen: false })}
      />
    </div>
  )
}
