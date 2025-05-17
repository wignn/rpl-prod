"use client";

import { apiRequest } from "@/lib/api";
import type { FacilityDetailResponse } from "@/types/facility";
import type { ReportCreateRequest } from "@/types/report";
import { useState } from "react";
import AlertMessage from "../alert/alertMessage";

interface Props {
  accessToken: string;
  tenatId: string;
  facilities: FacilityDetailResponse[];
}

enum REPORTSTATUS {
  PENDING = "PENDING",
}

export default function ReportPage({
  accessToken,
  facilities,
  tenatId,
}: Props) {
  const [selectedFacility, setSelectedFacility] = useState<string>("");
  const [desc, setDesc] = useState("");
  const [reportDate, setReportDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const requestBody: ReportCreateRequest = {
        id_tenant: tenatId,
        report_desc: desc,
        id_facility: selectedFacility,
        report_date: new Date(reportDate),
        status: REPORTSTATUS.PENDING,
      };

      const response = await apiRequest({
        endpoint: "/report",
        method: "POST",
        body: requestBody,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response) {
        showAlert(
          "success",
          "Laporan berhasil dikirim! Kami akan segera memproses laporan Anda."
        )
        setSelectedFacility("");
        setDesc("");
        setReportDate("");
      }
    } catch (error) {
      showAlert(
        "error",
        "Gagal mengirim laporan. Silakan coba lagi nanti."
      )
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const [alert, setAlert] = useState({
    type: "success" as "success" | "error",
    message: "",
    isOpen: false,
  })


  const showAlert = (type: "success" | "error", message: string) => {
    setAlert({
      type,
      message,
      isOpen: true,
    });
  }


  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-green-50 to-neutral-500">
      <div className="px-6 md:px-24 mt-6 md:mt-10 flex flex-col md:flex-row md:items-center gap-4 md:gap-10">
        <div className="inline-flex flex-col justify-start items-start">
          <div className="px-1.5 bg-lime-300 rounded-md">
            <h1 className="text-black text-3xl md:text-4xl font-medium font-['Space_Grotesk']">
              Laporkan!
            </h1>
          </div>
        </div>
        <div className="max-w-xs md:w-80 text-black text-base md:text-lg font-normal font-['Space_Grotesk']">
          Berikan deksripsi mengenai kerusakan fasilitas di kos namakos
        </div>
      </div>

      <div className="px-6 md:px-24 mt-8 md:mt-10 relative">
        <div className="w-full px-6 md:px-24 pt-8 md:pt-14 pb-10 md:pb-20 bg-zinc-100 rounded-[30px] md:rounded-[45px]">
          <div className="flex flex-col gap-8 md:gap-10 max-w-[556px] mx-auto">
            <div className="flex flex-col gap-4 md:gap-6 w-full">
              <h2 className="text-black text-lg md:text-xl font-medium font-['Space_Grotesk']">
                Pilih Fasilitas yang Rusak
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {facilities.map((facility) => (
                  <div
                    key={facility.id_fasility}
                    className="flex items-center gap-2"
                  >
                    <input
                      type="radio"
                      id={`facility-${facility.id_fasility}`}
                      name="facility"
                      value={facility.id_fasility}
                      checked={selectedFacility === facility.id_fasility}
                      onChange={() => setSelectedFacility(facility.id_fasility)}
                      className="w-5 h-5 rounded-full border-black accent-lime-300 cursor-pointer"
                    />
                    <label
                      htmlFor={`facility-${facility.id_fasility}`}
                      className="text-black text-sm md:text-base font-normal font-['Space_Grotesk'] cursor-pointer"
                    >
                      {facility.facility_name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-5 md:gap-6">
              {/* Tanggal */}
              <div className="flex flex-col gap-1 md:gap-[5px]">
                <label className="text-black text-sm md:text-base font-normal font-['Space_Grotesk'] leading-7">
                  Tanggal Kerusakan
                </label>
                <div className="relative">
                  <div className="w-full px-4 md:px-7 py-3 md:py-4 bg-white rounded-xl md:rounded-2xl outline outline-1 outline-black">
                    <input
                      title="Pilih tanggal"
                      type="date"
                      value={reportDate}
                      onChange={(e) => setReportDate(e.target.value)}
                      className="w-full bg-transparent cursor-pointer text-zinc-700 text-base md:text-lg font-normal font-['Space_Grotesk'] outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Deskripsi */}
              <div className="flex flex-col gap-1 md:gap-[5px]">
                <label className="text-black text-sm md:text-base font-normal font-['Space_Grotesk'] leading-7">
                  Deskripsi
                </label>
                <div className="w-full h-32 md:h-48 px-4 md:px-7 py-3 md:py-4 bg-white rounded-xl md:rounded-2xl outline outline-1 outline-black">
                  <textarea
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    placeholder="berikan deskripsi mengenai kerusakan secara detail"
                    className="w-full h-full bg-transparent text-zinc-500 text-base md:text-lg font-normal font-['Space_Grotesk'] outline-none resize-none"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isLoading || !selectedFacility || !reportDate || !desc}
              className="w-full px-6 md:px-9 py-4 md:py-5 bg-zinc-900 rounded-xl md:rounded-2xl text-center text-white text-lg md:text-xl font-normal font-['Space_Grotesk'] disabled:bg-zinc-500 disabled:cursor-not-allowed"
            >
              {isLoading ? "Mengirim..." : "Send Message"}
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 md:px-24 py-8 mt-8 md:mt-0">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-9">
          <div className="text-white text-sm md:text-lg font-normal font-['Space_Grotesk']">
            Pastikan sudah isi deskripsi dengan benar dan jelas.
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 md:w-7 md:h-7 bg-white rounded-full outline outline-1 outline-black"></div>
            <div className="w-3 h-3 md:w-4 md:h-4 bg-lime-300 rounded-full"></div>
          </div>
        </div>
      </div>
      <AlertMessage
      type={alert.type}
      message={alert.message}
      isOpen={alert.isOpen}
      onClose={() => setAlert({ ...alert, isOpen: false })}
      />
    </div>
  );
}
