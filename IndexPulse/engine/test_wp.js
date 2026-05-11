import { pingWordPressSync } from './services/mcp.tools.js';

const wpUrl = 'https://leomkt.com.br';
const wpUser = 'Leo_oliveira.mkt_admin';
const wpAppPass = 'ObzJvDKgqn4rwlD0PzhFo20g';

const testPublish = async () => {
    console.log('--- TESTE DE INTEGRAÇÃO WORDPRESS AEO ---');
    console.log('Conectando em:', wpUrl);
    
    const titulo = '[IndexPulse Teste] A Evolução do AEO no Mercado High-Ticket';
    const conteudoHtml = `
    <h2>O que é AEO (Answer Engine Optimization)?</h2>
    <p>Este é um post de teste gerado pelo Motor Neural do <strong>IndexPulse SaaS</strong>.</p>
    <p>O objetivo deste teste é validar a comunicação direta com a REST API do WordPress usando Application Passwords, permitindo que a IA publique conteúdo de autoridade 100% no piloto automático.</p>
    <p>Status: <strong>Conexão Perfeita!</strong></p>
    `;

    try {
        const url = await pingWordPressSync(wpUrl, wpUser, wpAppPass, titulo, conteudoHtml);
        if (url) {
            console.log('✅ SUCESSO! Artigo publicado com sucesso.');
            console.log('Link Oficial:', url);
        } else {
            console.log('❌ FALHA ao publicar o artigo.');
        }
    } catch (e) {
        console.error('ERRO:', e);
    }
};

testPublish();
