
import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  BarChart3, 
  LayoutDashboard, 
  Users, 
  Link, 
  Settings, 
  Database,
  FileText 
} from 'lucide-react';

type NavItem = {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Relatórios",
    href: "/reports",
    icon: BarChart3,
  },
  {
    title: "Afiliados",
    href: "/affiliates",
    icon: Users,
  },
  {
    title: "Rastreamento",
    href: "/tracking",
    icon: Link,
  },
  {
    title: "Pedidos",
    href: "/orders",
    icon: FileText,
  },
  {
    title: "Integrações API",
    href: "/api-integrations",
    icon: Database,
  },
  {
    title: "Configurações",
    href: "/settings",
    icon: Settings,
  },
];

const Sidebar = () => {
  return (
    <aside className="hidden md:flex h-screen w-64 flex-col bg-sidebar fixed inset-y-0 z-10">
      <div className="flex h-14 items-center border-b border-sidebar-border px-4">
        <span className="text-xl font-bold text-white">AffiFlow CRM</span>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <NavLink 
                to={item.href}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                  isActive 
                    ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-sidebar-accent flex items-center justify-center">
            <span className="text-xs font-medium text-sidebar-accent-foreground">AD</span>
          </div>
          <div>
            <p className="text-xs font-medium text-sidebar-foreground">Admin User</p>
            <p className="text-xs text-sidebar-foreground/60">admin@exemplo.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
