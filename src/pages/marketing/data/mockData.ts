
// Dados de exemplo para as plataformas de anúncios
export const adPlatformData = [
  { name: 'Jan', facebook: 12500, google: 9800, tiktok: 7200, taboola: 4200, outbrain: 3100 },
  { name: 'Fev', facebook: 11800, google: 10500, tiktok: 8100, taboola: 3800, outbrain: 2900 },
  { name: 'Mar', facebook: 14200, google: 11200, tiktok: 9300, taboola: 4500, outbrain: 3400 },
  { name: 'Abr', facebook: 13500, google: 12100, tiktok: 10200, taboola: 5100, outbrain: 3700 },
  { name: 'Mai', facebook: 15800, google: 13400, tiktok: 11500, taboola: 5400, outbrain: 4200 },
  { name: 'Jun', facebook: 18200, google: 14900, tiktok: 13200, taboola: 6300, outbrain: 4800 },
];

// Dados de ROI por plataforma
export const roiData = [
  { name: 'Jan', facebook: 2.4, google: 3.1, tiktok: 1.8, taboola: 1.5, outbrain: 1.3 },
  { name: 'Fev', facebook: 2.6, google: 3.3, tiktok: 2.0, taboola: 1.4, outbrain: 1.2 },
  { name: 'Mar', facebook: 2.8, google: 3.5, tiktok: 2.2, taboola: 1.6, outbrain: 1.4 },
  { name: 'Abr', facebook: 3.0, google: 3.7, tiktok: 2.4, taboola: 1.8, outbrain: 1.7 },
  { name: 'Mai', facebook: 3.2, google: 3.9, tiktok: 2.7, taboola: 2.0, outbrain: 1.9 },
  { name: 'Jun', facebook: 3.5, google: 4.2, tiktok: 2.9, taboola: 2.3, outbrain: 2.1 },
];

// Dados de distribuição de investimento
export const investmentData = [
  { name: 'Facebook', value: 35, color: '#4267B2' },
  { name: 'Google', value: 30, color: '#34A853' },
  { name: 'TikTok', value: 20, color: '#000000' },
  { name: 'Taboola', value: 10, color: '#004D9C' },
  { name: 'Outbrain', value: 5, color: '#F18E1C' },
];

// Dados de campanhas mais efetivas
export const campaignData = [
  { id: 1, name: 'Black Friday', platform: 'Facebook', revenue: 85600, investment: 15000, roi: 5.7 },
  { id: 2, name: 'Lançamento Premium', platform: 'Google', revenue: 76400, investment: 14200, roi: 5.4 },
  { id: 3, name: 'Promoção Verão', platform: 'Facebook', revenue: 62300, investment: 12500, roi: 5.0 },
  { id: 4, name: 'Liquidação Inverno', platform: 'TikTok', revenue: 58700, investment: 12000, roi: 4.9 },
  { id: 5, name: 'Campanha Dia das Mães', platform: 'Google', revenue: 51200, investment: 10800, roi: 4.7 },
  { id: 6, name: 'Retargeting Premium', platform: 'Facebook', revenue: 47500, investment: 10200, roi: 4.6 },
  { id: 7, name: 'Campanha Natal', platform: 'TikTok', revenue: 45300, investment: 9800, roi: 4.6 },
  { id: 8, name: 'Remarketing Geral', platform: 'Taboola', revenue: 42100, investment: 9500, roi: 4.4 },
  { id: 9, name: 'Segmento Jovem', platform: 'TikTok', revenue: 39800, investment: 9200, roi: 4.3 },
  { id: 10, name: 'Look-alike 3%', platform: 'Facebook', revenue: 36500, investment: 8500, roi: 4.3 },
];

// Dados dos influenciadores top 10
export const influencerData = [
  { id: 1, name: 'Ana Clara', platform: 'Instagram', revenue: 145000, followers: 2500000, engagement: 4.8 },
  { id: 2, name: 'Paulo Vieira', platform: 'TikTok', revenue: 128000, followers: 1800000, engagement: 5.2 },
  { id: 3, name: 'Mariana Costa', platform: 'YouTube', revenue: 112000, followers: 1200000, engagement: 4.5 },
  { id: 4, name: 'Rodrigo Lima', platform: 'Instagram', revenue: 98000, followers: 950000, engagement: 4.9 },
  { id: 5, name: 'Carla Mendes', platform: 'TikTok', revenue: 87000, followers: 820000, engagement: 6.1 },
  { id: 6, name: 'Fernando Santos', platform: 'YouTube', revenue: 76000, followers: 780000, engagement: 3.8 },
  { id: 7, name: 'Júlia Pereira', platform: 'Instagram', revenue: 65000, followers: 720000, engagement: 5.3 },
  { id: 8, name: 'Marcos Oliveira', platform: 'TikTok', revenue: 54000, followers: 650000, engagement: 4.7 },
  { id: 9, name: 'Luiza Castro', platform: 'YouTube', revenue: 48000, followers: 580000, engagement: 4.2 },
  { id: 10, name: 'Gabriel Martins', platform: 'Instagram', revenue: 42000, followers: 520000, engagement: 4.6 },
];

// Dados de faturamento mensal
export const revenueData = [
  { name: 'Jan', revenue: 352000, investment: 41000 },
  { name: 'Fev', revenue: 384000, investment: 43500 },
  { name: 'Mar', revenue: 421000, investment: 46000 },
  { name: 'Abr', revenue: 465000, investment: 48200 },
  { name: 'Mai', revenue: 498000, investment: 51500 },
  { name: 'Jun', revenue: 532000, investment: 55800 },
  { name: 'Jul', revenue: 578000, investment: 58500 },
  { name: 'Ago', revenue: 612000, investment: 62000 },
  { name: 'Set', revenue: 645000, investment: 65300 },
  { name: 'Out', revenue: 689000, investment: 69500 },
  { name: 'Nov', revenue: 784000, investment: 75800 },
  { name: 'Dez', revenue: 852000, investment: 82000 },
];

// Dados trimestrais
export const quarterlyData = [
  { name: 'Q1', revenue: 1157000, investment: 130500 },
  { name: 'Q2', revenue: 1495000, investment: 155500 },
  { name: 'Q3', revenue: 1835000, investment: 185800 },
  { name: 'Q4', revenue: 2325000, investment: 227300 },
];

// Dados semestrais
export const biannualData = [
  { name: '1° Semestre', revenue: 2652000, investment: 286000 },
  { name: '2° Semestre', revenue: 4160000, investment: 413100 },
];

// Dados anuais
export const annualData = [
  { name: '2025', revenue: 6812000, investment: 699100 },
];
