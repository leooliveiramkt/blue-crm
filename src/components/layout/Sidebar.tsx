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
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarTrigger,
  useSidebar
} from '@/components/ui/sidebar';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

type NavItem = {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  submenu?: { title: string; href: string }[];
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
    href: "/crm-pipeline",
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
    href: "/api-integrations",
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
  const { state, toggleSidebar } = useSidebar();
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
    <>
      {/* Botão flutuante para reabrir a sidebar quando ela estiver oculta */}
      {state === 'collapsed' && (
        <Button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 bg-primary text-white shadow-lg hover:bg-primary-700"
          size="icon"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
      )}
      <SidebarComponent className="bg-primary text-white border-r-0">
        <SidebarHeader className="flex h-14 items-center px-4 border-b border-secondary/40 bg-primary gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <img
              src="/logo.png"
              alt="Logo Borboleta"
              className="h-8 w-8 object-contain"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
              style={{ display: 'block' }}
            />
            <span className="text-xl font-bold text-white logo-animated truncate max-w-[120px]">
              Blue CRM
            </span>
          </div>
          <div className="flex-1" />
          <SidebarTrigger className="text-white hover:text-white/80 hover:bg-white/10" />
        </SidebarHeader>
        
        <SidebarContent className="py-4 bg-primary">
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
                      `flex items-center gap-2 rounded-md px-3 py-2 transition-all text-white hover:bg-[hsl(var(--sidebar-accent))] hover:text-[hsl(var(--sidebar-accent-foreground))]`,
                      isActive 
                        ? `bg-[hsl(var(--sidebar-accent))] text-[hsl(var(--sidebar-accent-foreground))] font-medium` 
                        : ""
                    )}
                  >
                    <item.icon className="h-4 w-4 text-white group-[.active]:text-primary" />
                    <span>{item.title}</span>
                  </NavLink>
                </SidebarMenuButton>
                {item.submenu && (
                  <SidebarMenuSub>
                    {item.submenu.map((sub) => (
                      <SidebarMenuSubItem key={sub.href}>
                        <SidebarMenuSubButton
                          asChild
                          isActive={false}
                          className="hover:bg-[hsl(var(--sidebar-accent))] hover:text-[hsl(var(--sidebar-accent-foreground))]"
                        >
                          <NavLink to={sub.href}>{sub.title}</NavLink>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                )}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        
        <SidebarFooter className="bg-primary border-t border-secondary/40">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
              <span className="text-xs font-medium text-primary">{getUserInitials()}</span>
            </div>
            <div>
              <p className="text-xs font-medium text-white">{userName || 'Usuário'}</p>
              <p className="text-xs text-white/60">{userRole ? `Perfil: ${userRole}` : 'Sem perfil'}</p>
            </div>
          </div>
        </SidebarFooter>
      </SidebarComponent>
    </>
  );
};

export default Sidebar;
