import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { User } from '@supabase/supabase-js';
import { apiRequest } from '@/lib/queryClient';
import { useQuery } from '@tanstack/react-query';

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  hasProfile: boolean;
  signInWithMagicLink: (email: string) => Promise<any>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  hasProfile: false,
  signInWithMagicLink: async () => ({}),
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch user profile
  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ['/api/profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const res = await fetch(`/api/profile?userId=${user.id}`);
      if (!res.ok) return null;
      return res.json();
    },
    enabled: !!user?.id,
  });
  
  const hasProfile = !!profile?.businessType;
  
  // Initialize authentication state
  useEffect(() => {
    const checkUser = async () => {
      setIsLoading(true);
      
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setUser(session.user);
          
          // Register user in our database if needed
          try {
            await apiRequest('POST', '/api/user', {
              id: session.user.id,
              email: session.user.email,
            });
          } catch (error) {
            console.error("Error registering user:", error);
          }
        }
      } catch (error) {
        console.error("Error checking auth session:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkUser();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          
          // Register user in our database if needed
          if (event === 'SIGNED_IN') {
            try {
              await apiRequest('POST', '/api/user', {
                id: session.user.id,
                email: session.user.email,
              });
            } catch (error) {
              console.error("Error registering user:", error);
            }
          }
        } else {
          setUser(null);
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  // Magic link sign in
  const signInWithMagicLink = async (email: string) => {
    return supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });
  };
  
  // Sign out
  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };
  
  const value = {
    user,
    isLoading: isLoading || isProfileLoading,
    hasProfile,
    signInWithMagicLink,
    signOut,
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
