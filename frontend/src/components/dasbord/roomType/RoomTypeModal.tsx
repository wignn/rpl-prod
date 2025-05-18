"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { X, Upload, ImageIcon } from 'lucide-react';
import { apiRequest, fileRequest } from "@/lib/api";
import type { RoomTypeResponse } from "@/types/room";
import type { FacilityDetailResponse } from "@/types/facility";
import Image from "next/image";
import { z } from "zod";

const roomTypeFormSchema = z.object({  
  roomType: z.string().min(3, "Nama tipe kamar wajib diisi"),
  price: z
    .string()
    .min(3, "Harga wajib diisi")
    .refine((val) => !isNaN(Number(val.replace(/[^\d]/g, ""))), {
      message: "Harga harus berupa angka valid",
    })
    .refine((val) => Number(val.replace(/[^\d]/g, "")) > 0, {
      message: "Harga harus lebih dari 0",
    }),
  facilities: z.array(z.string()),
});

type FormData = z.infer<typeof roomTypeFormSchema>;

interface RoomTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
  roomType?: RoomTypeResponse;
  baseUrl: string;
  showAlert: (type: "success" | "error", message: string) => void;
  facilities: FacilityDetailResponse[];
}

/**
 * A modal component for creating or updating room types.
 * 
 * This component provides a form to add or edit room type details including:
 * - Room type name
 * - Monthly price
 * - Room image upload
 * - Facility selection
 * 
 * It handles form validation, image uploading, and API integration for CRUD operations.
 * 
 * @param {Object} props - Component properties
 * @param {boolean} props.isOpen - Controls visibility of the modal
 * @param {Function} props.onClose - Callback function when modal is closed
 * @param {Function} props.showAlert - Function to display alert messages (success/error)
 * @param {Array} props.facilities - Available facilities to choose from
 * @param {Function} props.onRefresh - Callback function to refresh parent data after successful operation
 * @param {Object|null} props.roomType - Room type data for update mode (null for create mode)
 * @param {string} props.baseUrl - Base URL for image paths
 * 
 * @returns {JSX.Element|null} The modal component or null if not open
 */
