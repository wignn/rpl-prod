"use client";

import type React from "react";
import { useState, useEffect, useCallback } from "react";
import {
  Search,
  Eye,
  Calendar,
  ArrowUpDown,
  RefreshCw,
  Filter,
} from "lucide-react";
import RecordDetailModal from "@/components/dasbord/record/RecordDetailModal";
import { apiRequest } from "@/lib/api";
import LoadingSkeleton from "@/components/sekleton/RecordSkeleton";

interface TenantRent {
  id_rent: string | null;
  id_tenant: string | null;
  id_room: string | null;
  rent_date: string | null;
  rent_out: string | null;
}

interface TenantRoom {
  id_room: string;
  room_name: string | null;
  rent_in: string | null;
  rent_out: string | null;
  status: string | null;
}

interface Tenant {
  id_tenant: string;
  address: string;
  no_ktp: string;
  status: string;
  no_telp: string;
  full_name: string;
  rent: TenantRent;
  room: TenantRoom | null;
}

const formatDate = (dateString: string | null) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

type SortField = "full_name" | "status" | "rent_date" | "rent_out";
type SortOrder = "asc" | "desc";

export default function RecordContent({
  accessToken,
}: {
  accessToken: string;
}) {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [filteredTenants, setFilteredTenants] = useState<Tenant[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<{
    field: SortField;
    order: SortOrder;
  }>({
    field: "full_name",
    order: "asc",
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchTenants = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await apiRequest<Tenant[]>({
        endpoint: `/tenant/record`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setTenants(result);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    fetchTenants();
  }, [fetchTenants]);

  useEffect(() => {
    let result = tenants;
    if (statusFilter !== "all") {
      result = result.filter((tenant) => {
        const isActive = !tenant.room?.rent_out;
        return statusFilter === "active" ? isActive : !isActive;
      });
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (tenant) =>
          tenant.full_name.toLowerCase().includes(query) ||
          tenant.no_telp.toLowerCase().includes(query) ||
          tenant.room?.room_name?.toLowerCase().includes(query) ||
          false
      );
    }

    result = [...result].sort((a, b) => {
      let aValue, bValue;

      switch (sortConfig.field) {
        case "full_name":
          aValue = a.full_name.toLowerCase();
          bValue = b.full_name.toLowerCase();
          break;
        case "status":
          aValue = !a.room?.rent_out ? "active" : "inactive";
          bValue = !b.room?.rent_out ? "active" : "inactive";
          break;
        case "rent_date":
          aValue = a.room?.rent_in || "";
          bValue = b.room?.rent_in || "";
          break;
        case "rent_out":
          aValue = a.room?.rent_out || "9999-12-31";
          bValue = b.room?.rent_out || "9999-12-31";
          break;
        default:
          aValue = a.full_name.toLowerCase();
          bValue = b.full_name.toLowerCase();
      }

      if (sortConfig.order === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    setFilteredTenants(result);
  }, [tenants, searchQuery, statusFilter, sortConfig]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleStatusFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setStatusFilter(e.target.value as "all" | "active" | "inactive");
  };

  const handleViewDetail = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setIsModalOpen(true);
  };

  const handleSort = (field: SortField) => {
    setSortConfig((prev) => ({
      field,
      order: prev.field === field && prev.order === "asc" ? "desc" : "asc",
    }));
  };

  const refreshData = () => {
    fetchTenants();
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Record Penghuni</h2>
        <button
          onClick={refreshData}
          className="flex items-center justify-center px-4 py-2 border rounded-lg hover:bg-gray-50"
          title="Refresh data"
          disabled={isLoading}
        >
          <RefreshCw
            className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
          />
          <span>{isLoading ? "Memuat..." : "Refresh"}</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-grow max-w-md">
          <input
            type="text"
            placeholder="Cari nama, nomor telepon, atau kamar..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            title="Filter"
            id="statusFilter"
            value={statusFilter}
            onChange={handleStatusFilterChange}
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="all">Semua Status</option>
            <option value="active">Aktif</option>
            <option value="inactive">Tidak Aktif</option>
          </select>
        </div>
      </div>

      {filteredTenants.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <Calendar className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Tidak ada data penghuni
          </h3>
          <p className="text-gray-500">
            {searchQuery || statusFilter !== "all"
              ? "Tidak ada penghuni yang sesuai dengan filter yang dipilih"
              : "Belum ada data penghuni yang tersimpan"}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("full_name")}
                  >
                    <div className="flex items-center">
                      Nama Penghuni
                      <ArrowUpDown
                        className={`ml-1 h-4 w-4 ${
                          sortConfig.field === "full_name"
                            ? "text-green-500"
                            : "text-gray-400"
                        }`}
                      />
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("status")}
                  >
                    <div className="flex items-center">
                      Status
                      <ArrowUpDown
                        className={`ml-1 h-4 w-4 ${
                          sortConfig.field === "status"
                            ? "text-green-500"
                            : "text-gray-400"
                        }`}
                      />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nomor Telepon
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kamar
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("rent_date")}
                  >
                    <div className="flex items-center">
                      Tanggal Masuk
                      <ArrowUpDown
                        className={`ml-1 h-4 w-4 ${
                          sortConfig.field === "rent_date"
                            ? "text-green-500"
                            : "text-gray-400"
                        }`}
                      />
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("rent_out")}
                  >
                    <div className="flex items-center">
                      Tanggal Keluar
                      <ArrowUpDown
                        className={`ml-1 h-4 w-4 ${
                          sortConfig.field === "rent_out"
                            ? "text-green-500"
                            : "text-gray-400"
                        }`}
                      />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTenants.map((tenant) => (
                  <tr key={tenant.id_tenant} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                          <span className="text-green-600 font-medium">
                            {tenant.full_name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          {tenant.full_name}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          !tenant.room?.rent_out
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {!tenant.room?.rent_out ? "Aktif" : "Tidak Aktif"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {tenant.no_telp}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {tenant.room?.room_name || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(tenant.room?.rent_in || null)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                       {formatDate(tenant.room?.rent_out || null)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleViewDetail(tenant)}
                        className="text-blue-600 hover:text-blue-900 flex items-center justify-end"
                        title="Lihat Detail"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        <span>Detail</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <RecordDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        tenant={selectedTenant}
      />
    </div>
  );
}
