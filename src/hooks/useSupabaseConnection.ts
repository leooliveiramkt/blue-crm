
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export const useSupabaseConnection = () => {
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  
  useEffect(() => {
    const checkSupabaseConnection = async () => {
      try {
        // Verificar se estamos usando um usuário de demonstração
        const demoType = localStorage.getItem('demo_user_type');
        if (demoType) {
          console.log("[useSupabaseConnection] Usando usuário de demonstração:", demoType);
          setDebugInfo(null);
          return;
        }

        // Vamos tentar uma operação mais simples para verificar a conexão
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("[useSupabaseConnection] Erro ao verificar conexão com Supabase:", error);
          setDebugInfo(`Erro Supabase: ${error.message} (Código ${error.code})`);
        } else {
          console.log("[useSupabaseConnection] Conexão com Supabase OK:", data ? "Sessão encontrada" : "Sem sessão");
          setDebugInfo(null);
        }
      } catch (error) {
        console.error("[useSupabaseConnection] Exceção ao verificar Supabase:", error);
        setDebugInfo(`Exceção Supabase: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      }
    };
    
    checkSupabaseConnection();
  }, []);

  return { debugInfo };
};
