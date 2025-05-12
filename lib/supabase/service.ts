import { createClient } from "@supabase/supabase-js";

// Note: supabaseAdmin uses the SERVICE_ROLE_KEY which you must only use in a secure server environment
// Never expose your SERVICE_ROLE_KEY in the browser

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl) {
  throw new Error("Missing env var: NEXT_PUBLIC_SUPABASE_URL");
}

if (!serviceRoleKey) {
  throw new Error("Missing env var: SUPABASE_SERVICE_ROLE_KEY");
}

export const createServiceRoleClient = () => {
  // Supabase API URL and Service Role Key are required
  // Client is singleton, supabase needs to be initialized before using it
  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      // Required to use service_role key
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });

  return supabaseAdmin;
};
