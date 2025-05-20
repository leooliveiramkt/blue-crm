import express, { Request, Response } from 'express';
import { supabase } from '../lib/supabase';
import { logger } from '../utils/logger';
import { Database } from '../types/supabase';
import { PostgrestFilterBuilder } from '@supabase/postgrest-js';

const router = express.Router();

// Endpoint para salvar/atualizar credenciais da API WBuy
router.post('/wbuy/credentials', async (req: Request, res: Response) => {
  const { empresa, owner_email, api_url, authorization, store_id, api_user, api_password } = req.body;

  if (!empresa || !owner_email || !api_url || !authorization || !store_id || !api_user || !api_password) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }

  try {
    const { data, error } = await supabase
      .from('wbuy_integrations')
      .upsert({
        empresa,
        owner_email,
        api_url,
        authorization,
        store_id,
        api_user,
        api_password,
        updated_at: new Date().toISOString()
      }, { onConflict: 'owner_email' });

    if (error) {
      logger.error('Erro ao salvar credenciais:', error);
      return res.status(500).json({ error: 'Erro ao salvar credenciais' });
    }

    return res.status(200).json({ message: 'Credenciais salvas com sucesso', data });
  } catch (error) {
    logger.error('Erro ao processar requisição:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router; 