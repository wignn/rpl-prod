"use client"

import { useCallback, useEffect, useState } from "react"
import { apiRequest } from "@/lib/api"
import type { PaginatedReportResponse } from "@/types/report"
import ReportFilter from "@/components/dasbord/laporan/Filter"
import ReportTable from "@/components/dasbord/laporan/Tabel"
import ReportSkeleton from "@/components/sekleton/report"
import AlertMessage from "../alert/alertMessage"
import PageError from "../Error/PageError"


interface ReportContentProps {
  accessToken: string
}

export default function ReportContent({ accessToken }: ReportContentProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reportData, setReportData] = useState<PaginatedReportResponse | null>(null)
  const [page, setPage] = useState(1)
  const [month, setMonth] = useState(new Date().toLocaleString("default", { month: "long" }))
  const [searchQuery, setSearchQuery] = useState("")
  const [alert, setAlert] = useState({
    type: "success" as "success" | "error",
    message: "",
    isOpen: false,
  })

  const showAlert = (type: "success" | "error", message: string) => {
    setAlert({
      type,
      message,
      isOpen: true,
    })
  }
  const limit = 5
  const fetchReportData = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        _t: Date.now().toString(),
      })
      if (month.toLowerCase() !== "semua") {
        queryParams.append("month", month.toLowerCase())
      }
  
      if (searchQuery) {
        queryParams.append("search", searchQuery)
      }
  
      const result = await apiRequest<PaginatedReportResponse>({
        endpoint: `/report?${queryParams.toString()}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      setReportData(result)
    } catch (error) {
      setError("Gagal memuat data laporan. Silakan coba lagi.")
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [accessToken, month, page, searchQuery]) 
  

  useEffect(() => {
    fetchReportData()
  }, [page, month, searchQuery, accessToken , fetchReportData])

  const handlePageChange = (newPage: number) => {
      setPage(newPage)
  }

  const handleMonthChange = (newMonth: string) => {
    setMonth(newMonth)
    setPage(1)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setPage(1) 
  }

  if (isLoading) {
    return <ReportSkeleton />
  }

  if (error) {
    return <PageError error={error} onRefresh={fetchReportData}/>
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Laporan</h2>

      <ReportFilter
        currentMonth={month}
        onRefresh={fetchReportData}
        isLoading={isLoading}
        onMonthChange={handleMonthChange}
        onSearch={handleSearch}
        searchQuery={searchQuery}
      />

      {reportData && (
        <ReportTable
          showAlert={showAlert}
          data={reportData.data}
          currentPage={reportData.currentPage}
          totalPages={reportData.totalPages}
          totalItems={reportData.totalItems}
          onPageChange={handlePageChange}
          onRefresh={fetchReportData}
          accessToken={accessToken}
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
