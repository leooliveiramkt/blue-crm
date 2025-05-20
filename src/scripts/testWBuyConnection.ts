import 'dotenv/config';
import { WBuyService } from '../services/wbuy/wbuyService';
import { logger } from '../utils/logger';

async function testWBuyConnection() {
  try {
    logger.info('Iniciando teste de conexão com WBuy API...');
    console.log('Iniciando teste de conexão com WBuy API...');
    
    const wbuyService = WBuyService.getInstance();
    const isConnected = await wbuyService.testConnection();
    
    if (isConnected) {
      logger.info('✅ Conexão com WBuy API estabelecida com sucesso!');
      console.log('✅ Conexão com WBuy API estabelecida com sucesso!');
    } else {
      logger.error('❌ Falha ao conectar com WBuy API');
      console.log('❌ Falha ao conectar com WBuy API');
    }
  } catch (error) {
    logger.error('Erro durante o teste de conexão:', error);
    console.error('Erro durante o teste de conexão:', error);
  }
}

// Executar o teste
testWBuyConnection(); 