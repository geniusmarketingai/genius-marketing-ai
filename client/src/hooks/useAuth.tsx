import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { User } from '@supabase/supabase-js';
import { apiRequest } from '@/lib/queryClient';
import { useQuery } from '@tanstack/react-query';

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  hasProfile: boolean;
  signOut: () => Promise<void>;
  signInWithPassword: (email_0: string, password_0: string) => Promise<any>;
  signUp: (email_0: string, password_0: string) => Promise<any>;
  signInWithOAuth: (provider_0: 'google' | 'facebook') => Promise<any>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  hasProfile: false,
  signOut: async () => {},
  signInWithPassword: async () => ({}),
  signUp: async () => ({}),
  signInWithOAuth: async () => ({}),
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
  
  // Sign up new users
  const signUp = async (email_0: string, password_0: string) => {
    const { data, error } = await supabase.auth.signUp({
      email: email_0,
      password: password_0,
      // options: {
      //   // emailRedirectTo: `${window.location.origin}/auth/callback`, // Se o serviço de email estivesse ativo e confirmação habilitada
      // },
    });
    if (error) console.error('Error signing up:', error.message);
    return { data, error };
  };

  // Sign in with email and password
  const signInWithPassword = async (email_0: string, password_0: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email_0,
      password: password_0,
    });
    if (error) console.error('Error signing in with password:', error.message);
    return { data, error };
  };

  // Sign in with OAuth provider
  const signInWithOAuth = async (provider_0: 'google' | 'facebook') => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider_0,
      options: {
        // redirectTo: `${window.location.origin}/` // Opcional, Supabase geralmente lida bem com isso se Site URL estiver configurado.
        // queryParams: provider === 'google' ? { access_type: 'offline', prompt: 'consent' } : undefined, // Exemplo para Google
      },
    });
    if (error) console.error(`Error signing in with ${provider_0}:`, error.message);
    return { data, error };
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
    signOut,
    signInWithPassword,
    signUp,
    signInWithOAuth,
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
