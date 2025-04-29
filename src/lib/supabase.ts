
import { createClient } from '@supabase/supabase-js';
import { toast } from '@/hooks/use-toast';
import { supabase as supabaseClient } from '@/integrations/supabase/client';

// Flag para verificar se o Supabase está corretamente configurado
const supabaseUrl = "https://zkjpzwrcuauieaaktzbk.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpranB6d3JjdWF1aWVhYWt0emJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4OTM0MjQsImV4cCI6MjA1OTQ2OTQyNH0.daIZCGCuaQtH8mewhYRLCFnqOGUYb_ADC7_sfpXGl_M";
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

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
export { supabaseClient };

// Função utilitária para verificar a conexão com Supabase
export const testSupabaseConnection = async (): Promise<boolean> => {
  if (!isSupabaseConfigured) return false;
  
  try {
    // Tenta fazer uma operação simples para testar a conexão
    // Usamos a tabela 'profiles' que sabemos que existe no schema 'public'
    const { error } = await supabaseClient.from('profiles').select('count', { count: 'exact', head: true });
    return !error;
  } catch {
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
