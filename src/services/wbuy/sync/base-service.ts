
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

/**
 * Serviço base para sincronização de dados da Wbuy
 */
export class WbuySyncBaseService {
  /**
   * Inicia a sincronização de dados da Wbuy
   * @param fullSync Se true, busca todos os dados históricos
   * @param startDate Data inicial (opcional)
   * @param endDate Data final (opcional)
   */
  async startSync(fullSync: boolean = false, startDate?: string, endDate?: string): Promise<{ success: boolean, message: string, syncId?: string }> {
    try {
      // Construir a URL da função Edge
      let url = `https://zkjpzwrcuauieaaktzbk.supabase.co/functions/v1/wbuy-sync?fullSync=${fullSync}`;
      
      // Adicionar datas se fornecidas
      if (startDate) url += `&startDate=${encodeURIComponent(startDate)}`;
      if (endDate) url += `&endDate=${encodeURIComponent(endDate)}`;
      
      // Obter a chave anon do Supabase
      const { data: { session } } = await supabase.auth.getSession();
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      // Adicionar Authorization header se houver sessão
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      // Chamar a função Edge
      const response = await fetch(url, {
        method: 'POST',
        headers
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro na sincronização: ${response.status} - ${errorText}`);
      }

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Sincronização iniciada",
          description: `${result.summary}`,
          variant: "default"
        });
        
        return {
          success: true,
          message: result.summary,
          syncId: result.syncId
        };
      } else {
        throw new Error(result.error || 'Erro desconhecido durante a sincronização');
      }
    } catch (error) {
      console.error('Erro ao iniciar sincronização:', error);
      
      toast({
        title: "Erro na sincronização",
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: "destructive"
      });
      
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }
}
