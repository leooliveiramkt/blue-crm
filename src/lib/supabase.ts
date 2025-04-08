
import { createClient } from '@supabase/supabase-js';

// Variáveis para conexão com o Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Verificação das credenciais antes de criar o cliente
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(`
    🔴 Credenciais do Supabase não configuradas corretamente!
    
    Por favor, certifique-se de que as seguintes variáveis de ambiente estão definidas:
    - VITE_SUPABASE_URL
    - VITE_SUPABASE_ANON_KEY
    
    Você pode adicioná-las criando um arquivo .env.local na raiz do projeto.
  `);
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

// Flag para verificar se o Supabase está corretamente configurado
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

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
    
    // Ao invés de tentar definir storage, vamos adicionar um método storage.from mock
    // usando Object.defineProperty para lidar com o getter da propriedade storage
    const originalStorageFrom = client.storage?.from?.bind(client.storage);
    
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
