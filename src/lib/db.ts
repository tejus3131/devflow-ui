import { createClient } from "@supabase/supabase-js";

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error("Supabase URL must be provided");
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error("Supabase Anon Key must be provided");
}

const publicClientSideSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default {
  clientAuth: publicClientSideSupabase.auth,
  clientTable: publicClientSideSupabase,
  clientStorage: publicClientSideSupabase.storage,
};
