"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { z } from "zod";
import { apiRequest } from "@/lib/api";


const facilitySchema = z.object({
  facility_name: z
    .string()
    .min(2, { message: "Nama fasilitas wajib diisi minimal 2 karakter" })
    .max(100, { message: "Nama fasilitas maksimal 100 karakter" }),
  desc: z
    .string()
    .min(3, { message: "Deskripsi wajib diisi minimal 3 karakter" })
    .max(500, { message: "Deskripsi maksimal 500 karakter" }),
});

interface Facility {
  id_fasility: string;
  facility_name: string;
  desc: string;
  status?: string;
  created_at: string;
  updated_at: string;
}

interface FacilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
  showAlert: (type: "success" | "error", message: string) => void;
  facility: Facility | null;
  accessToken: string;
}

export default function FacilityModal({
  isOpen,
  onClose,
  showAlert,
  onRefresh,
  facility,
  accessToken,
}: FacilityModalProps) {
  const isUpdateMode = !!facility;
  const [formData, setFormData] = useState({
    facility_name: "",
    desc: "",
  });
  const [formErrors, setFormErrors] = useState<{
    facility_name?: string;
    desc?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (facility) {
      setFormData({
        facility_name: facility.facility_name || "",
        desc: facility.desc || "",
      });
    } else {
      resetForm();
    }
  }, [facility, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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

    // Validasi dengan Zod
    const result = facilitySchema.safeParse(formData);
    if (!result.success) {
      const errors: { [key: string]: string } = {};
      result.error.errors.forEach((err) => {
        if (err.path.length) {
          const field = err.path[0];
          errors[field] = err.message;
        }
      });
      setFormErrors(errors);
      setIsSubmitting(false);
      return;
    }

    setFormErrors({}); // clear error

    try {
      let res;
      if (isUpdateMode && facility) {
        res = await apiRequest({
          endpoint: `/facility/${facility.id_fasility}`,
          method: "PUT",
          body: formData,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        showAlert("success", "Fasilitas berhasil diperbarui");
      } else {
        res = await apiRequest({
          endpoint: "/facility",
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        showAlert("success", "Fasilitas berhasil disimpan");
      }

      if (res) {
        resetForm();
        onClose();
        onRefresh();
      } else {
        showAlert(
          "error",
          `Gagal ${isUpdateMode ? "memperbarui" : "menambahkan"} fasilitas.`
        );
      }
    } catch (error) {
      showAlert(
        "error",
        `Gagal ${isUpdateMode ? "memperbarui" : "menambahkan"} fasilitas.`
      );
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      facility_name: "",
      desc: "",
    });
    setFormErrors({});
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center z-10">
          <h2 className="text-xl font-semibold text-gray-800">
            {isUpdateMode ? "Edit Fasilitas" : "Tambah Fasilitas Baru"}
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
            <div className="space-y-4">
              {/* Nama Fasilitas */}
              <div>
                <label
                  htmlFor="facility_name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nama Fasilitas
                </label>
                <input
                  type="text"
                  id="facility_name"
                  name="facility_name"
                  value={formData.facility_name}
                  onChange={handleChange}
                  placeholder="Contoh: WiFi, AC, Kamar Mandi Dalam"
                  className={`w-full p-2 border ${
                    formErrors.facility_name ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                />
                {formErrors.facility_name && (
                  <p className="text-sm text-red-600 mt-1">{formErrors.facility_name}</p>
                )}
              </div>

              {/* Deskripsi */}
              <div>
                <label
                  htmlFor="desc"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Deskripsi
                </label>
                <textarea
                  id="desc"
                  name="desc"
                  value={formData.desc}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Deskripsi fasilitas..."
                  className={`w-full p-2 border ${
                    formErrors.desc ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                />
                {formErrors.desc && (
                  <p className="text-sm text-red-600 mt-1">{formErrors.desc}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
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
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Menyimpan...
                  </span>
                ) : isUpdateMode ? (
                  "Perbarui"
                ) : (
                  "Simpan"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
