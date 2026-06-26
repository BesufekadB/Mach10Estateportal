import { createClient } from "@supabase/supabase-js";

export const PROJECT_ASSETS_BUCKET = "project-assets";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
export const allowMockAuth = import.meta.env.DEV || import.meta.env.VITE_ENABLE_MOCK_AUTH === "true";

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;
