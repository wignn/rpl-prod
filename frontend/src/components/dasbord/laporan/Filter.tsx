"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { ChevronDown, RefreshCw, Search } from "lucide-react";
import { getCurrentMonth } from "@/lib/utils/getMonth";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const allMonths = [...months, "semua"];

interface ReportFilterProps {
  currentMonth: string;
  onMonthChange: (month: string) => void;
  onSearch: (query: string) => void;
  isLoading: boolean;
  onRefresh: () => void;
  searchQuery: string;
}

export default function ReportFilter({
  currentMonth,
  isLoading,
  onRefresh,
  onMonthChange,
  onSearch,
  searchQuery,
}: ReportFilterProps) {
  const [selectedMonth, setSelectedMonth] = useState(
    currentMonth || getCurrentMonth()
  );
  const [searchInput, setSearchInput] = useState(searchQuery || "");

  useEffect(() => {
    setSearchInput(searchQuery || "");
  }, [searchQuery]);

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const month = e.target.value;
    setSelectedMonth(month);
    onMonthChange(month);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchInput);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="relative">
            <select
              title="Pilih Bulan"
              className="appearance-none rounded-full bg-white px-4 py-2 pr-8 text-gray-800 border border-gray-200"
              value={selectedMonth}
              onChange={handleMonthChange}
            >
              {allMonths.map((m: string) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          </div>

          <form
            onSubmit={handleSearchSubmit}
            className="relative w-full sm:w-auto"
          >
            <input
              type="text"
              placeholder="Cari laporan..."
              value={searchInput}
              onChange={handleSearchChange}
              className="pl-10 pr-4 py-2 rounded-full border border-gray-200 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <button
              title="search"
              type="submit"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              <Search className="h-4 w-4" />
            </button>
          </form>
        </div>
         <div className="flex gap-2">

        <button
          onClick={onRefresh}
          className="flex items-center justify-center px-4 py-2 border rounded-lg hover:bg-gray-50"
        >
          <RefreshCw
            className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
          />
          <span>{isLoading ? "Memuat..." : "Refresh"}</span>
        </button>

        <button className="rounded-full bg-white border border-gray-200 px-4 py-2 text-gray-800">
          Laporan fasilitas penyewa kos
        </button>
        </div>
      </div>
    </div>
  );
}
