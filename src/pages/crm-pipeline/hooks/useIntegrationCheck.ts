
import { integrationManager } from '@/lib/integrations/integrationManager';

export const useIntegrationCheck = () => {
  // Verificar se alguma integração está disponível
  const checkIntegration = async (type: string) => {
    try {
      const integration = await integrationManager.getIntegration(type as any);
      return integration !== null;
    } catch (error) {
      console.error(`Erro ao verificar integração ${type}:`, error);
      return false;
    }
  };

  return { checkIntegration };
};
