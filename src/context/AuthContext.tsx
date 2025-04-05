
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type UserRole = 'admin' | 'director' | 'consultant';

interface AuthContextType {
  isAuthenticated: boolean;
  userRole: UserRole | null;
  userName: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (requiredRole: UserRole | UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication status on initial load
    const storedAuth = localStorage.getItem('isAuthenticated') === 'true';
    const storedRole = localStorage.getItem('userRole') as UserRole;
    const storedName = localStorage.getItem('userName');

    if (storedAuth && storedRole && storedName) {
      setIsAuthenticated(true);
      setUserRole(storedRole);
      setUserName(storedName);
    } else {
      // Limpar dados inválidos ou incompletos
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userName');
      
      setIsAuthenticated(false);
      setUserRole(null);
      setUserName(null);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Esta é uma autenticação simulada - substitua pela lógica de autenticação real
      if (email === 'admin@example.com' && password === 'admin') {
        setUserRole('admin');
        setUserName('Admin User');
        setIsAuthenticated(true);
        localStorage.setItem('userRole', 'admin');
        localStorage.setItem('userName', 'Admin User');
        localStorage.setItem('isAuthenticated', 'true');
        return true;
      } else if (email === 'director@example.com' && password === 'director') {
        setUserRole('director');
        setUserName('Director User');
        setIsAuthenticated(true);
        localStorage.setItem('userRole', 'director');
        localStorage.setItem('userName', 'Director User');
        localStorage.setItem('isAuthenticated', 'true');
        return true;
      } else if (email === 'consultant@example.com' && password === 'consultant') {
        setUserRole('consultant');
        setUserName('Consultant User');
        setIsAuthenticated(true);
        localStorage.setItem('userRole', 'consultant');
        localStorage.setItem('userName', 'Consultant User');
        localStorage.setItem('isAuthenticated', 'true');
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
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('isAuthenticated');
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
    <AuthContext.Provider value={{ isAuthenticated, userRole, userName, login, logout, hasPermission }}>
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
