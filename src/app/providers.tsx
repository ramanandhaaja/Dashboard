"use client"

import { SessionProvider } from "next-auth/react"
import { QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { getQueryClient } from "@/lib/query-client"

export function Providers({ children }: { children: React.ReactNode }) {
  // Get or create the QueryClient instance
  const queryClient = getQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>{children}</SessionProvider>
      {/* DevTools only in development - excluded from production bundle */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  )
}
