import axios from 'axios';
import fs from 'fs';

const API_URL = process.env.WBUY_API_URL || 'https://sistema.sistemawbuy.com.br/api/v1';
const API_USER = process.env.WBUY_API_USER || 'f9d1cd0e-2826-4b79-897b-a2169ccf7f9e';
const API_PASSWORD = process.env.WBUY_API_PASSWORD || 'b7d57b98fe134c9f98b56c6f87b4c507';
const STORE_ID = process.env.WBUY_STORE_ID || '384388'; // Código da loja Bela Blue

const endpoints = [
  { name: 'afiliados', path: '/partnerstore/' },
  { name: 'pedidos', path: '/order/' },
  { name: 'produtos', path: '/product/' },
  { name: 'categorias', path: '/category/' },
  { name: 'clientes', path: '/customer/' }
];

async function fetchAndSave(endpoint) {
  const auth = Buffer.from(`${API_USER}:${API_PASSWORD}`).toString('base64');
  const headers = {
    'Authorization': `Basic ${auth}`,
    'X-Store-ID': STORE_ID,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };

  console.log(`\nTestando endpoint: ${endpoint.path}`);
  console.log('Headers:', JSON.stringify(headers, null, 2));

  try {
    const response = await axios.get(`${API_URL}${endpoint.path}`, { 
      headers, 
      params: { limit: 5 } 
    });
    
    fs.writeFileSync(`wbuy-cache-${endpoint.name}.json`, JSON.stringify(response.data, null, 2));
    console.log(`✅ Dados de ${endpoint.name} salvos.`);
    return response.data;
  } catch (error) {
    const errorData = {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers
    };
    
    fs.writeFileSync(`wbuy-cache-${endpoint.name}-error.json`, JSON.stringify(errorData, null, 2));
    console.error(`❌ Erro ao buscar ${endpoint.name}:`, errorData);
    return null;
  }
}

async function main() {
  console.log('🚀 Iniciando teste de conexão com WBuy API...');
  console.log('URL Base:', API_URL);
  console.log('Store ID:', STORE_ID);
  
  for (const endpoint of endpoints) {
    await fetchAndSave(endpoint);
  }
  console.log('\n🚀 Todos os endpoints testados e cacheados.');
}

main(); 