"use client";
import { signOut } from "next-auth/react";
import Link from "next/link";
import React from "react";

interface Props {
  user: boolean;
}

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
