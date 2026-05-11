"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Code, Copy, CheckCircle, ShieldAlert } from 'lucide-react';
import DashboardLayout from '../../../components/DashboardLayout';
import { useCompany } from '../../../contexts/CompanyContext';

export default function TransponderPage() {
  const { activeCompany } = useCompany();
  const [copied, setCopied] = useState(false);

  const snippet = activeCompany ? `<script src="https://api.indexpulse.com.br/api/v1/transponder/${activeCompany.id}.js"></script>` : '';

  const handleCopy = () => {
    navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center shadow-[0_0_15px_rgba(255,42,42,0.4)]">
            <Code className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Instalação do Transponder</h1>
            <p className="text-sm text-zinc-400">Implementação da Armadilha Semântica JSON-LD</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-6 mb-6"
          >
            <h2 className="text-lg font-bold mb-4">Seu Snippet de Código</h2>
            <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
              Copie o código abaixo e cole no <strong>&lt;head&gt;</strong> de todas as páginas do seu site (WordPress, Shopify, Vercel, etc). 
              Este script injeta de forma invisível as entidades de autoridade que o Motor Neural gera, garantindo que IAs como Perplexity e ChatGPT assimilem a sua marca.
            </p>

            <div className="relative bg-black rounded-lg border border-zinc-800 p-4 font-mono text-sm">
              <button 
                onClick={handleCopy}
                className="absolute top-3 right-3 p-2 bg-zinc-800 hover:bg-zinc-700 rounded-md transition-colors text-zinc-300 flex items-center gap-2"
                title="Copiar Código"
              >
                {copied ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span className="text-xs">{copied ? 'Copiado!' : 'Copiar'}</span>
              </button>
              <pre className="text-emerald-400 overflow-x-auto whitespace-pre-wrap pr-20">
                {snippet || 'Carregando ID da empresa...'}
              </pre>
            </div>
            
            <div className="mt-6 flex items-start gap-3 p-4 bg-red-900/10 border border-red-500/20 rounded-lg">
              <ShieldAlert className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div className="text-sm text-zinc-300">
                <strong className="text-red-400 block mb-1">Atenção Crítica:</strong>
                <p>O Transponder é carregado via CDN da IndexPulse. Nunca altere o ID dentro da tag de script, caso contrário suas pílulas de autoridade não serão indexadas pelas inteligências artificiais.</p>
              </div>
            </div>
          </motion.div>
        </div>

        <div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-panel p-6 h-full flex flex-col"
          >
            <h3 className="text-lg font-bold mb-4">Status de Verificação</h3>
            
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-zinc-800 rounded-xl">
              <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center mb-4">
                <Code className="w-8 h-8 text-zinc-600" />
              </div>
              <h4 className="font-bold text-zinc-300 mb-2">Aguardando Instalação</h4>
              <p className="text-xs text-zinc-500">
                Após colar o script no seu site, recarregue a sua página principal. Nosso motor neural detectará o primeiro pulso automaticamente.
              </p>
              
              <button disabled className="mt-6 w-full py-2 bg-zinc-800 text-zinc-500 text-xs font-bold rounded-lg uppercase tracking-wider cursor-not-allowed">
                Sinal não detectado
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
