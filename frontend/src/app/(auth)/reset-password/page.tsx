"use client"

import type React from "react"

import { type FormEvent, useState, useRef, useEffect } from "react"
import { ArrowLeft } from "lucide-react"
import { apiRequest } from "@/lib/api"

export default function ResetPasswordFlow() {
  const [step, setStep] = useState<"phone" | "otp" | "success">("phone")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const [otp, setOtp] = useState<string[]>(Array(6).fill(""))
  const [resendCooldown, setResendCooldown] = useState(0)
  const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null))
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    if (resendCooldown <= 0) return

    const timer = setTimeout(() => {
      setResendCooldown(resendCooldown - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [resendCooldown])

  const handlePhoneSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await apiRequest<{ token: string }>({
        endpoint: "/users/send-otp",
        method: "POST",
        body: {
          phone: phoneNumber,
        },
      })

      if (response === null) {
        setError("Terjadi kesalahan, coba lagi.")
      } else {
        setSuccess("OTP berhasil dikirim ke nomor telepon Anda! Silakan periksa WhatsApp anda.")
        setStep("otp")
        setResendCooldown(60) 
      }
    } catch (error) {
      setError("Terjadi kesalahan, coba lagi.")
      throw error
    } finally {
      setLoading(false)
    }
  }

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value.slice(0, 1)
    setOtp(newOtp)

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text/plain").trim()

    if (!/^\d+$/.test(pastedData)) return

    const digits = pastedData.slice(0, 6).split("")
    const newOtp = [...otp]

    digits.forEach((digit, index) => {
      if (index < 6) {
        newOtp[index] = digit
      }
    })

    setOtp(newOtp)

    const nextEmptyIndex = newOtp.findIndex((val) => !val)
    if (nextEmptyIndex !== -1) {
      inputRefs.current[nextEmptyIndex]?.focus()
    } else {
      inputRefs.current[5]?.focus()
    }
  }

  const handleOtpSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const otpValue = otp.join("")
    if (otpValue.length !== 6) {
      setError("Kode OTP harus 6 digit!")
      setLoading(false)
      return
    }

    try {
      const response = await apiRequest<{message:string, token: string}>({
        endpoint: "/users/verify-otp",
        method: "POST",
        body: {
          otp: otpValue,
          phone: phoneNumber,
        },
      })
      setToken(response.token)

      if (response === null) {
        setError("Kode OTP tidak valid atau telah kedaluwarsa.")
      } else {
        setSuccess("Verifikasi OTP berhasil!")
        setStep("success")

      }
    } catch (error) {
      setError("Terjadi kesalahan, coba lagi.")
      throw error
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = () => {
      window.location.href =`/reset-password/${token}/?phone=${phoneNumber}`
  }

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await apiRequest<{ token: string }>({
        endpoint: "/users/otp",
        method: "POST",
        body: {
          phone: phoneNumber,
        },
      })

      if (response === null) {
        setError("Terjadi kesalahan, coba lagi.")
      } else {
        setSuccess("OTP baru berhasil dikirim ke nomor telepon Anda!")
        setResendCooldown(60) 
      }
    } catch (error) {
      setError("Terjadi kesalahan, coba lagi.")
      throw error
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full h-screen p-4 bg-gradient-to-b from-white via-[#F0FEF0] via-[#C3E7C2] to-[#699F67] flex flex-col items-center justify-center overflow-hidden">
      <div className="w-full max-w-md flex flex-col items-center justify-center gap-8 py-4">
        {step === "phone" && (
          <div className="flex flex-col items-center gap-6">
            <div className="flex flex-col items-center gap-2">
              <h1 className="text-center text-[#202244] text-2xl font-medium font-['Poppins']">Reset Kata Sandi</h1>
              <p className="text-center text-[#707B81] text-sm font-normal font-['Poppins'] leading-tight max-w-md">
                Masukkan nomor telepon Anda untuk menerima kode OTP
              </p>
            </div>

            <form onSubmit={handlePhoneSubmit} className="w-full max-w-xs flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[#30373D] text-xs font-medium font-['Poppins']">No Telepon</label>
                <input
                  type="text"
                  placeholder="08123456789"
                  className="w-full px-4 py-2.5 rounded-2xl border border-black text-sm font-normal font-['Poppins'] text-[#1A2530]"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </div>

              {error && <p className="text-red-500 text-xs font-medium text-center">{error}</p>}
              {success && <p className="text-green-500 text-xs font-medium text-center">{success}</p>}

              <button
                type="submit"
                className="w-full py-2.5 mt-4 rounded-2xl border-2 border-black bg-transparent text-[#1A2530] text-sm font-medium font-['Poppins'] hover:bg-black hover:text-white transition-colors"
                disabled={loading}
              >
                {loading ? "Loading..." : "Kirim OTP"}
              </button>
            </form>
          </div>
        )}

        {step === "otp" && (
          <div className="flex flex-col items-center gap-6">
            <div className="flex flex-col items-center gap-2">
              <h1 className="text-center text-[#202244] text-2xl font-medium font-['Poppins']">Verifikasi OTP</h1>
              <p className="text-center text-[#707B81] text-sm font-normal font-['Poppins'] leading-tight max-w-md">
                Masukkan kode OTP yang telah dikirim ke WhatsApp Anda
              </p>
            </div>

            <form onSubmit={handleOtpSubmit} className="w-full max-w-xs flex flex-col gap-5">
              <div className="flex justify-center gap-2">
                {otp.map((digit, index) => (
                  <input
                    title="otp"
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    className="w-10 h-12 text-center text-lg font-medium font-['Poppins'] rounded-xl border-2 border-black text-[#1A2530] focus:outline-none focus:border-[#699F67] focus:ring-2 focus:ring-[#699F67]"
                    required
                  />
                ))}
              </div>

              {error && <p className="text-red-500 text-xs font-medium text-center">{error}</p>}
              {success && <p className="text-green-500 text-xs font-medium text-center">{success}</p>}

              <button
                type="submit"
                className="w-full py-2.5 mt-2 rounded-2xl border-2 border-black bg-transparent text-[#1A2530] text-sm font-medium font-['Poppins'] hover:bg-black hover:text-white transition-colors"
                disabled={loading}
              >
                {loading ? "Memverifikasi..." : "Verifikasi OTP"}
              </button>

              <div className="flex justify-between w-full mt-2">
                <button
                  type="button"
                  onClick={() => setStep("phone")}
                  className="flex items-center text-[#30373D] text-xs font-medium"
                >
                  <ArrowLeft className="w-3 h-3 mr-1" />
                  Kembali
                </button>

                <button
                  type="button"
                  onClick={handleResendOtp}
                  className={`text-[#30373D] text-xs font-medium ${
                    resendCooldown > 0 ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={loading || resendCooldown > 0}
                >
                  {resendCooldown > 0 ? `Kirim Ulang (${resendCooldown}s)` : "Kirim Ulang OTP"}
                </button>
              </div>
            </form>
          </div>
        )}

        {step === "success" && (
          <div className="flex flex-col items-center gap-6">
            <div className="flex flex-col items-center gap-2">
              <h1 className="text-center text-[#202244] text-2xl font-medium font-['Poppins']">Verifikasi Berhasil</h1>
              <p className="text-center text-[#707B81] text-sm font-normal font-['Poppins'] leading-tight max-w-md">
                OTP berhasil diverifikasi. Anda akan diarahkan ke halaman reset kata sandi.
              </p>
            </div>

            {/* You can add a button to redirect to password reset page here */}
            <button
              onClick={handleResetPassword}
              className="w-full max-w-xs py-2.5 mt-4 rounded-2xl border-2 border-black bg-transparent text-[#1A2530] text-sm font-medium font-['Poppins'] hover:bg-black hover:text-white transition-colors"
            >
              Lanjutkan
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
