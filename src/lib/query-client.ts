'use client';

import { QueryClient } from '@tanstack/react-query';

/**
 * Creates a new QueryClient instance with sensible defaults for the Dashboard.
 *
 * Configuration rationale:
 * - staleTime (5 min): Balance freshness with reduced API requests
 * - gcTime (10 min): Keep cache reasonable, clear unused queries
 * - retry (1): Single retry to avoid excessive API calls on failure
 * - refetchOnWindowFocus (false): Analytics data doesn't change frequently
 */
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,      // 5 minutes - data considered fresh
        gcTime: 10 * 60 * 1000,         // 10 minutes - garbage collection time
        retry: 1,                        // Retry once on failure
        refetchOnWindowFocus: false,     // Don't refetch on window focus
        refetchOnReconnect: true,        // Refetch when network reconnects
      },
    },
  });
}

// Browser: Create singleton QueryClient to maintain cache across renders
let browserQueryClient: QueryClient | undefined = undefined;

/**
 * Gets or creates a QueryClient instance.
 *
 * On the server: Always creates a new QueryClient
 * On the browser: Reuses existing QueryClient (singleton pattern)
 *
 * This ensures proper SSR hydration while maintaining client-side cache.
 */
export function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    if (!browserQueryClient) {
      browserQueryClient = makeQueryClient();
    }
    return browserQueryClient;
  }
}

/**
 * Query key factory for consistent key generation across the app.
 *
 * Usage:
 *   queryKeys.analytics.guest()           // ['analytics', 'guest']
 *   queryKeys.analytics.company(id)       // ['analytics', 'company', id]
 *   queryKeys.analytics.all()             // ['analytics']
 */
export const queryKeys = {
  analytics: {
    all: () => ['analytics'] as const,
    guest: () => ['analytics', 'guest'] as const,
    bot: () => ['analytics', 'bot'] as const,
    company: (companyId: string) => ['analytics', 'company', companyId] as const,
  },
  users: {
    all: () => ['users'] as const,
    detail: (userId: string) => ['users', userId] as const,
  },
} as const;
