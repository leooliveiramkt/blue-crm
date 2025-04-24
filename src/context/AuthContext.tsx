
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { tenantManager } from '@/lib/tenancy/tenantManager';

type UserRole = 'admin' | 'director' | 'consultant';

interface AuthContextType {
  isAuthenticated: boolean;
  userRole: UserRole | null;
  userName: string | null;
  userId: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (requiredRole: UserRole | UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication status on initial load
    const storedAuth = localStorage.getItem('isAuthenticated') === 'true';
    const storedRole = localStorage.getItem('userRole') as UserRole;
    const storedName = localStorage.getItem('userName');
    const storedId = localStorage.getItem('userId');

    if (storedAuth && storedRole && storedName) {
      setIsAuthenticated(true);
      setUserRole(storedRole);
      setUserName(storedName);
      setUserId(storedId || 'current_user_id');
    } else {
      // Limpar dados inválidos ou incompletos
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userName');
      localStorage.removeItem('userId');
      
      setIsAuthenticated(false);
      setUserRole(null);
      setUserName(null);
      setUserId(null);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Esta é uma autenticação simulada - substitua pela lógica de autenticação real
      let success = false;
      let role: UserRole | null = null;
      let name: string | null = null;
      let id: string | null = null;

      if (email === 'admin@example.com' && password === 'admin') {
        role = 'admin';
        name = 'Admin User';
        id = 'admin_user_id';
        success = true;
      } else if (email === 'director@example.com' && password === 'director') {
        role = 'director';
        name = 'Director User';
        id = 'director_user_id';
        success = true;
      } else if (email === 'consultant@example.com' && password === 'consultant') {
        role = 'consultant';
        name = 'Consultant User';
        id = 'consultant_user_id';
        success = true;
      }

      if (success) {
        setUserRole(role);
        setUserName(name);
        setUserId(id);
        setIsAuthenticated(true);
        localStorage.setItem('userRole', role as string);
        localStorage.setItem('userName', name as string);
        localStorage.setItem('userId', id as string);
        localStorage.setItem('isAuthenticated', 'true');

        // Inicializa o tenant para o usuário após o login
        await tenantManager.loadCurrentTenant();
        
        return true;
      }
      return false;
    } catch (error) {
      console.error("Erro durante login:", error);
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    setUserName(null);
    setUserId(null);
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('currentTenantId');
    navigate('/login');
  };

  const hasPermission = (requiredRole: UserRole | UserRole[]): boolean => {
    if (!isAuthenticated || !userRole) return false;
    
    // Role hierarchy: admin > director > consultant
    if (userRole === 'admin') return true;
    
    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(userRole);
    }
    
    if (requiredRole === 'director') {
      return userRole === 'director';
    }
    
    if (requiredRole === 'consultant') {
      return ['consultant', 'director'].includes(userRole);
    }
    
    return false;
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      userRole, 
      userName, 
      userId,
      login, 
      logout, 
      hasPermission 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
