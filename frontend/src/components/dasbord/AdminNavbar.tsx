"use client";
import { signOut } from "next-auth/react";
import Link from "next/link";
import React from "react";

interface Props {
  user: boolean;
}

/**
 * AdminNavbar component provides navigation for admin users.
 * 
 * This component renders a navigation bar with links to various admin pages
 * and a logout button if a user is logged in.
 * 
 * @component
 * @param {Props} props - The component props
 * @param {object} props.user - The user object. When present, displays logout button
 * 
 * @returns {JSX.Element} A navigation bar with admin links and logout functionality
 * 
 * @example
 * ```tsx
 * <AdminNavbar user={currentUser} />
 * ```
 */
function AdminNavbar({ user }: Props) {
  const handleLogout = async () => {
    await signOut({
      redirect: true,
      callbackUrl: "/",
    });
  };

  return (
    <div className="flex items-center justify-between mx-auto py-4">
      <div className="flex items-center space-x-8">
        <Link className="text-gray-800 hover:text-gray-600" href="/">
          beranda
        </Link>
        <Link className="text-gray-800 hover:text-gray-600" href="/admin/kamar">
          tipe kamar
        </Link>
        <Link
          className="text-gray-800 hover:text-gray-600"
          href="/admin/laporan"
        >
          laporan
        </Link>
        <Link className="text-gray-800 hover:text-gray-600" href="/penyewa">
          data penyewa
        </Link>
        <Link className="text-gray-800 hover:text-gray-600" href="/keuangaan">
          keuangan
        </Link>

        {user && (
          <button
            onClick={handleLogout}
            className="rounded-full border border-gray-800 px-4 py-1 text-gray-800 hover:bg-gray-100"
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
}

export default AdminNavbar;
