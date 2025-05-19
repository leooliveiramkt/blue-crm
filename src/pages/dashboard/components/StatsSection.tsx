
import React from 'react';
import StatCard from './StatCard';
import { DollarSign, Users, ShoppingCart, BarChart3 } from 'lucide-react';

const StatsSection = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard 
        title="Vendas Totais" 
        value="R$ 45.231,89" 
        change="+12.5%" 
        trend="up" 
        icon={DollarSign} 
      />
      <StatCard 
        title="Novos Afiliados" 
        value="126" 
        change="+4.3%" 
        trend="up" 
        icon={Users} 
      />
      <StatCard 
        title="Pedidos" 
        value="864" 
        change="-2.1%" 
        trend="down" 
        icon={ShoppingCart} 
      />
      <StatCard 
        title="Taxa de Conversão" 
        value="3.78%" 
        change="+1.2%" 
        trend="up" 
        icon={BarChart3} 
      />
    </div>
  );
};

export default StatsSection;
