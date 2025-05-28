"use client";

import { FormEvent, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";

/**
 * LoginForm component for user authentication
 * 
 * This component renders a login form that allows users to sign in using their phone number and password.
 * It includes form validation, error handling, and success messages with redirection.
 * 
 * @returns A responsive login form with phone number and password inputs
 * 
 * Features:
 * - Password visibility toggle
 * - Loading state during authentication
 * - Error message display for failed login attempts
 * - Success message with auto-redirect on successful login
 * - Link to reset password page
 * 
 * State:
 * - showPassword: Controls password field visibility
 * - phoneNumber: Stores the user's phone number input
 * - password: Stores the user's password input
 * - error: Stores error messages if authentication fails
 * - success: Stores success message after successful authentication
 * - loading: Indicates when authentication is in progress
 * 
 * @example
 * <LoginForm />
 */

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        phone: phoneNumber,
        password,
        callbackUrl: "/",
      });
      
      if (res?.error) {
        setError("No telepon atau kata sandi salah!");
      }else{
        setSuccess("Login successful! Redirecting...")
        setTimeout(() => {
          window.location.href = "/"
        }, 1500)
      }
    } catch (error) {
      setError("Terjadi kesalahan, coba lagi.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen p-4 bg-gradient-to-b from-white via-[#F0FEF0] via-[#C3E7C2] to-[#699F67] flex flex-col items-center justify-center overflow-hidden">
      <div className="w-full max-w-md flex flex-col items-center justify-center gap-8 py-4">
        <div className="flex flex-col items-center gap-6">
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-center text-[#202244] text-2xl font-medium font-['Poppins']">
              Selamat datang
            </h1>
            <p className="text-center text-[#707B81] text-sm font-normal font-['Poppins'] leading-tight max-w-md">
              Pastikan isi No telepon & Kata Sandi anda dengan benar!
            </p>
          </div>

          <form onSubmit={handleSubmit} className="w-full max-w-xs flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[#30373D] text-xs font-medium font-['Poppins']">
                No Telepon
              </label>
              <input
                type="text"
                placeholder="08123456789"
                className="w-full px-4 py-2.5 rounded-2xl border border-black text-sm font-normal font-['Poppins'] text-[#1A2530]"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[#30373D] text-xs font-medium font-['Poppins']">
                Kata Sandi
              </label>
              <div className="relative">
                <input
                  title="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-black text-sm font-normal font-['Poppins'] text-[#1A2530]"
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

            {error && (
              <p className="text-red-500 text-xs font-medium text-center">{error}</p>
            )}
            {success && (
              <p className="text-green-500 text-xs font-medium text-center">{success}</p>
            )}

            <div className="text-right">
              <Link
                href="/reset-password"
                className="text-black text-xs font-normal font-['Poppins'] underline"
              >
                Lupa kata sandi?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 mt-1 rounded-2xl border-2 border-black bg-transparent text-[#1A2530] text-sm font-medium font-['Poppins'] hover:bg-black hover:text-white transition-colors"
              disabled={loading}
            >
              {loading ? "Loading..." : "Masuk"}
            </button>
          </form>

          <div className="mt-1">
            <p className="text-center text-white text-xs font-normal font-['Poppins']">
              Ga punya akun? <span className="font-medium">TANYA ADMIN</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

