import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create Supabase Client
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Auto-clean stale/invalid refresh tokens from localStorage to prevent 400 Bad Request console errors
if (typeof window !== 'undefined') {
  supabase.auth
    .getSession()
    .then(({ error }) => {
      if (error && (error.message?.includes('Refresh Token') || error.status === 400)) {
        console.warn('[Supabase Auth] Purging invalid refresh token from local storage');
        supabase.auth.signOut({ scope: 'local' }).catch(() => {});
      }
    })
    .catch(() => {
      supabase.auth.signOut({ scope: 'local' }).catch(() => {});
    });
}

export default supabase;