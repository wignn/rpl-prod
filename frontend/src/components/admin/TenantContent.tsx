"use client";

import type { TenantWithRentAndRoom } from "@/types/tenat";
import { Plus, Edit, Trash, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import TenantModal from "@/components/dasbord/Tenant/TenatModal";
import { apiRequest } from "@/lib/api";
import TenantSkeleton from "@/components/sekleton/tenant";
import ConfirmDialog from "@/components/alert/confirmDialog";
import AlertMessage from "@/components/alert/alertMessage";

interface Props {
  accessToken: string;
}

export default function UsersContent({ accessToken }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tenants, setTenants] = useState<TenantWithRentAndRoom[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTenant, setSelectedTenant] = useState<
    TenantWithRentAndRoom | undefined
  >(undefined);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [tenantToDelete, setTenantToDelete] =
    useState<TenantWithRentAndRoom | null>(null);

  const [alert, setAlert] = useState({
    type: "success" as "success" | "error",
    message: "",
    isOpen: false,
  });

  const fetchTenants = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await apiRequest<TenantWithRentAndRoom[]>({
        endpoint: "/tenant",
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setTenants(response);
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    fetchTenants();
  }, [fetchTenants]);

  const handleAddClick = () => {
    setSelectedTenant(undefined);
    setIsModalOpen(true);
  };

  const handleEditClick = (tenant: TenantWithRentAndRoom) => {
    setSelectedTenant(tenant);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (tenant: TenantWithRentAndRoom) => {
    setTenantToDelete(tenant);
    setIsConfirmDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!tenantToDelete) return;

    try {
      await apiRequest({
        endpoint: `/tenant/${tenantToDelete.id_tenant}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      showAlert("success", "Penghuni berhasil dihapus");
      fetchTenants();
    } catch (error) {
      showAlert("error", "Gagal menghapus penghuni. Silakan coba lagi.");
      throw error;
    } finally {
      setIsConfirmDialogOpen(false);
      setTenantToDelete(null);
    }
  };

  const showAlert = (type: "success" | "error", message: string) => {
    setAlert({
      type,
      message,
      isOpen: true,
    });
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Penghuni</h2>
        <div className="flex gap-2">
          <button
            onClick={fetchTenants}
            className="flex items-center justify-center px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            <span>{isLoading ? "Memuat..." : "Refresh"}</span>
          </button>
          <button
            onClick={handleAddClick}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah Penghuni
          </button>
        </div>
      </div>

      {isLoading ? (
        <TenantSkeleton />
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kamar
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tanggal Masuk
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tenants.map((item) => (
                  <tr key={item.id_tenant} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                          <span className="text-green-600 font-medium">
                            {item.full_name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {item.full_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {item.no_telp}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {item.room ? item.room.room_name : "-"}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {item.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(item.rent?.rent_date)}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          title="Edit"
                          className="text-gray-600 hover:text-gray-900"
                          onClick={() => handleEditClick(item)}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          title="Hapus"
                          className="text-red-600 hover:text-red-900"
                          onClick={() => handleDeleteClick(item)}
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

          <div className="bg-gray-50 px-6 py-3 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Menampilkan <span className="font-medium">1</span> sampai{" "}
              <span className="font-medium">{Math.min(5, tenants.length)}</span>{" "}
              dari <span className="font-medium">{tenants.length}</span>{" "}
              penghuni
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 border rounded-md bg-white text-gray-700 hover:bg-gray-50">
                Sebelumnya
              </button>
              <button className="px-3 py-1 border rounded-md bg-white text-gray-700 hover:bg-gray-50">
                Selanjutnya
              </button>
            </div>
          </div>
        </div>
      )}

      <TenantModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        showAlert={showAlert}
        onRefresh={fetchTenants}
        tenant={selectedTenant}
        accessToken={accessToken}
      />

      <ConfirmDialog
        isOpen={isConfirmDialogOpen}
        title="Konfirmasi Hapus"
        message={`Apakah Anda yakin ingin menghapus penghuni "${tenantToDelete?.full_name}"?`}
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
