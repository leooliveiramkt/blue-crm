import React from 'react';
import { useTenant } from '../../contexts/TenantContext';
import { UserRole } from '../../types/multiTenant';

interface PermissionGuardProps {
  children: React.ReactNode;
  requiredPermission?: string;
  requiredRole?: UserRole;
  allowedRoles?: UserRole[];
  requireSuperAdmin?: boolean;
  fallback?: React.ReactNode;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  children,
  requiredPermission,
  requiredRole,
  allowedRoles,
  requireSuperAdmin = false,
  fallback = null
}) => {
  const { userSession, hasPermission, isSuperAdmin } = useTenant();

  // Se não há sessão, não mostrar nada
  if (!userSession) {
    return <>{fallback}</>;
  }

  // Super Admin sempre tem acesso (exceto se explicitamente negado)
  if (isSuperAdmin() && !requireSuperAdmin) {
    return <>{children}</>;
  }

  // Verificar se requer Super Admin
  if (requireSuperAdmin && !isSuperAdmin()) {
    return <>{fallback}</>;
  }

  // Verificar role específico
  if (requiredRole && userSession.role !== requiredRole) {
    return <>{fallback}</>;
  }

  // Verificar se está na lista de roles permitidos
  if (allowedRoles && !allowedRoles.includes(userSession.role)) {
    return <>{fallback}</>;
  }

  // Verificar permissão específica
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

// Componentes específicos para cada nível de acesso
export const SuperAdminOnly: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ children, fallback }) => (
  <PermissionGuard requireSuperAdmin fallback={fallback}>
    {children}
  </PermissionGuard>
);

export const AdminEmpresaOnly: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ children, fallback }) => (
  <PermissionGuard 
    allowedRoles={['super_admin', 'admin_empresa']} 
    fallback={fallback}
  >
    {children}
  </PermissionGuard>
);

export const AdminOrHigher: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ children, fallback }) => (
  <PermissionGuard 
    allowedRoles={['super_admin', 'admin_empresa', 'admin']} 
    fallback={fallback}
  >
    {children}
  </PermissionGuard>
);

export const DiretorOrHigher: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ children, fallback }) => (
  <PermissionGuard 
    allowedRoles={['super_admin', 'admin_empresa', 'admin', 'diretor']} 
    fallback={fallback}
  >
    {children}
  </PermissionGuard>
);

export const SupervisorOrHigher: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ children, fallback }) => (
  <PermissionGuard 
    allowedRoles={['super_admin', 'admin_empresa', 'admin', 'diretor', 'supervisor']} 
    fallback={fallback}
  >
    {children}
  </PermissionGuard>
);

// Componente para mostrar informações baseadas em permissões
export const PermissionBadge: React.FC = () => {
  const { userSession } = useTenant();

  if (!userSession) return null;

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'super_admin': return 'bg-red-500 text-white';
      case 'admin_empresa': return 'bg-blue-500 text-white';
      case 'admin': return 'bg-green-500 text-white';
      case 'diretor': return 'bg-purple-500 text-white';
      case 'supervisor': return 'bg-orange-500 text-white';
      case 'auxiliar': return 'bg-gray-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getRoleDisplayName = (role: UserRole) => {
    switch (role) {
      case 'super_admin': return '👑 Super Admin';
      case 'admin_empresa': return '🏢 Admin Empresa';
      case 'admin': return '🔧 Admin';
      case 'diretor': return '👔 Diretor';
      case 'supervisor': return '📊 Supervisor';
      case 'auxiliar': return '👀 Auxiliar';
      default: return role;
    }
  };

  return (
    <span className={`px-2 py-1 text-xs rounded-full ${getRoleBadgeColor(userSession.role)}`}>
      {getRoleDisplayName(userSession.role)}
    </span>
  );
};

// Hook personalizado para verificações específicas
export const usePermissions = () => {
  const { userSession, hasPermission, isSuperAdmin, canAccessBelaBlue } = useTenant();

  return {
    // Verificações de role
    isSuperAdmin: isSuperAdmin(),
    isAdminEmpresa: userSession?.role === 'admin_empresa',
    isAdmin: userSession?.role === 'admin',
    isDiretor: userSession?.role === 'diretor',
    isSupervisor: userSession?.role === 'supervisor',
    isAuxiliar: userSession?.role === 'auxiliar',

    // Verificações de permissões específicas
    canEditApis: hasPermission('can_edit_api_configs'),
    canManageUsers: hasPermission('can_create_users'),
    canManageAffiliates: hasPermission('can_manage_affiliates'),
    canCreatePromotions: hasPermission('can_create_promotions'),
    canSuperviseOperations: hasPermission('can_supervise_operations'),
    canExportData: hasPermission('can_export_data'),
    canViewReports: hasPermission('can_view_reports'),
    canCreateReports: hasPermission('can_create_reports'),

    // Verificações de acesso
    canAccessBelaBlue: canAccessBelaBlue(),
    canAccessAdminPanel: hasPermission('can_access_admin_panel'),

    // Informações da sessão
    userRole: userSession?.role,
    tenantId: userSession?.tenant_id,
    userEmail: userSession?.email
  };
}; 