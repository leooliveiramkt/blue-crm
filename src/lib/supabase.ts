
import { createClient } from '@supabase/supabase-js';

// Variáveis para conexão com o Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Cria o cliente Supabase
export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// Verifica se as credenciais estão disponíveis
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Credenciais do Supabase não configuradas corretamente. Verifique as variáveis de ambiente.');
}
