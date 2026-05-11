import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import scannerRoutes from './routes/scanner.routes.js';
import transponderRoutes from './routes/transponder.routes.js';
import contentRoutes from './routes/content.routes.js';
import authRoutes from './routes/auth.routes.js';
import adminRoutes from './routes/admin.routes.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.set('trust proxy', 1);

// Security & Middleware
app.use(helmet({
    contentSecurityPolicy: false, // Desativado temporariamente para não bloquear scripts inline e Cal.com no frontend
}));
app.use(cors({
    origin: '*', // Na produção, restringiremos para 'https://leomkt.com.br'
    methods: ['GET', 'POST', 'OPTIONS']
}));
app.use(express.json());

// Servir os arquivos estáticos do Frontend (Landing Pages)
app.use('/radar', express.static(path.join(__dirname, '../radar')));

// Servir a Home Page Corporativa
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

// Servir a Logo
app.get('/indexpulse_logo_concept.png', (req, res) => {
    res.sendFile(path.join(__dirname, '../indexpulse_logo_concept.png'));
});

// Servir o Ícone Minimalista
app.get('/indexpulse_icon_only.png', (req, res) => {
    res.sendFile(path.join(__dirname, '../indexpulse_icon_only.png'));
});

// Rota de Health Check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'IndexPulse Engine is operational.', version: '1.0' });
});

// Rate Limiting para o Radar (Máximo 3 consultas por IP a cada 24 horas)
const radarLimiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000, // 24 horas
    max: 3,
    message: { error: 'Limite de consultas excedido. Seu IP já utilizou a cota gratuita do Radar AEO.' },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
        const targetUrl = req.body?.url || '';
        return targetUrl.includes('indexpulse.com.br');
    }
});

// Registrar Módulos do SaaS
app.use('/api/v1/scanner', radarLimiter, scannerRoutes);
app.use('/api/v1/transponder', transponderRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/content', contentRoutes);
app.use('/api/v1/auth', authRoutes);

// Tratamento de Erros Global
app.use((err, req, res, next) => {
    console.error('[SYS.ERROR]', err.message);
    res.status(500).json({ error: 'Falha Crítica no Motor Neural.', details: err.message });
});

// Iniciar Job Contínuo (Pulse Engine)
import { startPulseEngine } from './services/cron.service.js';
startPulseEngine();

app.listen(PORT, () => {
    console.log(`[INDEXPULSE ENGINE] Servidor tático online na porta ${PORT}`);
    console.log(`[SYS] .env loaded successfully.`);
});
