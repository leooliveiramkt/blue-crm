import cron from 'node-cron';
import { PrismaClient } from '@prisma/client';
import { generateSyntheticPR } from './llm.service.js';
import { publishToMedium, pingWordPressSync } from './mcp.tools.js';

const prisma = new PrismaClient();

/**
 * SERVIÇO DE CRON (Pulse Engine)
 * Roda de hora em hora (24/7) para as empresas com plano ativo.
 */
export const startPulseEngine = () => {
    // 0 * * * * = De hora em hora no minuto 0
    cron.schedule('0 * * * *', async () => {
        console.log('[PULSE ENGINE] Iniciando varredura contínua de publicações...');
        
        try {
            // Busca todos os clientes ativos (que pagaram o High-Ticket)
            const customers = await prisma.company.findMany({
                where: { isCustomer: true }
            });

            console.log(`[PULSE ENGINE] Encontrados ${customers.length} clientes ativos.`);

            for (const company of customers) {
                console.log(`[PULSE ENGINE] Analisando empresa: ${company.nome}`);
                
                // Em um cenário real, você poderia ter uma trava de 1 artigo por semana ou quinzenal.
                // Aqui vamos assumir 1 por semana. Checa se já teve artigo gerado nos últimos 7 dias.
                const lastPill = await prisma.pillulaAutoridade.findFirst({
                    where: { companyId: company.id },
                    orderBy: { createdAt: 'desc' }
                });

                let shouldGenerate = true;
                if (lastPill) {
                    const daysSinceLastPill = (new Date() - new Date(lastPill.createdAt)) / (1000 * 60 * 60 * 24);
                    if (daysSinceLastPill < 7) {
                        shouldGenerate = false;
                        console.log(`[PULSE ENGINE] A empresa ${company.nome} já recebeu uma pílula esta semana (Há ${Math.floor(daysSinceLastPill)} dias). Pulando...`);
                    }
                }

                if (shouldGenerate) {
                    console.log(`[PULSE ENGINE] Gerando Pílula Neural para: ${company.nome}...`);
                    
                    try {
                        const { titulo, conteudoHtml } = await generateSyntheticPR(
                            company.nome,
                            company.nicho,
                            company.termo || company.nicho,
                            company.brandGuidelines || ''
                        );

                        // Escolhe a plataforma padrão. Poderíamos rotacionar entre BLOG, LINKEDIN, MEDIUM.
                        const plataforma = company.wpUrl ? 'BLOG' : 'MEDIUM';

                        if (company.autoPublishPills) {
                            console.log(`[PULSE ENGINE] "Toggle VIP" LIGADO para ${company.nome}. Publicando direto no ${plataforma} sem aprovação.`);
                            
                            let publishedUrl = "";
                            if (plataforma === 'BLOG') {
                                publishedUrl = await pingWordPressSync(company.wpUrl, company.wpUser, company.wpAppPass, titulo, conteudoHtml);
                            } else {
                                publishedUrl = await publishToMedium(titulo, conteudoHtml, company.url);
                            }

                            // Registra o link caso sucesso
                            if (publishedUrl) {
                                await prisma.pR_Link.create({
                                    data: {
                                        companyId: company.id,
                                        titulo: titulo,
                                        url: publishedUrl,
                                        plataforma: plataforma
                                    }
                                });
                            }

                            await prisma.pillulaAutoridade.create({
                                data: {
                                    companyId: company.id,
                                    titulo: titulo,
                                    conteudoHtml: conteudoHtml,
                                    status: 'PUBLISHED',
                                    plataforma: plataforma,
                                    publicadoEm: new Date()
                                }
                            });
                            console.log(`[PULSE ENGINE] Sucesso Total! Pílula publicada para ${company.nome}.`);
                        } else {
                            console.log(`[PULSE ENGINE] "Toggle VIP" DESLIGADO para ${company.nome}. Deixando pendente para aprovação do CEO.`);
                            await prisma.pillulaAutoridade.create({
                                data: {
                                    companyId: company.id,
                                    titulo: titulo,
                                    conteudoHtml: conteudoHtml,
                                    status: 'PENDING_APPROVAL',
                                    plataforma: plataforma
                                }
                            });
                        }
                    } catch (generationError) {
                        console.error(`[PULSE ENGINE] Falha ao processar ${company.nome}:`, generationError);
                    }
                }
            }
            
            console.log('[PULSE ENGINE] Ciclo finalizado. Voltando a aguardar o próximo pulso.');
        } catch (error) {
            console.error('[PULSE ENGINE] Erro crítico no robô:', error);
        }
    });

    console.log('[SISTEMA] Pulse Engine (Cron) armado para rodar a cada hora.');
};
