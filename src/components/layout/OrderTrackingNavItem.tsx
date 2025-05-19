
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Search } from 'lucide-react';

const OrderTrackingNavItem = () => {
  return (
    <NavLink
      to="/order-tracking"
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
          isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
        }`
      }
    >
      <Search className="h-4 w-4" />
      <span>Rastreamento de Pedidos</span>
    </NavLink>
  );
};

export default OrderTrackingNavItem;
