
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useSupabaseConnection = () => {
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  
  useEffect(() => {
    const checkSupabaseConnection = async () => {
      try {
        const { data, error } = await supabase.from('profiles').select('count').limit(1);
        
        if (error) {
          console.error("Erro ao verificar conexão com Supabase:", error);
          setDebugInfo(`Erro Supabase: ${error.message} (Código ${error.code})`);
        } else {
          console.log("Conexão com Supabase OK:", data);
          setDebugInfo(null);
        }
      } catch (error) {
        console.error("Exceção ao verificar Supabase:", error);
        setDebugInfo(`Exceção Supabase: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      }
    };
    
    checkSupabaseConnection();
  }, []);

  return { debugInfo };
};
