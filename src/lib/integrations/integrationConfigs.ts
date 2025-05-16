
/**
 * Este arquivo foi refatorado para melhorar a manutenibilidade.
 * As configurações de integrações foram movidas para arquivos individuais na pasta configs.
 * Este arquivo agora serve apenas como um ponto de entrada para manter compatibilidade com o código existente.
 */

export { 
  integrationConfigs, 
  getIntegrationConfig, 
  getAllIntegrationConfigs 
} from './configs';
