import Link from 'next/link'

/**
 * Component to display an error page when a password reset token is invalid or expired.
 * 
 * This component renders a full screen error message with:
 * - An error heading indicating the token is invalid
 * - A descriptive message explaining the token has expired or is invalid
 * - A button to request a new reset link (navigates to /reset-password)
 * - A link to the login page for users who remember their password
 * 
 * The component uses a green gradient background with responsive design.
 * 
 * @returns A React functional component displaying the error page
 */

export default function NotFound() {
  return (
    <div className="w-full h-screen p-4 bg-gradient-to-b from-white via-[#F0FEF0] via-[#C3E7C2] to-[#699F67] flex flex-col items-center justify-center overflow-hidden">
      <div className="w-full max-w-md flex flex-col items-center justify-center gap-8 py-4">
        <div className="flex flex-col items-center gap-6">
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-center text-[#202244] text-2xl font-medium font-['Poppins']">Token Tidak Valid</h1>
            <p className="text-center text-[#707B81] text-sm font-normal font-['Poppins'] leading-tight max-w-md">
              Link reset kata sandi yang Anda klik tidak valid atau telah kedaluwarsa
            </p>
          </div>

          <div className="w-full max-w-xs flex flex-col gap-3">
            <Link href="/reset-password">
              <button className="w-full py-2.5 rounded-2xl border-2 border-black bg-transparent text-[#1A2530] text-sm font-medium font-['Poppins'] hover:bg-black hover:text-white transition-colors">
                Minta Link Reset Baru
              </button>
            </Link>
          </div>

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