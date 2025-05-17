"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Plus, Edit, Trash, Search, RefreshCw } from "lucide-react";
import { apiRequest } from "@/lib/api";
import FacilityModal from "@/components/dasbord/fasility/FasilityModal";
import ConfirmDialog from "@/components/alert/confirmDialog";
import AlertMessage from "@/components/alert/alertMessage";
import FacilitySkeleton from "@/components/sekleton/facilitySkeleton";
import { useCallback } from "react";
import PageError from "../Error/PageError";

interface Facility {
  id_fasility: string;
  facility_name: string;
  desc: string;
  status?: string;
  created_at: string;
  updated_at: string;
}

export default function FacilityContent({
  accessToken,
}: {
  accessToken: string;
}) {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(
    null
  );
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [facilityToDelete, setFacilityToDelete] = useState<Facility | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [alert, setAlert] = useState({
    type: "success" as "success" | "error",
    message: "",
    isOpen: false,
  });

  const showAlert = (type: "success" | "error", message: string) => {
    setAlert({
      type,
      message,
      isOpen: true,
    });
  };

  const fetchFacilities = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiRequest<Facility[]>({
        endpoint: "/facility",
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setFacilities(response);
    } catch (error) {
      setError("Gagal memuat data fasilitas. Silakan coba lagi.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    fetchFacilities();
  }, [fetchFacilities]);

  const handleAddClick = () => {
    setSelectedFacility(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (facility: Facility) => {
    setSelectedFacility(facility);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (facility: Facility) => {
    setFacilityToDelete(facility);
    setIsConfirmDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!facilityToDelete) return;

    try {
      await apiRequest({
        endpoint: `/facility/${facilityToDelete.id_fasility}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setAlert({
        type: "success",
        message: "Fasilitas berhasil dihapus",
        isOpen: true,
      });

      fetchFacilities();
    } catch (error) {
      
      setAlert({
        type: "error",
        message: "Gagal menghapus fasilitas. Silakan coba lagi.",
        isOpen: true,
      });
      throw error;
    } finally {
      setIsConfirmDialogOpen(false);
      setFacilityToDelete(null);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredFacilities = facilities.filter(
    (facility) =>
      facility.facility_name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      facility.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return <FacilitySkeleton />;
  }
  if (error) {
    return (
      <PageError
        error="Gagal memuat data fasilitas. Silakan coba lagi."
        onRefresh={fetchFacilities}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">
          Manajemen Fasilitas
        </h2>
        <button
          onClick={handleAddClick}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah Fasilitas
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-grow max-w-md">
          <input
            type="text"
            placeholder="Cari fasilitas..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        </div>
        <button
          onClick={fetchFacilities}
          className="flex items-center justify-center px-4 py-2 border rounded-lg hover:bg-gray-50"
          title="Refresh data"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          <span>Refresh</span>
        </button>
      </div>

      {error && !isLoading ?  (
        <PageError error={error} onRefresh={fetchFacilities} />
      ) : facilities.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="text-gray-400 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Belum ada fasilitas
          </h3>
          <p className="text-gray-500 mb-4">
            Tambahkan fasilitas baru untuk mulai mengelola fasilitas kost Anda
          </p>
          <button
            onClick={handleAddClick}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg inline-flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah Fasilitas
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama Fasilitas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Deskripsi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tanggal Dibuat
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Terakhir Diperbarui
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredFacilities.map((facility) => (
                  <tr key={facility.id_fasility} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {facility.facility_name}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 line-clamp-2">
                        {facility.desc}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(facility.created_at).toLocaleDateString(
                          "id-ID",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(facility.updated_at).toLocaleDateString(
                          "id-ID",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEditClick(facility)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(facility)}
                          className="text-red-600 hover:text-red-900"
                          title="Hapus"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredFacilities.length === 0 && (
            <div className="py-8 text-center text-gray-500">
              <p>Tidak ada fasilitas yang sesuai dengan pencarian Anda</p>
            </div>
          )}
        </div>
      )}

      <FacilityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onRefresh={fetchFacilities}
        showAlert={showAlert}
        facility={selectedFacility}
        accessToken={accessToken}
      />

      <ConfirmDialog
        isOpen={isConfirmDialogOpen}
        title="Konfirmasi Hapus"
        message={`Apakah Anda yakin ingin menghapus fasilitas "${facilityToDelete?.facility_name}"?`}
        confirmText="Hapus"
        cancelText="Batal"
        confirmButtonClass="bg-red-500 hover:bg-red-600"
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsConfirmDialogOpen(false)}
      />

      <AlertMessage
        type={alert.type}
        message={alert.message}
        isOpen={alert.isOpen}
        onClose={() => setAlert((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
