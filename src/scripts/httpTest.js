import axios from 'axios';

(async () => {
  try {
    console.log('Testando requisição HTTP para jsonplaceholder...');
    const response = await axios.get('https://jsonplaceholder.typicode.com/todos/1');
    console.log('Resposta:', response.status, response.data);
  } catch (error) {
    console.error('Erro na requisição HTTP:', error);
  }
})(); 