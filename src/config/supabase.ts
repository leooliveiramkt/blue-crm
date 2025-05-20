import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';
import { logger } from '../utils/logger';

if (!process.env.SUPABASE_URL) {
  throw new Error('SUPABASE_URL is required');
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY is required');
}

const supabase = createClient<Database>(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    },
    db: {
      schema: 'public'
    }
  }
);

// Log Supabase connection status
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') {
    logger.info('Supabase client authenticated');
  } else if (event === 'SIGNED_OUT') {
    logger.warn('Supabase client signed out');
  }
});

export { supabase }; 