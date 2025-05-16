import { createClient } from "@supabase/supabase-js";

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error("Supabase URL must be provided");
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Supabase Service Role Key must be provided");
}
const serverSideSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);
const serverAuth = serverSideSupabase.auth.admin;
export default serverAuth;