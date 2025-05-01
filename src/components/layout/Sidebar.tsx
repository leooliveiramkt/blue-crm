
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
  ChevronLeft,
  Tag,
  TrendingUp,
  Search,
  Package,
  Store,
  Box
} from 'lucide-react';
import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar
} from '@/components/ui/sidebar';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';

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
    title: "Marketing",
    href: "/marketing",
    icon: TrendingUp,
  },
  {
    title: "Afiliados",
    href: "/affiliates",
    icon: Users,
  },
  {
    title: "Rastreamento",
    href: "/order-tracking",
    icon: Search,
  },
  {
    title: "Pipeline",
    href: "/orders",
    icon: FileText,
  },
  {
    title: "Comercial",
    href: "/commercial",
    icon: Store,
  },
  {
    title: "Expedição",
    href: "/shipping",
    icon: Box,
  },
  {
    title: "Integrações API",
    href: "/integrations",
    icon: Database,
  },
  {
    title: "Afiliação Wbuy",
    href: "/wbuy-affiliation",
    icon: Tag,
  },
  {
    title: "Configurações",
    href: "/settings",
    icon: Settings,
  },
];

const Sidebar = () => {
  const { state } = useSidebar();
  const { userName, userRole } = useAuth();
  const { themeConfig } = useTheme();
  
  // Obter as iniciais do nome do usuário para o avatar
  const getUserInitials = () => {
    if (!userName) return "U";
    return userName
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  return (
    <SidebarComponent>
      <SidebarHeader className="flex h-14 items-center px-4 border-b border-sidebar-border">
        <span className="text-xl font-bold text-white logo-animated">{themeConfig.companyName}</span>
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
            <span className="text-xs font-medium text-sidebar-accent-foreground">{getUserInitials()}</span>
          </div>
          <div>
            <p className="text-xs font-medium text-sidebar-foreground">{userName || 'Usuário'}</p>
            <p className="text-xs text-sidebar-foreground/60">{userRole ? `Perfil: ${userRole}` : 'Sem perfil'}</p>
          </div>
        </div>
      </SidebarFooter>
    </SidebarComponent>
  );
};

export default Sidebar;
