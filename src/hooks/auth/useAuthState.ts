
import { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { Profile, UserRole } from '@/types/auth';

export function useAuthState() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  // Inicializa o estado com base no localStorage para usuários demo
  useEffect(() => {
    const demoType = localStorage.getItem('demo_user_type');
    if (demoType) {
      console.log("useAuthState: Inicializando estado para usuário demo:", demoType);
      
      switch (demoType) {
        case 'admin':
          setIsAuthenticated(true);
          setUserRole('admin');
          setUserName('Admin');
          setUserId('demo-admin-id');
          break;
        case 'director':
          setIsAuthenticated(true);
          setUserRole('director');
          setUserName('Diretor');
          setUserId('demo-director-id');
          break;
        case 'consultant':
          setIsAuthenticated(true);
          setUserRole('consultant');
          setUserName('Consultor');
          setUserId('demo-consultant-id');
          break;
      }
    }
  }, []);

  const updateUserState = (session: Session | null) => {
    // Se for usuário demo, não atualiza o estado aqui
    if (localStorage.getItem('demo_user_type')) {
      return;
    }

    setSession(session);
    setIsAuthenticated(!!session);
    setUserId(session?.user?.id || null);

    if (!session?.user) {
      setProfile(null);
      setUserName(null);
      setUserRole(null);
      return;
    }
  };

  const processUserProfile = (profile: Profile | null) => {
    // Se for usuário demo, não sobrescreve o role
    const demoType = localStorage.getItem('demo_user_type');
    if (demoType) return;

    if (profile) {
      setProfile(profile);
      setUserName(profile?.first_name ? `${profile.first_name} ${profile.last_name || ''}`.trim() : 'Usuário');
      // Por enquanto, vamos manter o userRole como 'admin' para desenvolvimento
      setUserRole('admin');
    }
  };

  return {
    // Estado
    isAuthenticated,
    userRole,
    userName,
    userId,
    profile,
    session,
    
    // Métodos de atualização de estado
    updateUserState,
    processUserProfile,
    setIsAuthenticated,
    setUserRole,
    setUserName,
    setUserId,
    setProfile,
    setSession
  };
}
