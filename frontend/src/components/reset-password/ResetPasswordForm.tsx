"use client"

import { type FormEvent, useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { apiRequest } from "@/lib/api"

interface Props {
    token: string
    phone: string
}

/**
 * Reset Password Page component that provides a form for users to set a new password.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {string} props.token - The reset password token received from the reset request
 * @param {string} props.phone - The user's phone number associated with the account
 * 
 * @returns {JSX.Element} A form interface for users to reset their password
 * 
 * @example
 * ```tsx
 * <ResetPasswordPage token="reset-token-123" phone="6281234567890" />
 * ```
 * 
 * The component manages several states:
 * - Password visibility toggles for both fields
 * - Password and confirmation input values
 * - Form submission status (loading, error, success)
 * 
 * On successful password reset, the user is redirected to the login page after 2 seconds.
 */
export default function ResetPasswordPage({token, phone}: Props) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (password !== confirmPassword) {
      setError("Kata sandi tidak cocok!")
      setLoading(false)
      return
    }

    try {
      const response = await apiRequest({
        endpoint: `/users/reset-password`,
        method: "PATCH",
        body: {
          password: password,
          token: token,
          phone: phone,
        },
      })

      if (!response) {
        setError("Terjadi kesalahan, coba lagi.")
      } else {
        setSuccess("Kata sandi berhasil diubah! Mengalihkan ke halaman login...")
        setTimeout(() => {
          window.location.href = "/login"
        }, 2000)
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
        <div className="flex flex-col items-center gap-6">
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-center text-[#202244] text-2xl font-medium font-['Poppins']">Reset Kata Sandi</h1>
            <p className="text-center text-[#707B81] text-sm font-normal font-['Poppins'] leading-tight max-w-md">
              Masukkan nomor telepon dan kata sandi baru Anda
            </p>
          </div>

          <form onSubmit={handleSubmit} className="w-full max-w-xs flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[#30373D] text-xs font-medium font-['Poppins']">Kata Sandi Baru</label>
              <div className="relative">
                <input
                  title="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-black text-sm font-normal font-['Poppins'] text-[#1A2530]"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-[#30373D]" />
                  ) : (
                    <Eye className="w-4 h-4 text-[#30373D]" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[#30373D] text-xs font-medium font-['Poppins']">Konfirmasi Kata Sandi</label>
              <div className="relative">
                <input
                  title="confirm password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-black text-sm font-normal font-['Poppins'] text-[#1A2530]"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4 text-[#30373D]" />
                  ) : (
                    <Eye className="w-4 h-4 text-[#30373D]" />
                  )}
                </button>
              </div>
            </div>

            {error && <p className="text-red-500 text-xs font-medium text-center">{error}</p>}
            {success && <p className="text-green-500 text-xs font-medium text-center">{success}</p>}

            <button
              type="submit"
              className="w-full py-2.5 mt-4 rounded-2xl border-2 border-black bg-transparent text-[#1A2530] text-sm font-medium font-['Poppins'] hover:bg-black hover:text-white transition-colors"
              disabled={loading}
            >
              {loading ? "Loading..." : "Reset Kata Sandi"}
            </button>
          </form>

          <div className="mt-1">
            <p className="text-center text-white text-xs font-normal font-['Poppins']">
              Ingat kata sandi?{" "}
              <a href="/login" className="font-medium underline">
                Masuk
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
