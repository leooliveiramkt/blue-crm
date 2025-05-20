import axios from 'axios';

(async () => {
  const apiUrl = 'https://sistema.sistemawbuy.com.br/api/v1/products';
  const apiKey = 'ZjlkMWNkMGUtMjgyNi00Yjc5LTg5N2ItYTIxNjljY2Y3ZjllOmI3ZDU3Yjk4ZmUxMzRjOWY5OGI1NmM2Zjg3YjRjNTA3';
  const storeId = '151fdeb7edfb1cd4d7dc3ef125d94060';

  try {
    console.log('Testando conexão direta com a API WBuy...');
    const response = await axios.get(apiUrl, {
      headers: {
        'Authorization': apiKey,
        'X-Store-ID': storeId,
        'Content-Type': 'application/json'
      },
      params: { limit: 1 }
    });
    console.log('Resposta da API WBuy:', response.status, response.data);
  } catch (error) {
    console.error('Erro ao conectar com a API WBuy:', error);
  }
})(); 