export default function RoomTypeModal({
  isOpen,
  onClose,
  showAlert,
  facilities,
  onRefresh,
  roomType,
  baseUrl,
}: RoomTypeModalProps) {
  const isUpdateMode = !!roomType;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<FormData>({
    roomType: "",
    price: "",
    facilities: [] as string[],
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (roomType) {
      setFormData({
        roomType: roomType.room_type || "",
        price: roomType.price
          ? formatPrice(roomType.price)
          : "",
        facilities:
          roomType.facility?.map(
            (f: { id_facility: string }) => f.id_facility
          ) || [],
      });

      if (roomType.image) {
        setUploadedImageUrl(roomType.image);
      }
    } else {
      resetForm();
    }
  }, [roomType, isOpen]);

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

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleFacilityChange = (facilityId: string) => {
    setFormData((prev) => {
      const facilities = [...prev.facilities];
      if (facilities.includes(facilityId)) {
        return {
          ...prev,
          facilities: facilities.filter((id) => id !== facilityId),
        };
      } else {
        return {
          ...prev,
          facilities: [...facilities, facilityId],
        };
      }
    });
  };

  const validateForm = (): boolean => {
    try {
      roomTypeFormSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const validateImage = (): boolean => {
    // If we're in update mode and no new image is selected, but we have an existing image
    if (isUpdateMode && !selectedImage && uploadedImageUrl) {
      setImageError(null);
      return true;
    }

    // If no image is selected at all
    if (!selectedImage) {
      setImageError("Gambar wajib diunggah");
      return false;
    }

    setImageError(null);
    return true;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Check file type
      if (!file.type.startsWith("image/")) {
        setImageError("File harus berupa gambar (JPG, PNG, dll)");
        return;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setImageError("Ukuran gambar tidak boleh lebih dari 5MB");
        return;
      }

      setSelectedImage(file);
      setImageError(null);

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async () => {
    if (!selectedImage) return null;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedImage);

      const response = await fileRequest<{ path: string }>({
        endpoint: "files/upload",
        method: "POST",
        body: formData,
      });

      if (!response) {
        throw new Error("Upload failed");
      }

      setUploadedImageUrl(response.path);
      return response.path;
    } catch (error) {
      showAlert("error", "Gagal mengunggah gambar. Silakan coba lagi.");
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form and image
    const isFormValid = validateForm();
    const isImageValid = validateImage();
    
    if (!isFormValid || !isImageValid) {
      return;
    }
    
    setIsSubmitting(true);

    try {
      let imageUrl = uploadedImageUrl;
      if (selectedImage) {
        imageUrl = await uploadImage();
        if (!imageUrl) {
          setIsSubmitting(false);
          return;
        }
      }

      const priceAsNumber = parseFormattedPrice(formData.price);

      const requestData = {
        room_type: formData.roomType,
        price: priceAsNumber,
        facilities: formData.facilities,
        image: imageUrl,
      };

      let res;

      if (isUpdateMode && roomType?.id_roomtype) {
        if (roomType.image && selectedImage) {
          try {
            await fileRequest({
              endpoint: `${roomType.image}`,
              method: "DELETE",
            });
          } catch (error) {
            throw error;
          }
        }

        res = await apiRequest({
          endpoint: `/roomtype/${roomType.id_roomtype}`,
          method: "PUT",
          body: requestData,
        });

      } else {
        res = await apiRequest({
          endpoint: "/roomtype",
          method: "POST",
          body: requestData,
        });
      }

      if (res) {
        showAlert(
          "success",
          `Tipe kamar berhasil ${isUpdateMode ? "diperbarui" : "ditambahkan"}`
        );
        onRefresh();
        resetForm();
        onClose();
      }
    } catch (error) {
      showAlert(
        "error",
        `Gagal ${
          isUpdateMode ? "memperbarui" : "menambahkan"
        } tipe kamar. Silakan coba lagi.`
      );
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      roomType: "",
      price: "",
      facilities: [],
    });
    setSelectedImage(null);
    setPreviewUrl(null);
    setUploadedImageUrl(null);
    setErrors({});
    setImageError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatPrice = (value: number | string): string => {
    const numericValue = typeof value === 'string' 
      ? value.replace(/[^\d]/g, "") 
      : value.toString();
      
    if (numericValue) {
      return `Rp ${Number(numericValue).toLocaleString("id-ID")}`;
    }
    return "";
  };

  // Parse formatted price back to number
  const parseFormattedPrice = (formattedPrice: string): number => {
    return Number(formattedPrice.replace(/[^\d]/g, ""));
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    // Only allow numeric input
    const numericValue = value.replace(/[^\d]/g, "");
    if (numericValue === "" || /^\d+$/.test(numericValue)) {
      const formattedValue = numericValue === "" ? "" : formatPrice(numericValue);
      setFormData((prev) => ({ ...prev, price: formattedValue }));
    }
    
    // Clear error when user makes changes
    if (errors.price) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.price;
        return newErrors;
      });
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center z-10">
            <h2 className="text-xl font-semibold text-gray-800">
              {isUpdateMode ? "Edit Tipe Kamar" : "Tambah Tipe Kamar Baru"}
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
                    Nama Tipe Kamar
                  </label>
                  <input
                    type="text"
                    id="roomType"
                    name="roomType"
                    value={formData.roomType}
                    onChange={handleChange}
                    placeholder="Contoh: Tipe A, Deluxe, Standard"
                    className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      errors.roomType ? "border-red-500" : "border-gray-300"
                    }`}
                    required
                  />
                  {errors.roomType && (
                    <p className="mt-1 text-xs text-red-500">{errors.roomType}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Harga per Bulan
                  </label>
                  <input
                    type="text"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handlePriceChange}
                    placeholder="Rp 0"
                    className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      errors.price ? "border-red-500" : "border-gray-300"
                    }`}
                    required
                  />
                  {errors.price && (
                    <p className="mt-1 text-xs text-red-500">{errors.price}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Foto Kamar
                  </label>

                  <div className="mt-1 flex flex-col items-center">
                    <input
                      title="Upload Gambar"
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      accept="image/*"
                      className="hidden"
                    />

                    <div
                      className={`w-full h-48 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors mb-2 ${
                        imageError ? "border-red-500" : "border-gray-300"
                      }`}
                      onClick={triggerFileInput}
                    >
                      {previewUrl ? (
                        <Image
                          width={500}
                          height={500}
                          src={previewUrl || "/placeholder.svg"} 
                          alt="Preview"
                          className="h-full w-full object-cover rounded-lg"
                        />
                      ) : uploadedImageUrl ? (
                        <Image
                          width={500}
                          height={500}
                          src={`${baseUrl}/${uploadedImageUrl}`}
                          alt="Room Type"
                          className="h-full w-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="text-center p-4">
                          <ImageIcon className={`mx-auto h-12 w-12 ${imageError ? "text-red-400" : "text-gray-400"}`} />
                          <p className={`mt-1 text-sm ${imageError ? "text-red-500" : "text-gray-500"}`}>
                            Klik untuk mengunggah gambar
                          </p>
                          <p className="text-xs text-gray-400">
                            JPG, PNG, GIF hingga 5MB
                          </p>
                        </div>
                      )}
                    </div>

                    {imageError && (
                      <p className="mt-1 text-xs text-red-500 self-start">{imageError}</p>
                    )}

                    <button
                      type="button"
                      onClick={triggerFileInput}
                      className="mt-2 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {previewUrl || uploadedImageUrl
                        ? "Ganti Gambar"
                        : "Unggah Gambar"}
                    </button>

                    {/* Selected file name */}
                    {selectedImage && (
                      <p className="mt-2 text-xs text-gray-500">
                        {selectedImage.name} (
                        {Math.round(selectedImage.size / 1024)} KB)
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Fasilitas
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {facilities.map((facility) => (
                      <div
                        key={facility.id_fasility}
                        className="flex items-center"
                      >
                        <input
                          type="checkbox"
                          id={facility.id_fasility}
                          checked={formData.facilities.includes(
                            facility.id_fasility
                          )}
                          onChange={() =>
                            handleFacilityChange(facility.id_fasility)
                          }
                          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <label
                          htmlFor={facility.id_fasility}
                          className="ml-2 text-sm text-gray-700"
                        >
                          {facility.facility_name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  disabled={isSubmitting || isUploading}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors disabled:bg-green-300"
                  disabled={isSubmitting || isUploading}
                >
                  {isSubmitting || isUploading ? (
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
                      {isUploading ? "Mengunggah..." : "Menyimpan..."}
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
    </>
  );
}
