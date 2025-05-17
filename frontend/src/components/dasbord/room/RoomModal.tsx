"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { apiRequest } from "@/lib/api";
import type { RoomDetailResponse, RoomTypeResponse } from "@/types/room";

enum ROOMSTATUS {
  AVAILABLE = "AVAILABLE",
  NOTAVAILABLE = "NOTAVAILABLE",
}

interface RoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  showAlert: (type: "success" | "error", message: string) => void;
  room?: RoomDetailResponse;
  onRefresh: () => void;
  accessToken: string;
  roomTypes?: RoomTypeResponse[];
}

interface RoomFormData {
  roomType: string;
  status: ROOMSTATUS;
}

export default function RoomModal({
  isOpen,
  onClose,
  showAlert,
  room,
  onRefresh,
  roomTypes = [],
  accessToken,
}: RoomModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isUpdateMode = !!room;
  const [formData, setFormData] = useState<RoomFormData>({
    roomType: "",
    status: ROOMSTATUS.AVAILABLE,
  });

  useEffect(() => {
    if (room) {
      setFormData({
        roomType: room.id_roomtype || "",
        status: (room.status as ROOMSTATUS) || ROOMSTATUS.AVAILABLE,
      });
    } else {
      resetForm();
    }
  }, [room, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
   try {
      const requestData = {
        id_roomtype: formData.roomType,
        status: formData.status,
      };
      let res;
      if (isUpdateMode && room?.id_room) {
        res = await apiRequest({
          endpoint: `/room/${room.id_room}`,
          method: "PUT",
          body: {
            id_roomtype: formData.roomType,
            status: formData.status,
          },
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
      } else {
        res = await apiRequest({
          endpoint: "/room",
          method: "POST",
          body: requestData,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
      }

      if (res) {
        resetForm();
        onClose();
        onRefresh();
        showAlert(
          "success",
          isUpdateMode
            ? "Kamar berhasil diperbarui."
            : "Kamar baru berhasil ditambahkan."
        );
      }
    } catch (error) {
      showAlert(
        "error",
        isUpdateMode
          ? "Gagal memperbarui kamar. Silakan coba lagi."
          : "Gagal menambahkan kamar baru. Silakan coba lagi."
      );
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      roomType: "",
      status: ROOMSTATUS.AVAILABLE,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center z-10">
          <h2 className="text-xl font-semibold text-gray-800">
            {isUpdateMode ? "Edit Kamar" : "Tambah Kamar Baru"}
          </h2>
          <button
            title="Close"
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="roomType"
                  className="block text-sm font-medium text-gray-700"
                >
                  Tipe Kamar
                </label>

                <select
                  id="roomType"
                  name="roomType"
                  value={formData.roomType}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                >
                  <option value="" disabled>
                    Pilih tipe kamar
                  </option>
                  {roomTypes.map((type) => (
                    <option key={type.id_roomtype} value={type.id_roomtype}>
                      {type.room_type} - Rp{type.price.toLocaleString("id-ID")}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700"
                >
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                >
                  <option value={ROOMSTATUS.AVAILABLE}>Tersedia</option>
                  <option value={ROOMSTATUS.NOTAVAILABLE}>
                    Tidak Tersedia
                  </option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                disabled={isSubmitting}
              >
                Batal
              </button>
              <button
                type="submit"
                className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors disabled:bg-green-300"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Menyimpan..."
                  : isUpdateMode
                  ? "Perbarui"
                  : "Simpan"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
