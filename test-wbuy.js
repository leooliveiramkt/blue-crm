import axios from 'axios';
import fs from 'fs';

const API_URL = process.env.WBUY_API_URL || 'https://sistema.sistemawbuy.com.br/api/v1';
const API_USER = process.env.WBUY_API_USER || '61691da4-7fc8-419e-a06d-b9e021d75efc';
const API_PASSWORD = process.env.WBUY_API_PASSWORD || 'eba83af0e5b1415182d267ef174cc2a9';
const API_TOKEN = process.env.WBUY_API_TOKEN || 'NjE2OTFkYTQtN2ZjOC00MTllLWEwNmQtYjllMDIxZDc1ZWZjOmViYTgzYWYwZTViMTQxNTE4MmQyNjdlZjE3NGNjMmE5';
const STORE_ID = process.env.WBUY_STORE_ID || '384388'; // Código da loja Bela Blue

const endpoints = [
  { name: 'afiliados', path: '/partnerstore/' },
  { name: 'pedidos', path: '/order/' },
  { name: 'produtos', path: '/product/' },
  { name: 'categorias', path: '/category/' },
  { name: 'clientes', path: '/customer/' }
];

async function fetchAndSave(endpoint) {
  // Usar Bearer Token diretamente
  const headers = {
    'Authorization': `Bearer ${API_TOKEN}`,
    'X-Store-ID': STORE_ID,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };

  console.log(`\nTestando endpoint: ${endpoint.path}`);
  console.log('Headers:', JSON.stringify(headers, null, 2));

  try {
    const response = await axios.get(`${API_URL}${endpoint.path}`, { 
      headers, 
      params: { limit: 10 } // Aumentar limite para mais dados
    });
    
    fs.writeFileSync(`wbuy-cache-${endpoint.name}.json`, JSON.stringify(response.data, null, 2));
    console.log(`✅ Dados de ${endpoint.name} salvos. Total: ${response.data.total || 'N/A'}`);
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
  console.log('API User:', API_USER);
  console.log('Token configurado:', API_TOKEN ? 'SIM' : 'NÃO');
  
  for (const endpoint of endpoints) {
    await fetchAndSave(endpoint);
  }
  console.log('\n🚀 Todos os endpoints testados e cacheados.');
}

main(); 