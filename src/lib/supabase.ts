import { createClient } from "@supabase/supabase-js";

export const PROJECT_ASSETS_BUCKET = "project-assets";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const configuredSiteUrl = import.meta.env.VITE_SITE_URL;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
export const allowMockAuth = import.meta.env.DEV;
export const siteUrl =
  typeof configuredSiteUrl === "string" && configuredSiteUrl.trim().length > 0
    ? configuredSiteUrl.trim().replace(/\/+$/, "")
    : typeof window !== "undefined"
      ? window.location.origin
      : "";

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;
