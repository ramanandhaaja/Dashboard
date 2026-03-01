"use client"

import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession()
  return (
    <div className="min-h-screen bg-[#fafafa] relative overflow-hidden">
      {/* Ambient orbs */}
      <div className="auth-orb-pulse absolute top-[15%] left-1/2 -translate-x-1/2 w-[340px] h-[340px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(91, 45, 140, 0.06) 0%, transparent 70%)' }} />
      <div className="auth-orb-pulse-slow absolute top-[60%] -right-[40px] w-[180px] h-[180px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(255, 159, 67, 0.05) 0%, transparent 70%)' }} />

      {/* Top Navigation */}
      <nav className="relative z-10 bg-white/70 backdrop-blur-md border-b border-gray-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="font-serif-display text-xl text-[#5B2D8C] no-underline">
                Be-Inc
              </Link>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  href="/"
                  className="text-[#1a1a2e] hover:text-[#5B2D8C] px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Home
                </Link>
                {session ? (
                  <Link
                    href="/dashboard"
                    className="text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02]"
                    style={{ background: 'linear-gradient(135deg, #5B2D8C 0%, #6366d6 100%)' }}
                  >
                    Dashboard
                  </Link>
                ) : (
                  <Link
                    href="/auth/signin"
                    className="text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02]"
                    style={{ background: 'linear-gradient(135deg, #5B2D8C 0%, #6366d6 100%)' }}
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              {session ? (
                <Link
                  href="/dashboard"
                  className="text-white px-3 py-2 rounded-xl text-sm font-semibold transition-all"
                  style={{ background: 'linear-gradient(135deg, #5B2D8C 0%, #6366d6 100%)' }}
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  href="/auth/signin"
                  className="text-white px-3 py-2 rounded-xl text-sm font-semibold transition-all"
                  style={{ background: 'linear-gradient(135deg, #5B2D8C 0%, #6366d6 100%)' }}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className="md:hidden border-t border-gray-200/60">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white/70 backdrop-blur-md">
            <Link
              href="/"
              className="text-[#1a1a2e] hover:text-[#5B2D8C] block px-3 py-2 rounded-md text-base font-medium"
            >
              Home
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-8">
        <div className="max-w-lg w-full mx-auto flex flex-col items-center">
          {/* Logo */}
          <div className="auth-animate-up mb-4" style={{ animationDelay: '0.15s' }}>
            <Image
              src="/Logo.png"
              alt="Be-Inc"
              width={110}
              height={110}
              className=""
              style={{ filter: 'drop-shadow(0 2px 12px rgba(91, 45, 140, 0.12))' }}
            />
          </div>

          {/* Headline */}
          <h1 className="auth-animate-up font-serif-display text-[28px] font-normal text-[#1a1a2e] text-center leading-tight tracking-tight mb-3" style={{ animationDelay: '0.3s' }}>
            {session ? (
              <>
                Welcome back,{' '}
                <span className="text-[#5B2D8C]">{session.user?.name || 'User'}</span>
              </>
            ) : (
              <>
                Welcome to{' '}
                <span className="text-[#5B2D8C]">Be-Inc</span>
              </>
            )}
          </h1>

          {/* Tagline */}
          <p className="auth-animate-fade text-[14px] text-[#6b7280] text-center leading-relaxed tracking-wide" style={{ animationDelay: '0.5s' }}>
            {session
              ? 'You are successfully signed in to your account.'
              : 'AI-powered DE&I compliance dashboard'
            }
          </p>

          {/* Divider */}
          <div className="auth-animate-grow w-12 h-px bg-[#d1d5db] my-7" style={{ animationDelay: '0.65s' }} />

          {/* CTA */}
          <div className="auth-animate-up w-full max-w-[380px]" style={{ animationDelay: '0.8s' }}>
            {session ? (
              <div className="space-y-3">
                <Link
                  href="/dashboard"
                  className="auth-pulse-glow relative overflow-hidden flex items-center justify-center gap-2.5 w-full h-[50px] rounded-[14px] text-white font-semibold text-[15px] tracking-wide no-underline transition-all duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.02] hover:shadow-[0_8px_32px_rgba(91,45,140,0.35)] active:scale-[0.98]"
                  style={{ background: 'linear-gradient(135deg, #5B2D8C 0%, #6366d6 100%)', boxShadow: '0 4px 20px rgba(91, 45, 140, 0.2)' }}
                >
                  <span className="auth-shimmer absolute top-0 left-0 w-1/2 h-full pointer-events-none"
                    style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)', transform: 'translateX(-100%) rotate(12deg)' }} />
                  Go to Dashboard
                  <span className="text-base opacity-80">&rarr;</span>
                </Link>

                <p className="text-center text-[12px] text-[#9ca3af]">
                  Signed in as: {session.user?.email}
                </p>
              </div>
            ) : (
              <Link
                href="/auth/signin"
                className="auth-pulse-glow relative overflow-hidden flex items-center justify-center gap-2.5 w-full h-[50px] rounded-[14px] text-white font-semibold text-[15px] tracking-wide no-underline transition-all duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.02] hover:shadow-[0_8px_32px_rgba(91,45,140,0.35)] active:scale-[0.98]"
                style={{ background: 'linear-gradient(135deg, #5B2D8C 0%, #6366d6 100%)', boxShadow: '0 4px 20px rgba(91, 45, 140, 0.2)' }}
              >
                <span className="auth-shimmer absolute top-0 left-0 w-1/2 h-full pointer-events-none"
                  style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)', transform: 'translateX(-100%) rotate(12deg)' }} />
                Sign In
                <span className="text-base opacity-80">&rarr;</span>
              </Link>
            )}
          </div>

          {/* Trust badges (not signed in) */}
          {!session && (
            <div className="auth-animate-fade flex flex-col items-center gap-2.5 mt-9" style={{ animationDelay: '1.0s' }}>
              <div className="flex items-center gap-5">
                <div className="flex items-center gap-1.5">
                  <svg className="w-[13px] h-[13px] text-[#9ca3af]" viewBox="0 0 16 16" fill="none">
                    <rect x="3" y="7" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
                    <path d="M5 7V5a3 3 0 0 1 6 0v2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                    <circle cx="8" cy="10.5" r="1" fill="currentColor" />
                  </svg>
                  <span className="text-[10.5px] font-medium text-[#9ca3af] tracking-wide whitespace-nowrap">256-bit encrypted</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <svg className="w-[13px] h-[13px] text-[#9ca3af]" viewBox="0 0 16 16" fill="none">
                    <path d="M8 1.5L2.5 4v4c0 3.5 2.5 5.5 5.5 6.5 3-1 5.5-3 5.5-6.5V4L8 1.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
                    <path d="M6 8l1.5 1.5L10.5 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="text-[10.5px] font-medium text-[#9ca3af] tracking-wide whitespace-nowrap">GDPR compliant</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <svg className="w-[13px] h-[13px] text-[#9ca3af]" viewBox="0 0 16 16" fill="none">
                  <rect x="2" y="3" width="5" height="11" rx="0.5" stroke="currentColor" strokeWidth="1.3" />
                  <rect x="9" y="6" width="5" height="8" rx="0.5" stroke="currentColor" strokeWidth="1.3" />
                  <line x1="4" y1="5.5" x2="5.5" y2="5.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                  <line x1="4" y1="7.5" x2="5.5" y2="7.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                  <line x1="4" y1="9.5" x2="5.5" y2="9.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                  <line x1="11" y1="8.5" x2="12.5" y2="8.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                  <line x1="11" y1="10.5" x2="12.5" y2="10.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                </svg>
                <span className="text-[10.5px] font-medium text-[#9ca3af] tracking-wide whitespace-nowrap">Enterprise ready</span>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="auth-animate-fade mt-10" style={{ animationDelay: '1.2s' }}>
            <span className="text-[11px] text-[#c4c4c4] tracking-[1.5px] uppercase font-medium">
              Be-Inc
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
