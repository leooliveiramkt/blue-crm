
import { createClient } from '@supabase/supabase-js';
import { toast } from '@/hooks/use-toast';

// Variáveis para conexão com o Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Flag para verificar se o Supabase está corretamente configurado
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

// Usar valores mock para desenvolvimento quando as credenciais não estiverem disponíveis
// Isso evita que a aplicação quebre completamente, mas as funcionalidades do Supabase não funcionarão
const fallbackUrl = 'https://example.supabase.co';
const fallbackKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZha2VrZXkiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzMDM0NjI2MCwiZXhwIjoxOTQ1OTIyMjYwfQ.fake-key-for-development';

// Cria o cliente Supabase com fallback para valores mock
export const supabaseClient = createClient(
  supabaseUrl || fallbackUrl,
  supabaseAnonKey || fallbackKey
);

// Modifica o comportamento dos métodos do Supabase quando não configurado
if (!isSupabaseConfigured) {
  // Sobrescreve as funções que usam o Supabase para mostrar um aviso ao invés de quebrar a aplicação
  const wrapSupabaseMethods = (client: any) => {
    const originalFrom = client.from.bind(client);
    
    // Wrapper para operações de banco de dados
    client.from = (table: string) => {
      console.warn(`⚠️ Tentativa de acessar a tabela "${table}" com o Supabase não configurado.`);
      
      // Retorna um objeto mock que não faz nada mas não quebra a aplicação
      return {
        select: () => ({ data: null, error: { message: 'Supabase não configurado' }, count: null }),
        insert: () => ({ data: null, error: { message: 'Supabase não configurado' } }),
        update: () => ({ data: null, error: { message: 'Supabase não configurado' } }),
        delete: () => ({ data: null, error: { message: 'Supabase não configurado' } }),
        upsert: () => ({ data: null, error: { message: 'Supabase não configurado' } }),
        on: () => ({ subscribe: () => ({ unsubscribe: () => {} }) }),
        limit: () => client.from(table),
        single: () => ({ data: null, error: { message: 'Supabase não configurado' } }),
        order: () => client.from(table),
      };
    };
    
    // Criaos um proxy para o método storage.from
    const mockStorageFrom = (bucket: string) => {
      console.warn(`⚠️ Tentativa de acessar o bucket "${bucket}" com o Supabase não configurado.`);
      
      return {
        upload: () => ({ data: null, error: { message: 'Supabase não configurado' } }),
        download: () => ({ data: null, error: { message: 'Supabase não configurado' } }),
        getPublicUrl: () => ({ data: { publicUrl: '' } }),
        list: () => ({ data: null, error: { message: 'Supabase não configurado' } }),
        remove: () => ({ data: null, error: { message: 'Supabase não configurado' } }),
      };
    };
    
    // Verifica se storage existe antes de modificar
    if (client.storage) {
      // Não podemos sobrescrever storage diretamente, mas podemos sobrescrever o método 'from'
      if (typeof client.storage === 'object') {
        client.storage.from = mockStorageFrom;
      }
    }
  };
  
  wrapSupabaseMethods(supabaseClient);
}

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
