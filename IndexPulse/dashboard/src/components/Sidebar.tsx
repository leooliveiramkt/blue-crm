"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, BrainCircuit, Globe2, LogOut, Settings, ListChecks, Activity, Radio, Code } from 'lucide-react';
import { motion } from 'framer-motion';
import CompanySwitcher from './CompanySwitcher';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard Home', href: '/', icon: Activity },
    { name: 'Radar de Pílulas', href: '/pilulas', icon: ListChecks },
    { name: 'Córtex Neural', href: '/cortex', icon: BrainCircuit },
    { name: 'Calibração IA', href: '/cortex/calibracao', icon: BrainCircuit },
    { name: 'Instalar Transponder', href: '/cortex/transponder', icon: Code },
    { name: 'Radar Interno', href: '/radar-interno', icon: Radio },
    { name: 'Automação GEO', href: '/geo', icon: Globe2 },
    { name: 'Master CRM', href: '/admin/crm', icon: LayoutDashboard },
  ];

  return (
    <div className="w-64 h-screen border-r border-red-500/10 bg-zinc-950/50 backdrop-blur-md flex flex-col fixed left-0 top-0 z-40">
      {/* Logo Area */}
      <div className="h-20 flex items-center gap-3 px-6 border-b border-red-500/10 shrink-0">
        <div className="relative">
          <div className="absolute inset-0 bg-red-600 blur-[10px] opacity-20 rounded-full"></div>
          <Image src="/icon.png" alt="IndexPulse Logo" width={32} height={32} className="relative z-10 drop-shadow-[0_0_8px_rgba(255,42,42,0.4)]" />
        </div>
        <span className="font-bold text-lg tracking-tight">IndexPulse</span>
      </div>

      <div className="pt-4 shrink-0">
        <CompanySwitcher />
      </div>

      {/* Navigation */}
      <div className="flex-1 py-8 px-4 flex flex-col gap-2">
        <p className="px-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Menu Principal</p>
        
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link key={item.name} href={item.href}>
              <div className={`relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 group cursor-pointer overflow-hidden ${
                isActive ? 'text-white' : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}>
                {isActive && (
                  <motion.div 
                    layoutId="sidebar-active"
                    className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-transparent border-l-2 border-red-500"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon className={`w-5 h-5 relative z-10 transition-colors ${isActive ? 'text-red-500' : 'group-hover:text-red-400'}`} />
                <span className="font-medium text-sm relative z-10">{item.name}</span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-red-500/10">
        <div className="flex items-center gap-3 px-3 py-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors cursor-pointer mb-1">
          <Settings className="w-5 h-5" />
          <span className="font-medium text-sm">Configurações</span>
        </div>
        <div className="flex items-center gap-3 px-3 py-2 text-zinc-400 hover:text-red-400 hover:bg-red-500/5 rounded-xl transition-colors cursor-pointer" onClick={() => {
          localStorage.removeItem('indexpulse_token');
          window.location.href = '/login';
        }}>
          <LogOut className="w-5 h-5" />
          <span className="font-medium text-sm">Sair do Sistema</span>
        </div>
      </div>
    </div>
  );
}
