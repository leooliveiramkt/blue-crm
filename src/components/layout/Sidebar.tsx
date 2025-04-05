
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
  FileText,
  ChevronLeft
} from 'lucide-react';
import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar
} from '@/components/ui/sidebar';

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
  const { state } = useSidebar();
  
  return (
    <SidebarComponent>
      <SidebarHeader className="flex h-14 items-center px-4 border-b border-sidebar-border">
        <span className="text-xl font-bold text-white">AffiFlow CRM</span>
        <div className="flex-1"></div>
        <SidebarTrigger />
      </SidebarHeader>
      
      <SidebarContent className="py-4">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton 
                asChild 
                tooltip={state === "collapsed" ? item.title : undefined}
              >
                <NavLink 
                  to={item.href}
                  className={({ isActive }) => cn(
                    isActive 
                      ? "data-[active=true]" 
                      : ""
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      
      <SidebarFooter className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-sidebar-accent flex items-center justify-center">
            <span className="text-xs font-medium text-sidebar-accent-foreground">AD</span>
          </div>
          <div>
            <p className="text-xs font-medium text-sidebar-foreground">Admin User</p>
            <p className="text-xs text-sidebar-foreground/60">admin@exemplo.com</p>
          </div>
        </div>
      </SidebarFooter>
    </SidebarComponent>
  );
};

export default Sidebar;
