"use client"

import { useState, useEffect } from "react"
import { Home, Users, BarChart2, Menu, X, Bed, DoorClosed, Receipt, RefreshCcwIcon } from "lucide-react"
import Link from "next/link"
interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)

    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (isMobileOpen && isMobile && !target.closest(".sidebar-content")) {
        setIsMobileOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isMobileOpen, isMobile])

  useEffect(() => {
    if (isMobile) {
      if (isMobileOpen) {
        document.body.style.overflow = "hidden"
      } else {
        document.body.style.overflow = "auto"
      }
    }

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isMobileOpen, isMobile])

  const handleMenuItemClick = (tab: string) => {
    setActiveTab(tab)
    if (isMobile) {
      setIsMobileOpen(false)
    }
  }

  return (
    <>
      <div className="fixed top-4 left-4 z-30 md:hidden">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 rounded-lg bg-white shadow-md text-gray-700 hover:bg-gray-100"
        >
          {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {isMobile && isMobileOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden" />}
      <div
        className={`sidebar-content fixed md:static inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          isMobile ? (isMobileOpen ? "translate-x-0" : "-translate-x-full") : "translate-x-0"
        } md:translate-x-0`}
      >
        <div className="p-4 border-b flex items-center justify-between">
          <Link href="/" className="flex items-center">
          <h1 className="text-xl font-bold text-green-600">Green Jaya Kost</h1>
          </Link>
          {isMobile && (
            <button
              title="x"
              onClick={() => setIsMobileOpen(false)}
              className="p-1 rounded-full hover:bg-gray-100 md:hidden"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          )}
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => handleMenuItemClick("dashboard")}
                className={`flex items-center w-full p-3 rounded-lg text-left ${
                  activeTab === "dashboard" ? "bg-green-500 text-white" : "text-gray-700 hover:bg-green-100"
                }`}
              >
                <Home className="w-5 h-5 mr-3" />
                <span>Dashboard</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => handleMenuItemClick("rooms")}
                className={`flex items-center w-full p-3 rounded-lg text-left ${
                  activeTab === "rooms" ? "bg-green-500 text-white" : "text-gray-700 hover:bg-green-100"
                }`}
              >
                <Bed className="w-5 h-5 mr-3" />
                <span>Tipe Kamar</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => handleMenuItemClick("users")}
                className={`flex items-center w-full p-3 rounded-lg text-left ${
                  activeTab === "users" ? "bg-green-500 text-white" : "text-gray-700 hover:bg-green-100"
                }`}
              >
                <Users className="w-5 h-5 mr-3" />
                <span>Penghuni</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => handleMenuItemClick("reports")}
                className={`flex items-center w-full p-3 rounded-lg text-left ${
                  activeTab === "reports" ? "bg-green-500 text-white" : "text-gray-700 hover:bg-green-100"
                }`}
              >
                <BarChart2 className="w-5 h-5 mr-3" />
                <span>Report</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => handleMenuItemClick("roomList")}
                className={`flex items-center w-full p-3 rounded-lg text-left ${
                  activeTab === "roomList" ? "bg-green-500 text-white" : "text-gray-700 hover:bg-green-100"
                }`}
              >
                <DoorClosed className="w-5 h-5 mr-3" />
                <span>Daftar Kamar</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => handleMenuItemClick("transactions")}
                className={`flex items-center w-full p-3 rounded-lg text-left ${
                  activeTab === "transactions" ? "bg-green-500 text-white" : "text-gray-700 hover:bg-green-100"
                }`}
              >
                <Receipt className="w-5 h-5 mr-3" />
                <span>Transaksi</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => handleMenuItemClick("facilities")}
                className={`flex items-center w-full p-3 rounded-lg text-left ${
                  activeTab === "facilities" ? "bg-green-500 text-white" : "text-gray-700 hover:bg-green-100"
                }`}
              >
                <DoorClosed className="w-5 h-5 mr-3" />
                <span>Fasilitas</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => handleMenuItemClick("records")}
                className={`flex items-center w-full p-3 rounded-lg text-left ${
                  activeTab === "records" ? "bg-green-500 text-white" : "text-gray-700 hover:bg-green-100"
                }`}
              >
                <RefreshCcwIcon className="w-5 h-5 mr-3" />
                <span>Record</span>
              </button>
            </li>
            {/* <li>
              <button
                onClick={() => handleMenuItemClick("settings")}
                className={`flex items-center w-full p-3 rounded-lg text-left ${
                  activeTab === "settings" ? "bg-green-500 text-white" : "text-gray-700 hover:bg-green-100"
                }`}
              >
                <Settings className="w-5 h-5 mr-3" />
                <span>Pengaturan</span>
              </button>
            </li> */}
          </ul>
        </nav>
      </div>
    </>
  )
}
