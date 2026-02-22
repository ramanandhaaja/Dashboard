"use client"

import Link from "next/link";
import { useSession } from "next-auth/react";
export default function Home() {
  const { data: session } = useSession()
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Top Navigation */}
      <nav className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                Be-inc
              </Link>
            </div>
            
            {/* Navigation Links */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link 
                  href="/" 
                  className="text-gray-900 dark:text-gray-100 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Home
                </Link>
                <Link 
                  href="/about" 
                  className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  About
                </Link>
                <Link 
                  href="/pricing" 
                  className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Pricing
                </Link>
                {session ? (
                  <Link 
                    href="/dashboard" 
                    className="text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Dashboard
                  </Link>
                ) : (
                  <Link 
                    href="/auth/signin" 
                    className="text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
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
                  className="text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Dashboard
                </Link>
              ) : (
                <Link 
                  href="/auth/signin" 
                  className="text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
        
        {/* Mobile Navigation Menu */}
        <div className="md:hidden border-t border-gray-200 dark:border-gray-700">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white dark:bg-gray-800">
            <Link 
              href="/" 
              className="text-gray-900 dark:text-gray-100 hover:text-indigo-600 dark:hover:text-indigo-400 block px-3 py-2 rounded-md text-base font-medium"
            >
              Home
            </Link>
            <Link 
              href="/about" 
              className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 block px-3 py-2 rounded-md text-base font-medium"
            >
              About
            </Link>
            <Link 
              href="/pricing" 
              className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 block px-3 py-2 rounded-md text-base font-medium"
            >
              Pricing
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-8">
        <div className="max-w-lg w-full mx-auto">
            <div className="space-y-8 p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  {session ? `Welcome back, ${session.user?.name || 'User'}!` : 'Welcome to'}
                </h1>
                {!session && (
                  <h2 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-6">
                    Be-Inc Dashboard
                  </h2>
                )}
                <p className="text-gray-600 dark:text-gray-300 mb-8">
                  {session
                    ? 'You are successfully signed in to your account.'
                    : 'A modern Next.js starter template with authentication'
                  }
                </p>
              </div>

              {session ? (
                <div className="space-y-4">
                  <Link
                    href="/dashboard"
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                  >
                    Go to Dashboard
                  </Link>

                  <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Signed in as: {session.user?.email}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <Link
                    href="/auth/signin"
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                  >
                    Sign In
                  </Link>

                  {/* <Link
                    href="/auth/signup"
                    className="w-full flex justify-center py-3 px-4 border border-indigo-300 dark:border-indigo-600 rounded-md shadow-sm text-sm font-medium text-indigo-700 dark:text-indigo-300 bg-white dark:bg-gray-800 hover:bg-indigo-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                  >
                    Sign Up
                  </Link> */}
                </div>
              )}

              <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                Built with Next.js, Tailwind CSS & NextAuth.js
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}
