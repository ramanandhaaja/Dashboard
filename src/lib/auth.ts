import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { signInWithSupabase, getProfileById } from "./supabase"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // Use Supabase Auth instead of direct query
          const { user } = await signInWithSupabase(credentials.email, credentials.password)
          if (!user) return null

          // Fetch profile data from public.users
          const profile = await getProfileById(user.id)

          return {
            id: user.id,
            email: user.email ?? '',
            name: profile?.name ?? '',
            role: profile?.role ?? 'individual',
            company_id: profile?.company_id ?? null,
          }
        } catch (error) {
          console.error("Authentication error:", error)
          return null
        }
      }
    })
  ],
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.role = user.role
        token.company_id = user.company_id
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name as string
        session.user.role = token.role as string
        session.user.company_id = token.company_id as string | null
      }
      return session
    },
  },
}
