import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ============================================================================
// Types
// ============================================================================

export interface User {
  id: string
  email: string
  name: string
  created_at: string
  updated_at: string
}

export interface CreateUserData {
  email: string
  password: string
  name: string
}

export interface AuthUser {
  id: string
  email: string
  name: string
}

export interface UserProfile {
  id: string
  email: string
  name: string
  role?: string
  company_id?: string
}

// ============================================================================
// Supabase Auth Functions (NEW - Primary Authentication)
// ============================================================================

/**
 * Sign in with Supabase Auth
 */
export async function signInWithSupabase(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

/**
 * Sign up with Supabase Auth
 * Creates user in auth.users, trigger syncs to public.users
 */
export async function signUpWithSupabase(email: string, password: string, name: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } }
  })
  if (error) throw error

  // Update name in public.users (trigger creates the record)
  if (data.user) {
    await supabase.from('users').update({ name }).eq('id', data.user.id)
  }
  return data
}

/**
 * Sign out from Supabase Auth
 */
export async function signOutSupabase() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

/**
 * Request password reset email
 */
export async function resetPassword(email: string, redirectUrl: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: redirectUrl })
  if (error) throw error
}

/**
 * Update password (when on reset-password page with valid session)
 */
export async function updatePassword(newPassword: string) {
  const { error } = await supabase.auth.updateUser({ password: newPassword })
  if (error) throw error
}

/**
 * Get user profile from public.users by ID
 */
export async function getProfileById(id: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('users')
    .select('id, email, name, role, company_id')
    .eq('id', id)
    .single()
  if (error) return null
  return data
}

/**
 * Get current Supabase Auth session
 */
export async function getSupabaseSession() {
  const { data: { session }, error } = await supabase.auth.getSession()
  if (error) throw error
  return session
}

/**
 * Listen for auth state changes
 */
export function onAuthStateChange(callback: (event: string, session: unknown) => void) {
  return supabase.auth.onAuthStateChange(callback)
}

// ============================================================================
// Legacy Functions (Kept for Fallback/Migration)
// ============================================================================

/**
 * @deprecated Use signInWithSupabase instead
 * Hash password using bcrypt
 */
export async function hashPassword_legacy(password: string): Promise<string> {
  const saltRounds = 12
  return bcrypt.hash(password, saltRounds)
}

/**
 * @deprecated Use signInWithSupabase instead
 * Verify password against bcrypt hash
 */
export async function verifyPassword_legacy(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

/**
 * @deprecated Use signUpWithSupabase instead
 * Create a new user directly in public.users table
 */
export async function createUser_legacy(userData: CreateUserData): Promise<AuthUser | null> {
  try {
    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('email')
      .eq('email', userData.email)
      .single()

    if (existingUser) {
      throw new Error('User already exists')
    }

    // Hash the password
    const hashedPassword = await hashPassword_legacy(userData.password)

    // Insert new user
    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          email: userData.email,
          password_hash: hashedPassword,
          name: userData.name,
        }
      ])
      .select('id, email, name')
      .single()

    if (error) {
      console.error('Error creating user:', error)
      return null
    }

    return data as AuthUser
  } catch (error) {
    console.error('Error in createUser:', error)
    return null
  }
}

/**
 * @deprecated Use signInWithSupabase instead
 * Find user by email and verify password against bcrypt hash
 */
export async function authenticateUser_legacy(email: string, password: string): Promise<AuthUser | null> {
  try {
    // Get user with password hash
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, name, password_hash')
      .eq('email', email)
      .single()

    if (error || !user) {
      console.error('User not found:', error)
      return null
    }

    // Verify password
    const isValidPassword = await verifyPassword_legacy(password, user.password_hash)

    if (!isValidPassword) {
      return null
    }

    // Return user data without password hash
    return {
      id: user.id,
      email: user.email,
      name: user.name,
    }
  } catch (error) {
    console.error('Error in authenticateUser:', error)
    return null
  }
}

// ============================================================================
// Profile Management Functions
// ============================================================================

/**
 * Find user by ID
 */
export async function getUserById(id: string): Promise<AuthUser | null> {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, name')
      .eq('id', id)
      .single()

    if (error || !user) {
      return null
    }

    return user as AuthUser
  } catch (error) {
    console.error('Error in getUserById:', error)
    return null
  }
}

/**
 * Update user profile
 */
export async function updateUser(id: string, updates: Partial<Pick<User, 'name' | 'email'>>): Promise<AuthUser | null> {
  try {
    const { data, error } = await supabase
      .from('users')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('id, email, name')
      .single()

    if (error) {
      console.error('Error updating user:', error)
      return null
    }

    return data as AuthUser
  } catch (error) {
    console.error('Error in updateUser:', error)
    return null
  }
}
