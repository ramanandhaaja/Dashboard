"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"

export default function SignIn() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("Invalid credentials")
      } else {
        router.push("/dashboard")
        router.refresh()
      }
    } catch {
      setError("An error occurred. Please try again.")
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
          href="/"
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

        {/* Header */}
        <div className="auth-animate-up text-center mb-3" style={{ animationDelay: '0.3s' }}>
          <h1 className="font-serif-display text-[26px] font-normal text-[#1a1a2e] tracking-tight mb-1.5">
            Welcome back
          </h1>
          <p className="text-[13.5px] text-[#9ca3af] tracking-wide">
            Sign in to your account
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

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-[12px] font-semibold text-[#6b7280] tracking-wider uppercase">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="w-full px-3.5 py-2.5 pr-10 border border-gray-200 rounded-xl text-sm text-[#1a1a2e] placeholder-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#5B2D8C]/20 focus:border-[#5B2D8C]/40 transition-all disabled:opacity-60"
                placeholder="Enter your password"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#5B2D8C] transition-colors p-1"
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
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
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Sign In
                  <span className="text-base opacity-80">&rarr;</span>
                </span>
              )}
            </button>
          </div>

          {/* Forgot password */}
          <div className="auth-animate-fade text-center mt-1" style={{ animationDelay: '0.8s' }}>
            <Link
              href="/auth/forgot-password"
              className="text-[13px] font-medium text-[#9ca3af] hover:text-[#5B2D8C] transition-colors"
            >
              Forgot password?
            </Link>
          </div>
        </form>

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
