"use client"

import { useState } from "react"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="bg-white shadow-sm py-4">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold text-slate-800">KosApp</div>

          <button title="x" className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
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
              {isMenuOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M3 12h18M3 6h18M3 18h18" />}
            </svg>
          </button>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-black hover:text-slate-600 transition-colors">
              Beranda
            </a>
            <a href="#" className="text-black hover:text-slate-600 transition-colors">
              Tipe Kamar
            </a>
            <a href="#" className="text-black hover:text-slate-600 transition-colors">
              Laporan
            </a>
            <a href="#" className="text-black hover:text-slate-600 transition-colors">
              Data Penyewa
            </a>
            <a href="#" className="text-black hover:text-slate-600 transition-colors">
              Keuangan
            </a>
            <button className="px-6 py-2 border border-zinc-900 rounded-xl hover:bg-slate-100 transition-colors">
              Logout
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 flex flex-col space-y-4">
            <a href="#" className="text-black hover:text-slate-600 transition-colors py-2">
              Beranda
            </a>
            <a href="#" className="text-black hover:text-slate-600 transition-colors py-2">
              Tipe Kamar
            </a>
            <a href="#" className="text-black hover:text-slate-600 transition-colors py-2">
              Laporan
            </a>
            <a href="#" className="text-black hover:text-slate-600 transition-colors py-2">
              Data Penyewa
            </a>
            <a href="#" className="text-black hover:text-slate-600 transition-colors py-2">
              Keuangan
            </a>
            <button className="px-6 py-2 border border-zinc-900 rounded-xl hover:bg-slate-100 transition-colors">
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}

