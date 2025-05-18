"use client"

import type { UserDetailResponse } from "@/types/user"
import Link from "next/link"
import { signOut } from "next-auth/react"
import { useState } from "react"
import { Menu, X, Home } from 'lucide-react'

interface HeaderProps {
  tipeKamarHref: string
  user: UserDetailResponse | undefined
}

/**
 * Header component for site navigation.
 * 
 * This component renders a responsive navbar with different layouts for mobile and desktop views.
 * It includes navigation links, login/logout functionality, and special admin access when applicable.
 * 
 * Features:
 * - Responsive design with hamburger menu on mobile
 * - Navigation links (Home, About, Room Types, Order)
 * - Conditional admin access link
 * - Authentication controls (login/logout)
 * 
 * @param {Object} props - Component props
 * @param {string} props.tipeKamarHref - URL for the room types page
 * @param {Object|null} props.user - Current user object with role information, or null if not logged in
 * @param {string} [props.user.role] - User role, used to determine admin access
 * 
 * @returns {JSX.Element} Rendered header component
 */

const Header = ({ tipeKamarHref, user }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleSignOut = async () => {
    const res = await signOut({ redirect: false, callbackUrl: "/" })
    if (res?.url) {
      window.location.href = res.url
    }
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className="py-4 px-4 md:px-8 border-b border-gray-300 shadow-md relative">
      <div className="container mx-auto flex items-center justify-between">
        {/* Kost name on the left */}
        <div className="flex-shrink-0">
          <Link href="/" className="font-bold text-green-600 text-xl">
            Nama Kost
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-gray-800"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {!isMenuOpen && <Menu size={24} />}
        </button>

        {/* Desktop navigation - centered */}
        <div className="hidden md:flex items-center justify-center gap-6 flex-1">
          <Link href="/" className="font-medium text-gray-800 hover:text-green-700 flex items-center gap-1">
            <Home size={18} />
            <span>Home</span>
          </Link>
          <Link href="/about" className="font-medium text-gray-800 hover:text-green-700">
            Tentang Kami
          </Link>
          <Link href={tipeKamarHref} className="font-medium text-gray-800 hover:text-green-700">
            Tipe Kamar
          </Link>
          <Link
            href="https://wa.me/6285215810688"
            target="_blank"
            className="font-medium text-gray-800 hover:text-green-700"
          >
            Pesan
          </Link>
          {user?.role === "ADMIN" && (
            <Link href="/admin" className="font-medium text-gray-800 hover:text-green-700">
              Manage Data
            </Link>
          )}
        </div>

        {/* Login/Logout button on the right */}
        <div className="hidden md:block flex-shrink-0">
          {user ? (
            <button
              onClick={handleSignOut}
              className="bg-white border cursor-pointer border-gray-300 text-gray-700 px-5 py-1.5 rounded-md text-sm font-medium hover:bg-gray-50"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/login"
              className="bg-white border border-green-600 text-green-600 px-5 py-1.5 rounded-md text-sm font-medium hover:bg-green-50"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile navigation overlay */}
        {isMenuOpen && (
          <div className="fixed inset-0 z-50 bg-white md:hidden">
            {/* Close button positioned at the top right */}
            <button className="absolute top-4 right-4 text-gray-800" onClick={toggleMenu} aria-label="Close menu">
              <X size={24} />
            </button>

            <div className="flex flex-col items-center pt-16 pb-8 px-4 space-y-6">
              <Link
                href="/"
                className="font-medium text-gray-800 hover:text-green-700 text-lg flex items-center gap-1"
                onClick={() => setIsMenuOpen(false)}
              >
                <Home size={18} />
                <span>Home</span>
              </Link>
              <Link
                href="/about"
                className="font-medium text-gray-800 hover:text-green-700 text-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Tentang Kami
              </Link>
              <Link
                href={tipeKamarHref}
                className="font-medium text-gray-800 hover:text-green-700 text-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Tipe Kamar
              </Link>
              <Link
                href="https://wa.me/6285215810688"
                target="_blank"
                className="font-medium text-gray-800 hover:text-green-700 text-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Pesan
              </Link>
              {user?.role === "ADMIN" && (
                <Link
                  href="/admin"
                  className="font-medium text-gray-800 hover:text-green-700 text-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Manage Data
                </Link>
              )}

              {user ? (
                <button
                  onClick={() => {
                    handleSignOut()
                    setIsMenuOpen(false)
                  }}
                  className="bg-white border cursor-pointer border-gray-300 text-gray-700 px-5 py-1.5 rounded-md text-sm font-medium hover:bg-gray-50 w-full max-w-xs"
                >
                  Logout
                </button>
              ) : (
                <Link
                  href="/login"
                  className="bg-white border border-green-600 text-green-600 px-5 py-1.5 rounded-md text-sm font-medium hover:bg-green-50 w-full max-w-xs text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header