import axios from 'axios';
import { WBuyService } from '../services/wbuy/wbuyService.js';
import dotenv from 'dotenv';

// Carrega as variáveis de ambiente
dotenv.config();

async function testWBuyConnection() {
  console.log('🚀 Iniciando teste de conexão com WBuy API...\n');

  try {
    // 1. Teste básico de conexão
    console.log('1️⃣ Testando conexão básica...');
    const wbuyService = WBuyService.getInstance();
    const isConnected = await wbuyService.testConnection();
    
    if (!isConnected) {
      throw new Error('❌ Falha na conexão básica com a API');
    }
    console.log('✅ Conexão básica estabelecida com sucesso!\n');

    // 2. Teste de autenticação
    console.log('2️⃣ Testando autenticação...');
    const headers = wbuyService.getHeaders();
    console.log('Headers configurados:', JSON.stringify(headers, null, 2), '\n');

    // 3. Teste de listagem de produtos
    console.log('3️⃣ Testando listagem de produtos...');
    const products = await wbuyService.getProducts({ limit: 1 });
    console.log('Produtos encontrados:', JSON.stringify(products, null, 2), '\n');

    // 4. Teste de estatísticas
    console.log('4️⃣ Testando obtenção de estatísticas...');
    const stats = await wbuyService.getStats();
    console.log('Estatísticas:', JSON.stringify(stats, null, 2), '\n');

    console.log('🎉 Todos os testes foram concluídos com sucesso!');
    console.log('✅ A API WBuy está funcionando corretamente!');

  } catch (error) {
    console.error('❌ Erro durante os testes:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers
    });
    process.exit(1);
  }
}

// Executa o teste
testWBuyConnection(); 