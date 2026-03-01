"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { resetPassword } from "@/lib/supabase"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess(false)

    try {
      const redirectUrl = `${window.location.origin}/auth/reset-password`
      await resetPassword(email.trim().toLowerCase(), redirectUrl)
      setSuccess(true)
    } catch (error) {
      console.error("Password reset error:", error)
      const errorMessage = error instanceof Error ? error.message : "An error occurred"

      if (errorMessage.includes("rate limit")) {
        setError("Too many requests. Please wait a few minutes before trying again.")
      } else if (errorMessage.includes("not found") || errorMessage.includes("invalid")) {
        setSuccess(true)
      } else {
        setError("Failed to send reset email. Please try again.")
      }
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fafafa] relative overflow-hidden px-4">
      {/* Ambient orbs */}
      <div className="auth-orb-pulse absolute top-[5%] left-1/2 -translate-x-1/2 w-[320px] h-[320px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(91, 45, 140, 0.05) 0%, transparent 70%)' }} />
      <div className="auth-orb-pulse-slow absolute bottom-[10%] -left-[30px] w-[160px] h-[160px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(255, 159, 67, 0.04) 0%, transparent 70%)' }} />

      <div className="relative z-10 w-full max-w-[380px] flex flex-col items-center">
        {/* Back link */}
        <Link
          href="/auth/signin"
          className="auth-animate-fade self-start flex items-center gap-1.5 text-[13px] font-medium text-[#9ca3af] hover:text-[#5B2D8C] transition-colors mb-6"
          style={{ animationDelay: '0.1s' }}
        >
          <span className="text-base leading-none">&larr;</span>
          Back
        </Link>

        {/* Logo */}
        <div className="auth-animate-up mb-4" style={{ animationDelay: '0.15s' }}>
          <Image
            src="/Logo.png"
            alt="Be-Inc"
            width={80}
            height={80}
            className=""
            style={{ filter: 'drop-shadow(0 2px 8px rgba(91, 45, 140, 0.1))' }}
          />
        </div>

        {success ? (
          <>
            {/* Success state */}
            <div className="auth-animate-up text-center mb-3" style={{ animationDelay: '0.3s' }}>
              {/* Mail icon */}
              <div className="mx-auto mb-4 w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, rgba(91, 45, 140, 0.1) 0%, rgba(99, 102, 214, 0.1) 100%)' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#5B2D8C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2"/>
                  <path d="M22 7l-10 7L2 7"/>
                </svg>
              </div>
              <h1 className="font-serif-display text-[24px] font-normal text-[#1a1a2e] tracking-tight mb-2">
                Check Your Email
              </h1>
              <p className="text-[13px] text-[#9ca3af] leading-relaxed max-w-[280px] mx-auto">
                If an account exists for <span className="text-[#6b7280] font-medium">{email}</span>, we&apos;ve sent a password reset link. Check your inbox and spam folder.
              </p>
            </div>

            <div className="auth-animate-up w-full mt-6" style={{ animationDelay: '0.5s' }}>
              <Link
                href="/auth/signin"
                className="flex items-center justify-center gap-2 w-full h-12 rounded-[14px] text-[#5B2D8C] font-semibold text-[15px] tracking-wide border-2 border-[#5B2D8C]/20 bg-transparent hover:bg-[#5B2D8C]/5 transition-colors no-underline"
              >
                <span className="text-base leading-none">&larr;</span>
                Back to Sign In
              </Link>
            </div>
          </>
        ) : (
          <>
            {/* Header */}
            <div className="auth-animate-up text-center mb-3" style={{ animationDelay: '0.3s' }}>
              <h1 className="font-serif-display text-[24px] font-normal text-[#1a1a2e] tracking-tight mb-1.5">
                Reset Password
              </h1>
              <p className="text-[13.5px] text-[#9ca3af] tracking-wide">
                Enter your email to receive a reset link
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="auth-animate-up w-full flex flex-col gap-4.5" style={{ animationDelay: '0.5s' }}>
              {error && (
                <div className="text-[12.5px] font-medium text-red-600 bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5 leading-relaxed">
                  {error}
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-[12px] font-semibold text-[#6b7280] tracking-wider uppercase">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm text-[#1a1a2e] placeholder-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#5B2D8C]/20 focus:border-[#5B2D8C]/40 transition-all disabled:opacity-60"
                  placeholder="you@company.com"
                  autoComplete="email"
                />
              </div>

              {/* Submit button */}
              <div className="auth-animate-up mt-1" style={{ animationDelay: '0.65s' }}>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="auth-pulse-glow relative overflow-hidden w-full h-12 rounded-[14px] text-white font-semibold text-[15px] tracking-wide cursor-pointer border-none transition-all duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.02] hover:shadow-[0_8px_32px_rgba(91,45,140,0.35)] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                  style={{ background: 'linear-gradient(135deg, #5B2D8C 0%, #6366d6 100%)', boxShadow: '0 4px 20px rgba(91, 45, 140, 0.2)' }}
                >
                  <span className="auth-shimmer absolute top-0 left-0 w-1/2 h-full pointer-events-none"
                    style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)', transform: 'translateX(-100%) rotate(12deg)' }} />
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </button>
              </div>
            </form>
          </>
        )}

        {/* Footer */}
        <div className="auth-animate-fade mt-10" style={{ animationDelay: '1.0s' }}>
          <span className="text-[11px] text-[#c4c4c4] tracking-[1.5px] uppercase font-medium">
            Be-Inc
          </span>
        </div>
      </div>
    </div>
  )
}
