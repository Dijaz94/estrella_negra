import { createClient } from '@supabase/supabase-js'

const runtimeConfig = useRuntimeConfig()

export const supabaseAdmin = createClient(
  runtimeConfig.public.supabaseUrl,
  runtimeConfig.supabaseServiceKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
)
