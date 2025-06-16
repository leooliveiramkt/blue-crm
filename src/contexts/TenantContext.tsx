import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserSession, UserRole, TenantConfig, createRolePermissions } from '../types/multiTenant';

interface TenantContextType {
  userSession: UserSession | null;
  tenantConfig: TenantConfig | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  switchTenant: (tenantId: string) => Promise<boolean>;
  hasPermission: (permission: string) => boolean;
  canAccessBelaBlue: () => boolean;
  isSuperAdmin: () => boolean;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant deve ser usado dentro de TenantProvider');
  }
  return context;
};

interface TenantProviderProps {
  children: React.ReactNode;
}

export const TenantProvider: React.FC<TenantProviderProps> = ({ children }) => {
  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const [tenantConfig, setTenantConfig] = useState<TenantConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 👑 Super Admin Email
  const SUPER_ADMIN_EMAIL = import.meta.env.VITE_SUPER_ADMIN_EMAIL || 'leooliveiramktd@gmail.com';

  useEffect(() => {
    // Verificar se há sessão salva
    initializeSession();
  }, []);

  const initializeSession = async () => {
    try {
      const savedSession = localStorage.getItem('blue_crm_session');
      if (savedSession) {
        const session = JSON.parse(savedSession);
        await loadUserSession(session.email, session.tenant_id);
      }
    } catch (error) {
      console.error('Erro ao inicializar sessão:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserSession = async (email: string, tenantId?: string) => {
    try {
      // Determinar role baseado no email
      const role: UserRole = determineUserRole(email);
      
      // Para Super Admin, usar tenant padrão ou permitir escolher
      const finalTenantId = role === 'super_admin' 
        ? (tenantId || 'bela_blue') 
        : await getTenantForUser(email);

      // Criar sessão do usuário
      const session: UserSession = {
        user_id: generateUserId(email),
        email,
        tenant_id: finalTenantId,
        role,
        permissions: createRolePermissions(role),
        can_access_bela_blue: true, // Todos podem ver Bela Blue
        is_super_admin: role === 'super_admin',
        access_level: getAccessLevel(role)
      };

      // Carregar configuração do tenant
      const tenant = await loadTenantConfig(finalTenantId);

      setUserSession(session);
      setTenantConfig(tenant);

      // Salvar sessão
      localStorage.setItem('blue_crm_session', JSON.stringify({
        email,
        tenant_id: finalTenantId,
        timestamp: Date.now()
      }));

      return true;
    } catch (error) {
      console.error('Erro ao carregar sessão:', error);
      return false;
    }
  };

  const determineUserRole = (email: string): UserRole => {
    // 👑 Super Admin
    if (email === SUPER_ADMIN_EMAIL) {
      return 'super_admin';
    }

    // TODO: Implementar lógica real de verificação de role
    // Por enquanto, determinar baseado no domínio do email
    if (email.includes('@belablue.') || email.includes('@admin.')) {
      return 'admin_empresa';
    }

    // Role padrão
    return 'auxiliar';
  };

  const getAccessLevel = (role: UserRole) => {
    switch (role) {
      case 'super_admin': return 'full';
      case 'admin_empresa': return 'company_admin';
      case 'admin': return 'admin_crm';
      case 'diretor':
      case 'supervisor': return 'operational';
      case 'auxiliar': return 'read_only';
      default: return 'read_only';
    }
  };

  const getTenantForUser = async (email: string): Promise<string> => {
    // TODO: Implementar lógica real para buscar tenant do usuário
    // Por enquanto, usar Bela Blue como padrão
    return 'bela_blue';
  };

  const loadTenantConfig = async (tenantId: string): Promise<TenantConfig> => {
    // TODO: Carregar configuração real do tenant
    // Por enquanto, retornar configuração mock da Bela Blue
    return {
      tenant_id: 'bela_blue',
      company_name: 'Bela Blue Beauty',
      is_master: true,
      is_active: true,
      apis: {
        wbuy: {
          url: import.meta.env.VITE_BELA_BLUE_WBUY_URL || '',
          token: import.meta.env.VITE_BELA_BLUE_WBUY_TOKEN || '',
          store_id: import.meta.env.VITE_BELA_BLUE_WBUY_STORE_ID || '',
          enabled: true
        },
        tiny: {
          url: import.meta.env.VITE_BELA_BLUE_TINY_URL || '',
          token: import.meta.env.VITE_BELA_BLUE_TINY_TOKEN || '',
          enabled: true
        }
      },
      access_bela_blue: true,
      subscription_plan: 'enterprise',
      created_at: new Date(),
      updated_at: new Date()
    };
  };

  const generateUserId = (email: string): string => {
    // TODO: Implementar geração real de ID
    return `user_${email.replace('@', '_').replace('.', '_')}`;
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // TODO: Implementar autenticação real com Supabase
      // Por enquanto, simular login
      if (email && password) {
        return await loadUserSession(email);
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUserSession(null);
    setTenantConfig(null);
    localStorage.removeItem('blue_crm_session');
  };

  const switchTenant = async (tenantId: string): Promise<boolean> => {
    if (!userSession || !userSession.is_super_admin) {
      return false; // Só Super Admin pode trocar de tenant
    }

    try {
      const newTenant = await loadTenantConfig(tenantId);
      const updatedSession = {
        ...userSession,
        tenant_id: tenantId
      };

      setUserSession(updatedSession);
      setTenantConfig(newTenant);

      // Atualizar sessão salva
      localStorage.setItem('blue_crm_session', JSON.stringify({
        email: userSession.email,
        tenant_id: tenantId,
        timestamp: Date.now()
      }));

      return true;
    } catch (error) {
      console.error('Erro ao trocar tenant:', error);
      return false;
    }
  };

  const hasPermission = (permission: string): boolean => {
    if (!userSession) return false;
    
    // Super Admin tem todas as permissões
    if (userSession.is_super_admin) return true;

    // Verificar permissão específica
    return (userSession.permissions as any)[permission] || false;
  };

  const canAccessBelaBlue = (): boolean => {
    return userSession?.can_access_bela_blue || false;
  };

  const isSuperAdmin = (): boolean => {
    return userSession?.is_super_admin || false;
  };

  const value: TenantContextType = {
    userSession,
    tenantConfig,
    isLoading,
    login,
    logout,
    switchTenant,
    hasPermission,
    canAccessBelaBlue,
    isSuperAdmin
  };

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  );
}; 