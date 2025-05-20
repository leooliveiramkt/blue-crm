import { WBuyRealtimeSync } from '../services/wbuy/wbuyRealtimeSync';
import { logger } from '../utils/logger';

async function main() {
  try {
    const syncService = WBuyRealtimeSync.getInstance();
    
    // Iniciar sincronização para todos os tenants
    const tenants = await getActiveTenants();
    
    for (const tenant of tenants) {
      await syncService.startRealtimeSync(tenant.id);
      logger.info(`Sincronização iniciada para o tenant ${tenant.id}`);
    }

    // Manter o processo rodando
    process.on('SIGTERM', async () => {
      logger.info('Encerrando sincronização...');
      await syncService.stopRealtimeSync();
      process.exit(0);
    });

  } catch (error) {
    logger.error('Erro ao iniciar sincronização:', error);
    process.exit(1);
  }
}

async function getActiveTenants() {
  // Implementar lógica para buscar tenants ativos
  return [
    { id: 'tenant1' },
    { id: 'tenant2' }
  ];
}

main(); 