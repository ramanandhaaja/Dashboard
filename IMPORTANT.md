# IMPORTANT: Pending Configuration

## Password Reset - Supabase Redirect URLs

The password reset feature is implemented but requires manual Supabase configuration to work.

### What to do:

1. Go to: https://supabase.com/dashboard/project/mtgxynjjlvlumfztrppa/auth/url-configuration

2. Set **Site URL**:
   - Development: `http://localhost:3000`
   - Production: Your production domain

3. Add to **Redirect URLs**:
   ```
   http://localhost:3000/auth/reset-password
   https://your-production-domain.com/auth/reset-password
   ```

4. Click **Save**

### Why this is needed:

Without this configuration, the password reset email link will fail with a redirect error. Supabase only allows redirects to whitelisted URLs for security.

### Files involved:
- `/src/app/auth/forgot-password/page.tsx` - Request reset email
- `/src/app/auth/reset-password/page.tsx` - Handle reset callback
- `/src/lib/supabase.ts` - `resetPassword()` and `updatePassword()` functions
