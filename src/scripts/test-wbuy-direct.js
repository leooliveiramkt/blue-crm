import axios from 'axios';
import dotenv from 'dotenv';

// Carrega as variáveis de ambiente
dotenv.config();

const API_URL = 'https://sistema.sistemawbuy.com.br/api/v1';
const API_USER = 'f9d1cd0e-2826-4b79-897b-a2169ccf7f9e';
const API_PASSWORD = 'b7d57b98fe134c9f98b56c6f87b4c507';
const STORE_ID = '151fdeb7edfb1cd4d7dc3ef125d94060';

async function testWBuyDirect() {
  console.log('🚀 Testando conexão direta com WBuy API...\n');

  try {
    // Configuração dos headers
    const headers = {
      'Authorization': `Basic ${Buffer.from(`${API_USER}:${API_PASSWORD}`).toString('base64')}`,
      'X-Store-ID': STORE_ID,
      'Content-Type': 'application/json'
    };

    console.log('Headers configurados:', JSON.stringify(headers, null, 2), '\n');

    // Teste de conexão
    console.log('1️⃣ Testando conexão com a API...');
    const response = await axios.get(`${API_URL}/products`, {
      headers,
      params: {
        limit: 1
      }
    });

    console.log('✅ Conexão estabelecida com sucesso!');
    console.log('Resposta da API:', JSON.stringify(response.data, null, 2));

  } catch (error) {
    console.error('❌ Erro ao conectar com a API:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers
    });
    process.exit(1);
  }
}

// Executa o teste
testWBuyDirect(); 