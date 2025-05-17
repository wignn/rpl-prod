"use client";

import { useCallback, useEffect, useState } from "react";
import { FinanceTable } from "@/components/dasbord/finance/finance-table";
import { StatisticsCard } from "@/components/dasbord/finance/statistics-card";
import { FinanceChart } from "@/components/dasbord/finance/finance-chart";
import { TransactionModal } from "@/components/dasbord/finance/transaction-modal";
import { FinanceDetailsResponse } from "@/types/finance";
import { TimePeriod } from "@/lib/types";
import { apiRequest } from "@/lib/api";
import AlertMessage from "../alert/alertMessage";

enum INOUT {
  INCOME = "INCOME",
  OUTCOME = "OUTCOME",
}

export default function FinanceDashboard({accessToken}:{ accessToken: string}) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentTransaction, setCurrentTransaction] =
    useState<FinanceDetailsResponse | null>(null);
  const [filterType, setFilterType] = useState<INOUT | "ALL">("ALL");
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("day");
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
  const [financeData, setFinanceData] = useState<FinanceDetailsResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await apiRequest<FinanceDetailsResponse[]>({
        endpoint: "/finance",
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },  
      });

      if (data) {
        setFinanceData(data);
      } else {
        setError("No data received from API");
      }
    } catch (err) {
      setError(
        `Failed to fetch data: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [accessToken]);
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredData =
    filterType === "ALL"
      ? financeData
      : financeData.filter((item) => item.type === filterType);

  const totalIncome = financeData
    .filter((item) => item.type === INOUT.INCOME)
    .reduce((sum, item) => sum + item.amount, 0);

  const totalOutcome = financeData
    .filter((item) => item.type === INOUT.OUTCOME)
    .reduce((sum, item) => sum + item.amount, 0);

  const balance = totalIncome - totalOutcome;

  const handleEditTransaction = (transaction: FinanceDetailsResponse) => {
    setCurrentTransaction(transaction);
    setShowEditModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b ">
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatisticsCard
              title="Total Pemasukan"
              amount={totalIncome}
              type="income"
            />
            <StatisticsCard
              title="Total Pengeluaran"
              amount={totalOutcome}
              type="outcome"
            />
            <StatisticsCard title="Saldo" amount={balance} type="balance" />
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-3/5 bg-white rounded-lg p-6 shadow-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  Statistik
                </h2>
                <div className="flex items-center gap-2">
                  {["Day", "Week", "Month", "Year"].map((period) => (
                    <button
                      key={period}
                      onClick={() =>
                        setTimePeriod(period.toLowerCase() as TimePeriod)
                      }
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        timePeriod === period.toLowerCase()
                          ? "bg-slate-500 text-white"
                          : "text-gray-500 hover:bg-gray-100"
                      }`}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-64">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-slate-500"></div>
                  </div>
                ) : error ? (
                  <div className="flex items-center justify-center h-full text-red-500">
                    {error}
                  </div>
                ) : (
                  <FinanceChart data={financeData} timePeriod={timePeriod} />
                )}
              </div>

              <div className="flex justify-between mt-4">
                <button
                  onClick={() => setFilterType(INOUT.INCOME)}
                  className={`px-4 py-2 border rounded-lg transition-colors ${
                    filterType === INOUT.INCOME
                      ? "bg-slate-500 text-white border-slate-500"
                      : "border-gray-500 text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  Income
                </button>
                <button
                  onClick={() => setFilterType(INOUT.OUTCOME)}
                  className={`px-4 py-2 border rounded-lg transition-colors ${
                    filterType === INOUT.OUTCOME
                      ? "bg-slate-500 text-white border-slate-500"
                      : "border-gray-500 text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  Expense
                </button>
                <button
                  onClick={() => setFilterType("ALL")}
                  className={`px-4 py-2 border rounded-lg transition-colors ${
                    filterType === "ALL"
                      ? "bg-slate-500 text-white border-slate-500"
                      : "border-gray-500 text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  All
                </button>
              </div>
            </div>

            <div className="w-full md:w-2/5 bg-white rounded-lg p-6 shadow-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  Keuangan
                </h2>
                <button
                  title="Add Transaction"
                  onClick={() => setShowAddModal(true)}
                  className="p-3 bg-slate-500 text-white rounded-full hover:bg-slate-600 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </button>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-slate-500"></div>
                </div>
              ) : error ? (
                <div className="text-red-500 p-4 text-center">{error}</div>
              ) : filteredData.length === 0 ? (
                <div className="text-gray-500 p-4 text-center">
                  Tidak ada data transaksi
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredData.slice(0, 5).map((finance) => (
                    <div key={finance.id_finance} className="border-b pb-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-gray-800">
                            {finance.category}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(finance.payment_date).toLocaleDateString(
                              "id-ID",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <p
                            className={`font-semibold ${
                              finance.type === INOUT.INCOME
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                          >
                            {finance.type === INOUT.INCOME ? "+" : "-"}
                            {finance.amount.toLocaleString("id-ID", {
                              style: "currency",
                              currency: "IDR",
                              minimumFractionDigits: 0,
                            })}
                          </p>
                          <button
                            title="Edit"
                            onClick={() => handleEditTransaction(finance)}
                            className="p-2 text-gray-500 hover:text-slate-700 transition-colors"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Bottom row - Table */}
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Laporan Pembayaran Penyewa Kos
            </h2>
            {isLoading ? (
              <div className="flex items-center justify-center h-40">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-slate-500"></div>
              </div>
            ) : error ? (
              <div className="text-red-500 p-4 text-center">{error}</div>
            ) : (
              <FinanceTable
                data={filteredData}
                onEdit={handleEditTransaction}
              />
            )}
          </div>
        </div>
      </main>

      {showAddModal && (
        <TransactionModal
        accessToken={accessToken}
          onRefresh={fetchData}
          onClose={() => setShowAddModal(false)}
          transaction={null}
          showAlert={showAlert}
        />
      )}

      {showEditModal && currentTransaction && (
        <TransactionModal
          accessToken={accessToken}
          showAlert={showAlert}
          onClose={() => setShowEditModal(false)}
          transaction={currentTransaction}
          onRefresh={fetchData}
        />
      )}

      <AlertMessage 
        type={alert.type}
        message={alert.message}
        isOpen={alert.isOpen}
        onClose={() => setAlert({ ...alert, isOpen: false })}
      />
    </div>
  );
}
