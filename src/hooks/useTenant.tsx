import { useState, useEffect, createContext, useContext } from 'react';
import { tenantManager } from '@/lib/tenants/tenantManager';
import { Tenant, TenantUser } from '@/lib/tenants/tenantManager';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

// Contexto para gerenciar o tenant atual
interface TenantContextType {
  currentTenant: Tenant | null;
  userTenants: Tenant[];
  setTenant: (tenantId: string) => Promise<boolean>;
  createNewTenant: (tenant: Partial<Tenant>) => Promise<Tenant | null>;
  isLoading: boolean;
  refetchTenants: () => Promise<void>;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

// Provider para o contexto de tenant
export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, userRole, userName } = useAuth();
  const { toast } = useToast();
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);
  const [userTenants, setUserTenants] = useState<Tenant[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Inicializa o tenant atual
  useEffect(() => {
    async function initializeTenant() {
      if (!isAuthenticated) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        // Tenta carregar o tenant atual
        const tenant = await tenantManager.loadCurrentTenant();
        if (tenant) {
          setCurrentTenant(tenant);
        }
        
        // Se não tiver tenant, cria um padrão para o usuário atual
        if (!tenant && userName) {
          const defaultTenant: Partial<Tenant> = {
            name: `${userName} Workspace`,
            plan: 'free',
            status: 'active'
          };
          
          const newTenant = await tenantManager.createTenant(defaultTenant);
          if (newTenant) {
            // Adiciona o usuário como proprietário do novo tenant
            await tenantManager.addUserToTenant('current_user_id', newTenant.id, 'owner');
            tenantManager.setCurrentTenant(newTenant);
            setCurrentTenant(newTenant);
          }
        }
        
        // Carrega os tenants do usuário
        await refetchTenants();
      } catch (error) {
        console.error('Erro ao inicializar tenant:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível inicializar o workspace',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    }

    initializeTenant();
  }, [isAuthenticated, userName]);

  // Função para carregar os tenants do usuário
  const refetchTenants = async () => {
    if (!isAuthenticated) return;
    
    try {
      // Em produção, usaria o ID real do usuário
      const userId = 'current_user_id';
      const tenants = await tenantManager.getUserTenants(userId);
      setUserTenants(tenants);
    } catch (error) {
      console.error('Erro ao carregar tenants do usuário:', error);
    }
  };

  // Função para alterar o tenant atual
  const setTenant = async (tenantId: string): Promise<boolean> => {
    try {
      const tenant = await tenantManager.getTenant(tenantId);
      if (!tenant) {
        toast({
          title: 'Erro',
          description: 'Workspace não encontrado',
          variant: 'destructive',
        });
        return false;
      }
      
      tenantManager.setCurrentTenant(tenant);
      setCurrentTenant(tenant);
      toast({
        title: 'Workspace alterado',
        description: `Você está agora no workspace ${tenant.name}`,
      });
      return true;
    } catch (error) {
      console.error('Erro ao alterar tenant:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível alterar o workspace',
        variant: 'destructive',
      });
      return false;
    }
  };

  // Função para criar um novo tenant
  const createNewTenant = async (tenant: Partial<Tenant>): Promise<Tenant | null> => {
    try {
      const newTenant = await tenantManager.createTenant(tenant);
      if (newTenant) {
        // Adiciona o usuário como proprietário
        await tenantManager.addUserToTenant('current_user_id', newTenant.id, 'owner');
        await refetchTenants();
        toast({
          title: 'Workspace criado',
          description: `O workspace ${newTenant.name} foi criado com sucesso`,
        });
        return newTenant;
      }
      return null;
    } catch (error) {
      console.error('Erro ao criar tenant:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível criar o workspace',
        variant: 'destructive',
      });
      return null;
    }
  };

  const value = {
    currentTenant,
    userTenants,
    setTenant,
    createNewTenant,
    isLoading,
    refetchTenants
  };

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>;
};

// Hook para usar o contexto de tenant
export const useTenant = () => {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant deve ser usado dentro de um TenantProvider');
  }
  return context;
};

// Hook simplificado para obter apenas o ID do tenant atual
export const useCurrentTenantId = (): string => {
  const { currentTenant } = useTenant();
  return currentTenant?.id || 'default';
};
