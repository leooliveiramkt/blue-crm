"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, Cpu, Network, Server, Zap, Power, ShieldAlert, ShieldCheck } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { useCompany } from '../../contexts/CompanyContext';

export default function CortexPage() {
  const { activeCompany, updateActiveCompanyData } = useCompany();
  const [toggling, setToggling] = React.useState(false);

  const handleToggleVip = async () => {
    if (!activeCompany) return;
    setToggling(true);
    try {
      const newState = !activeCompany.autoPublishPills;
      const res = await fetch('/api/v1/auth/companies/toggle-vip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyId: activeCompany.id, autoPublishPills: newState })
      });
      const data = await res.json();
      if (data.success) {
        updateActiveCompanyData({ autoPublishPills: data.autoPublishPills });
      } else {
        alert('Erro ao alterar o Toggle VIP: ' + data.error);
      }
    } catch (err) {
      alert('Erro de rede ao alterar Toggle VIP.');
    } finally {
      setToggling(false);
    }
  };
  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center shadow-[0_0_15px_rgba(255,42,42,0.4)]">
            <BrainCircuit className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Córtex Neural</h1>
            <p className="text-sm text-zinc-400">Monitoramento do LLM Core (Index AI)</p>
          </div>
        </div>
        
        <div className="flex flex-col gap-2">
          <div className="glass-panel px-4 py-2 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm font-medium tracking-wide">Index AI Conectado</span>
          </div>
          
          <button 
            onClick={handleToggleVip}
            disabled={toggling}
            className={`flex items-center justify-between px-4 py-2 rounded-lg border transition-all disabled:opacity-50 ${activeCompany?.autoPublishPills ? 'bg-emerald-900/40 border-emerald-500/50 text-emerald-400' : 'bg-zinc-900/80 border-zinc-700 text-zinc-400'}`}
          >
            <div className="flex items-center gap-2">
              <Power className="w-4 h-4" />
              <span className="text-xs font-bold tracking-wider">MODO AUTOPILOTO</span>
            </div>
            <div className={`w-8 h-4 rounded-full ml-4 transition-colors relative ${activeCompany?.autoPublishPills ? 'bg-emerald-500' : 'bg-zinc-700'}`}>
              <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${activeCompany?.autoPublishPills ? 'right-0.5' : 'left-0.5'}`} />
            </div>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-6 flex flex-col justify-between relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 blur-[30px] rounded-full pointer-events-none" />
          <div className="flex items-center gap-3 mb-6 relative z-10">
            <Cpu className="w-5 h-5 text-zinc-400" />
            <h2 className="text-lg font-bold">Processamento Semântico</h2>
          </div>
          
          <div className="space-y-4 relative z-10">
            <div className="flex justify-between items-end">
              <span className="text-sm text-zinc-400">Uso de Tokens (24h)</span>
              <span className="text-xl font-bold">14.205</span>
            </div>
            <div className="w-full bg-zinc-900 rounded-full h-2">
              <div className="bg-red-600 h-2 rounded-full" style={{ width: '45%' }}></div>
            </div>
            
            <div className="flex justify-between items-end pt-2 border-t border-zinc-800">
              <span className="text-sm text-zinc-400">Latência de Inferência</span>
              <span className="text-emerald-400 font-mono">1.2s</span>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-panel p-6 flex flex-col relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-[30px] rounded-full pointer-events-none" />
          <div className="flex items-center gap-3 mb-6 relative z-10">
            <Network className="w-5 h-5 text-zinc-400" />
            <h2 className="text-lg font-bold">Nodes de Conhecimento</h2>
          </div>
          
          <div className="space-y-4 relative z-10 font-mono text-sm">
            <div className="flex items-center gap-3 p-3 bg-zinc-900/50 rounded-lg border border-zinc-800">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span className="text-zinc-300 flex-1">Crawler: Extração do site matriz</span>
              <span className="text-emerald-400">OK</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-zinc-900/50 rounded-lg border border-zinc-800">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span className="text-zinc-300 flex-1">Embeddings: Vetorização PGVector</span>
              <span className="text-emerald-400">OK</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-zinc-900/50 rounded-lg border border-zinc-800">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-zinc-300 flex-1">Geração de FAQ JSON-LD</span>
              <span className="text-yellow-400">Idle</span>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Raciocínio ao vivo */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-panel p-6"
      >
        <div className="flex items-center gap-3 mb-4 border-b border-zinc-800 pb-4">
          <Server className="w-5 h-5 text-zinc-400" />
          <h2 className="text-lg font-bold">Terminal do Córtex (Logs)</h2>
        </div>
        <div className="font-mono text-xs sm:text-sm text-zinc-400 h-48 overflow-y-auto space-y-2 p-2">
          <p><span className="text-emerald-500">[02:14:05]</span> Conectado via OpenRouter API (Index AI).</p>
          <p><span className="text-emerald-500">[02:14:10]</span> Carregando contexto base de Estratégia AEO.</p>
          <p><span className="text-emerald-500">[02:15:30]</span> Iniciando geração de Pílula de Autoridade ID #004.</p>
          <p><span className="text-blue-400">[02:15:32]</span> Analisando concorrência SEO para o termo "Branding High-Ticket".</p>
          <p><span className="text-emerald-500">[02:15:35]</span> Texto gerado. Confiança Semântica: 92%.</p>
          <p><span className="text-yellow-400">[02:15:36]</span> Aguardando aprovação humana para injeção via Transponder.</p>
          <p className="animate-pulse text-zinc-500">_</p>
        </div>
      </motion.div>

    </DashboardLayout>
  );
}
