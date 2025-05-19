
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

// Usando as variáveis da configuração da integração do Supabase
// que já existiam no projeto, conforme visto em src/integrations/supabase/client.ts
const SUPABASE_URL = "https://zkjpzwrcuauieaaktzbk.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpranB6d3JjdWF1aWVhYWt0emJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4OTM0MjQsImV4cCI6MjA1OTQ2OTQyNH0.daIZCGCuaQtH8mewhYRLCFnqOGUYb_ADC7_sfpXGl_M";

// Criando um cliente Supabase com as configurações adequadas para autenticação
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Função auxiliar para verificar se o Supabase está conectado
export const checkSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('profiles').select('count').limit(1).single();
    if (error) {
      console.error("Erro ao verificar conexão com Supabase:", error);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Exceção ao verificar conexão com Supabase:", error);
    return false;
  }
};
