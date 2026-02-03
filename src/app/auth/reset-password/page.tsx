"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { updatePassword, supabase } from "@/lib/supabase"

export default function ResetPassword() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [isValidSession, setIsValidSession] = useState<boolean | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Check if user has a valid session from the reset email link
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()

        if (session) {
          setIsValidSession(true)
        } else {
          // Listen for auth state changes (Supabase sets session from URL hash)
          const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
              if (event === "PASSWORD_RECOVERY" && session) {
                setIsValidSession(true)
              } else if (event === "SIGNED_IN" && session) {
                // Also handle SIGNED_IN event which may occur
                setIsValidSession(true)
              }
            }
          )

          // Check again after a short delay (for URL hash processing)
          setTimeout(async () => {
            const { data: { session: currentSession } } = await supabase.auth.getSession()
            if (currentSession) {
              setIsValidSession(true)
            } else if (isValidSession === null) {
              setIsValidSession(false)
            }
          }, 1000)

          return () => {
            subscription.unsubscribe()
          }
        }
      } catch (error) {
        console.error("Session check error:", error)
        setIsValidSession(false)
      }
    }

    checkSession()
  }, [isValidSession])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      setIsLoading(false)
      return
    }

    try {
      await updatePassword(password)
      setSuccess(true)

      // Redirect to signin after 3 seconds
      setTimeout(() => {
        router.push("/auth/signin")
      }, 3000)
    } catch (error) {
      console.error("Password update error:", error)
      const errorMessage = error instanceof Error ? error.message : "An error occurred"

      if (errorMessage.includes("expired") || errorMessage.includes("invalid")) {
        setError("This reset link has expired. Please request a new one.")
      } else if (errorMessage.includes("weak") || errorMessage.includes("password")) {
        setError("Password is too weak. Please use a stronger password.")
      } else if (errorMessage.includes("same")) {
        setError("New password must be different from your current password.")
      } else {
        setError("Failed to update password. Please try again.")
      }
    }

    setIsLoading(false)
  }

  // Loading state while checking session
  if (isValidSession === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-md w-full space-y-8 p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Reset Password
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Verifying your reset link...
            </p>
          </div>

          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        </div>
      </div>
    )
  }

  // Invalid or expired link
  if (isValidSession === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-md w-full space-y-8 p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Invalid or Expired Link
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              This password reset link is invalid or has expired.
            </p>
          </div>

          <div className="bg-yellow-50 border border-yellow-300 text-yellow-700 px-4 py-3 rounded dark:bg-yellow-900/30 dark:border-yellow-800 dark:text-yellow-400">
            <p className="text-sm">
              Password reset links are valid for a limited time. Please request a new link.
            </p>
          </div>

          <div className="space-y-4">
            <Link
              href="/auth/forgot-password"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Request New Reset Link
            </Link>

            <div className="text-center">
              <Link
                href="/auth/signin"
                className="text-sm text-indigo-600 hover:text-indigo-500 font-medium"
              >
                &larr; Back to sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Valid session - show password reset form
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-md w-full space-y-8 p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Reset Password
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Enter your new password
          </p>
        </div>

        {success ? (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-300 text-green-700 px-4 py-3 rounded dark:bg-green-900/30 dark:border-green-800 dark:text-green-400">
              <p className="font-medium">Password updated successfully!</p>
              <p className="text-sm mt-1">
                Redirecting you to sign in...
              </p>
            </div>

            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
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
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                New Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter new password"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                placeholder="Confirm new password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "Updating..." : "Update Password"}
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
