import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'indexpulse_secret_key_2026';

import bcrypt from 'bcrypt';

export const register = async (req, res) => {
    try {
        const { nome, email, password, companyId } = req.body;
        
        if (!email || !password || !companyId || !nome) {
            return res.status(400).json({ error: 'Preencha todos os campos obrigatórios.' });
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'Email já cadastrado no Motor Neural.' });
        }

        const senhaHash = await bcrypt.hash(password, 10);
        
        const user = await prisma.user.create({
            data: { nome, email, senhaHash, companyId }
        });

        res.json({ success: true, message: 'Usuário (CEO) registrado com sucesso.' });
    } catch (error) {
        console.error('Erro no Registro:', error);
        res.status(500).json({ error: 'Erro interno ao criar credencial.' });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
        }

        const user = await prisma.user.findUnique({ where: { email } });

        // Validação Mestre (Fallback AIOX) - Manter apenas para recuperação de emergência
        if (!user && email === 'ceo@indexpulse.com.br' && password === 'aiox2026') {
            const token = jwt.sign({ id: 'admin_1', email }, JWT_SECRET, { expiresIn: '7d' });
            return res.json({ success: true, token, redirect: '/onboarding' });
        }

        if (!user) {
            return res.status(401).json({ error: 'Credenciais inválidas. O Motor Neural negou o acesso.' });
        }

        const isValid = await bcrypt.compare(password, user.senhaHash);
        if (!isValid) {
            return res.status(401).json({ error: 'Senha incorreta.' });
        }

        const token = jwt.sign({ id: user.id, email: user.email, companyId: user.companyId }, JWT_SECRET, { expiresIn: '7d' });
        return res.json({ success: true, token, redirect: '/cortex' });
        
    } catch (error) {
        console.error('Erro na Autenticação:', error);
        res.status(500).json({ error: 'Erro interno no Servidor Córtex.' });
    }
};

export const getCompanies = async (req, res) => {
    try {
        let companies = await prisma.company.findMany({
            select: { id: true, nome: true, url: true, autoPublishPills: true }
        });

        // Auto-seed for presentation if empty
        if (companies.length === 0) {
            console.log('Seeding initial companies...');
            await prisma.company.createMany({
                data: [
                    { nome: 'Bela Blue', url: 'belablue.io', nicho: 'Saúde' },
                    { nome: 'VotoCerto CRM', url: 'votocerto.com.br', nicho: 'Política' },
                    { nome: 'Léo Oliveira MKT', url: 'leomkt.com.br', nicho: 'Marketing' }
                ]
            });
            companies = await prisma.company.findMany({
                select: { id: true, nome: true, url: true, autoPublishPills: true }
            });
        }

        // Formatar para o frontend
        const formatted = companies.map(c => ({
            id: c.id,
            name: c.nome,
            domain: c.url,
            autoPublishPills: c.autoPublishPills || false,
            score: Math.floor(Math.random() * 30) + 60 // Mock score temporário até calcular via RadarReport
        }));

        res.json({ success: true, companies: formatted });
    } catch (error) {
        console.error('Erro ao buscar empresas:', error);
        res.status(500).json({ error: 'Falha ao acessar o banco de dados.' });
    }
};

export const saveGeoConnection = async (req, res) => {
    try {
        const { companyId, wpUrl, wpUser, wpAppPass } = req.body;

        if (!companyId) return res.status(400).json({ error: 'companyId obrigatório' });

        await prisma.company.update({
            where: { id: companyId },
            data: {
                wpUrl,
                wpUser,
                wpAppPass
            }
        });

        res.json({ success: true, message: 'Conexão GEO estabelecida com sucesso no Motor Neural.' });
    } catch (error) {
        console.error('Erro ao salvar GEO Connection:', error);
        res.status(500).json({ error: 'Erro ao configurar Automação GEO.' });
    }
};

export const toggleVip = async (req, res) => {
    try {
        const { companyId, autoPublishPills } = req.body;

        if (!companyId || typeof autoPublishPills !== 'boolean') {
            return res.status(400).json({ error: 'Parâmetros inválidos para o Toggle VIP' });
        }

        const company = await prisma.company.update({
            where: { id: companyId },
            data: { autoPublishPills }
        });

        res.json({ success: true, message: \`Toggle VIP \${autoPublishPills ? 'LIGADO' : 'DESLIGADO'} com sucesso.\`, autoPublishPills: company.autoPublishPills });
    } catch (error) {
        console.error('Erro ao alternar Toggle VIP:', error);
        res.status(500).json({ error: 'Erro interno ao alterar o Toggle VIP.' });
    }
};
