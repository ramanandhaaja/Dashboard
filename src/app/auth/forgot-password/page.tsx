"use client"

import { useState } from "react"
import Link from "next/link"
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
      // Get the base URL for the redirect
      const redirectUrl = `${window.location.origin}/auth/reset-password`

      await resetPassword(email.trim().toLowerCase(), redirectUrl)

      setSuccess(true)
    } catch (error) {
      console.error("Password reset error:", error)
      const errorMessage = error instanceof Error ? error.message : "An error occurred"

      if (errorMessage.includes("rate limit")) {
        setError("Too many requests. Please wait a few minutes before trying again.")
      } else if (errorMessage.includes("not found") || errorMessage.includes("invalid")) {
        // Don't reveal if email exists or not for security
        setSuccess(true)
      } else {
        setError("Failed to send reset email. Please try again.")
      }
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-md w-full space-y-8 p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Forgot Password
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Enter your email to receive a password reset link
          </p>
        </div>

        {success ? (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-300 text-green-700 px-4 py-3 rounded dark:bg-green-900/30 dark:border-green-800 dark:text-green-400">
              <p className="font-medium">Check your email</p>
              <p className="text-sm mt-1">
                If an account exists with that email, we&apos;ve sent a password reset link.
                Please check your inbox and spam folder.
              </p>
            </div>

            <div className="text-center">
              <Link
                href="/auth/signin"
                className="text-indigo-600 hover:text-indigo-500 font-medium"
              >
                &larr; Back to sign in
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded dark:bg-red-900/30 dark:border-red-800 dark:text-red-400">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter your email"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </button>

            <div className="text-center">
              <Link
                href="/auth/signin"
                className="text-sm text-indigo-600 hover:text-indigo-500 font-medium"
              >
                &larr; Back to sign in
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
