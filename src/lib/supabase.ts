
import { createClient } from '@supabase/supabase-js';
import { toast } from '@/hooks/use-toast';
import { supabase as supabaseFromClient } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

// Flag para verificar se o Supabase está corretamente configurado
const supabaseUrl = "https://zkjpzwrcuauieaaktzbk.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpranB6d3JjdWF1aWVhYWt0emJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4OTM0MjQsImV4cCI6MjA1OTQ2OTQyNH0.daIZCGCuaQtH8mewhYRLCFnqOGUYb_ADC7_sfpXGl_M";
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Log para diagnosticar configuração
console.log("Inicializando cliente Supabase em lib/supabase.ts");
console.log("Supabase configurado:", isSupabaseConfigured);

// Verificação das credenciais antes de criar o cliente
if (!isSupabaseConfigured) {
  console.warn(`
    ⚠️ Supabase não configurado corretamente!
    
    Para habilitar as funcionalidades completas do sistema, configure as seguintes variáveis de ambiente:
    - VITE_SUPABASE_URL
    - VITE_SUPABASE_ANON_KEY
    
    Você pode adicioná-las criando um arquivo .env.local na raiz do projeto.
    Por enquanto, o sistema funcionará com funcionalidades limitadas e salvará dados apenas no localStorage.
  `);
  
  // Notifica o usuário apenas uma vez na inicialização da aplicação
  if (typeof window !== 'undefined') {
    // Verifica se já notificou hoje
    const lastNotified = localStorage.getItem('supabase_warning_shown');
    const today = new Date().toDateString();
    
    if (lastNotified !== today) {
      // Atrasa a notificação para garantir que o sistema de toast esteja disponível
      setTimeout(() => {
        toast({
          title: "⚠️ Supabase não configurado",
          description: "O sistema está funcionando com funcionalidades limitadas. Configure o Supabase para acesso completo às funcionalidades.",
          variant: "warning",
          duration: 7000
        });
        localStorage.setItem('supabase_warning_shown', today);
      }, 2000);
    }
  }
}

// Exporta o cliente do arquivo client.ts para evitar duplicação de instâncias
export const supabaseClient = supabaseFromClient;

// Criamos um cliente tipado para uso em arquivos que precisam de tipos
export const supabase = createClient<Database>(
  supabaseUrl, 
  supabaseAnonKey, 
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      storage: localStorage
    }
  }
);

// Função utilitária para verificar a conexão com Supabase
export const testSupabaseConnection = async (): Promise<boolean> => {
  if (!isSupabaseConfigured) return false;
  
  try {
    console.log("Testando conexão com Supabase...");
    // Tenta fazer uma operação simples para testar a conexão
    const { error } = await supabase.auth.getSession();
    console.log("Teste de conexão:", error ? "Falhou" : "Sucesso");
    return !error;
  } catch (e) {
    console.error("Erro ao testar conexão:", e);
    return false;
  }
};

// Exporta uma função para detectar mudanças na configuração do Supabase
export const checkSupabaseConfig = () => {
  return {
    url: supabaseUrl || null,
    isConfigured: isSupabaseConfigured
  };
};
