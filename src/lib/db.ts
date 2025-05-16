import { createClient } from "@supabase/supabase-js";

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error("Supabase URL must be provided");
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error("Supabase Anon Key must be provided");
}

const clientSideSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default {
  clientAuth: clientSideSupabase.auth,
  clientTable: clientSideSupabase,
  clientRealtime: clientSideSupabase,
  clientStorage: clientSideSupabase.storage,
};