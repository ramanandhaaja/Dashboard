# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 starter template with authentication built using the App Router. The project includes:

- **Authentication**: NextAuth.js with credentials provider backed by Supabase PostgreSQL database
- **Database**: Supabase with bcrypt password hashing for secure user storage
- **UI Framework**: Tailwind CSS v4 with shadcn/ui components (New York style, Neutral base color)
- **Build Tool**: Next.js with Turbopack enabled for faster development
- **TypeScript**: Full TypeScript support throughout the project

## Development Commands

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build production version with Turbopack
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Architecture

### Authentication Flow
- NextAuth.js configured in `src/lib/auth.ts` and `src/app/api/auth/[...nextauth]/route.ts`
- Supabase database integration via `src/lib/supabase.ts` helper functions
- Session management uses JWT strategy with user data from Supabase
- Custom pages: `/auth/signin` and `/auth/signup` with real user registration
- Protected routes redirect unauthenticated users to sign-in
- SessionProvider wraps the app in `src/app/providers.tsx`
- Password hashing with bcrypt (12 rounds) for security

### External API Integration
- Secure server-side API proxy pattern implemented in `/api/health`
- Uses NextAuth JWT tokens for backend authentication
- Backend API base URL configured via `API_BASE_URL` environment variable (defaults to `http://localhost:3033/api`)
- Client calls Next.js API routes → Next.js validates session → Next.js proxies to backend with JWT
- Helper functions in `src/lib/api.ts` for making authenticated requests

### OpenAI ChatKit Integration
- ChatKit web component integrated for AI chat functionality
- Server-side session token generation in `/api/chatkit/session`
- Uses `<openai-chatkit>` web component (not React SDK)
- Client secret fetched from API endpoint without device ID
- ChatKit widget rendered on home page with responsive design
- ChatKit script loaded from CDN in layout head
- Follows official OpenAI ChatKit starter app pattern

### Route Structure
- **Landing page** (`/`): Welcome page with navigation, shows user-specific content when authenticated
- **Authentication pages** (`/auth/signin`, `/auth/signup`): Custom auth forms with validation
- **Dashboard** (`/dashboard`): Protected page showing user info after login
- **API routes**
  - `/api/auth/[...nextauth]`: NextAuth.js authentication endpoints
  - `/api/health`: Secure server-side proxy for health check to backend API
  - `/api/chatkit/session`: ChatKit session token generation endpoint

### Key Configuration Files
- `components.json`: shadcn/ui configuration with path aliases (@/components, @/lib, etc.)
- `.env`: Contains Supabase URL and anon key, NextAuth URL and secret, API base URL
- `supabase-schema.sql`: Database schema for users table (run in Supabase SQL Editor)
- `next.config.ts`: Next.js configuration (minimal by default)

### Database & Authentication Implementation
- Users table with UUID primary keys, encrypted passwords, and proper indexing
- Helper functions for user creation, authentication, and management in `src/lib/supabase.ts`:
  - `createUser()`: Creates new user with hashed password
  - `authenticateUser()`: Validates email/password combination
  - `getUserById()`: Retrieves user by ID
  - `updateUser()`: Updates user information
- Real-time password validation against hashed database values
- User session includes id, email, and name from database
- All auth pages include proper error handling, validation, and loading states
- Sign-up creates actual database records with proper password hashing

### Environment Variables Required
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `NEXTAUTH_URL`: Base URL for NextAuth (e.g., `http://localhost:3000`)
- `NEXTAUTH_SECRET`: Secret for signing JWT tokens (generate with `openssl rand -base64 32`)
- `API_BASE_URL`: Backend API base URL (optional, defaults to `http://localhost:3033/api`)
- `OPENAI_API_KEY`: OpenAI API key for ChatKit (server-side only, no NEXT_PUBLIC prefix)
- `NEXT_PUBLIC_CHATKIT_WORKFLOW_ID`: OpenAI ChatKit workflow ID from Agent Builder
- `CHATKIT_API_BASE`: Optional custom ChatKit API base URL (defaults to `https://api.openai.com`)

### Supabase Setup Required
1. Create a Supabase project at https://supabase.com
2. Run the SQL schema from `supabase-schema.sql` in your Supabase SQL Editor
3. Copy Supabase URL and anon key to `.env` file
4. Ensure RLS is disabled on the users table (or configure appropriate policies)

### UI Components
- Uses shadcn/ui component system with Tailwind CSS v4
- Responsive design with dark mode support
- Glass morphism effects on navigation with backdrop-blur
- Mobile-responsive navigation menu
- Path aliases configured: `@/components`, `@/lib`, `@/hooks`, `@/ui`