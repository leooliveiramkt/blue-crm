
import { useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { Profile, UserRole } from '@/types/auth';

export function useAuthState() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  const updateUserState = (session: Session | null) => {
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
