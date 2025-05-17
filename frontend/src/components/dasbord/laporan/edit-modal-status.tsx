"use client"

import { useState, useEffect, useRef } from "react"
import { Check, X } from "lucide-react"
import { apiRequest } from "@/lib/api"
import type { ReportUpdateRequest } from "@/types/report"

interface EditStatusModalProps {
  isOpen: boolean
  onClose: () => void
  reportId: string
  currentStatus: string
  onStatusUpdated: () => void
  OnRefresh: () => void
  showAlert: (type: "success" | "error", message: string) => void
  accessToken: string
}

export function EditStatusModal({
  isOpen,
  onClose,
  showAlert,
  reportId,
  currentStatus,
  OnRefresh,
  onStatusUpdated,
  accessToken,
}: EditStatusModalProps) {
  const [status, setStatus] = useState(currentStatus.toLowerCase())
  const [isSubmitting, setIsSubmitting] = useState(false)
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

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)
  
      if (status === currentStatus) {
        onClose()
        return
      }
      const res =  await apiRequest<ReportUpdateRequest>({
        endpoint: `/report/${reportId}`,
        method: "PUT",
        body: { status: status.toUpperCase() },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      if (res) {
        showAlert(
          "success",
          "Status berhasil di simpan."
        )
        onStatusUpdated()
        OnRefresh()
        onClose()
      }else {
        showAlert("error", "Gagal memperbarui status. Silakan coba lagi.")
      }


    } catch (error) {
      showAlert("error", "Gagal memperbarui status. Silakan coba lagi.")
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div ref={modalRef} className="bg-white rounded-lg shadow-lg w-full max-w-md overflow-hidden">
        <div className="p-4 border-b">
          <h3 className="text-lg font-medium">Update Status</h3>
        </div>

        <div className="p-4">
          <div className="py-2">
            <label htmlFor="status-select" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status-select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="p-4 border-t flex justify-between">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
          >
            <X className="mr-2 h-4 w-4" />
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Updating...
              </span>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Save
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
