
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { User, UserRole } from '@/types';
import { Company, UserCompanyAssociation } from '@/types/company';
import { supabase } from '@/integrations/supabase/client';
import { 
  transformCompany, 
  transformUserCompanyAssociation 
} from '@/utils/dataTransformers';

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  requiresPasswordChange: boolean;
  isSystemAdmin: boolean;
  userCompanies: UserCompanyAssociation[];
  activeCompany: Company | null;
  activeRole: UserRole | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  switchCompany: (companyId: string) => Promise<void>;
  error: string | null;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  requiresPasswordChange: false,
  isSystemAdmin: false,
  userCompanies: [],
  activeCompany: null,
  activeRole: null,
  login: async () => {},
  logout: async () => {},
  switchCompany: async () => {},
  error: null,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requiresPasswordChange, setRequiresPasswordChange] = useState(false);
  const [isSystemAdmin, setIsSystemAdmin] = useState(false);
  const [userCompanies, setUserCompanies] = useState<UserCompanyAssociation[]>([]);
  const [activeCompany, setActiveCompany] = useState<Company | null>(null);
  const [activeRole, setActiveRole] = useState<UserRole | null>(null);
  const lastUserRef = useRef<User | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔐 Auth state change:', event, session?.user?.id);
      
      if (event === 'SIGNED_OUT' || !session?.user) {
        console.log('🚪 User signed out, clearing state');
        setUser(null);
        setRequiresPasswordChange(false);
        setIsSystemAdmin(false);
        setUserCompanies([]);
        setActiveCompany(null);
        setActiveRole(null);
        lastUserRef.current = null;
        setIsLoading(false);
      } else if (session?.user) {
        console.log('👤 User signed in, fetching profile');
        setTimeout(() => {
          fetchUserProfile(session.user.id);
        }, 0);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('Fetching user profile for:', userId);
      
      // Fetch user data
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, name, email, role, requires_password_change, is_system_admin')
        .eq('id', userId)
        .single();

      if (userError) {
        console.error('Error fetching user profile:', userError);
        const fallbackUser: User = {
          id: userId,
          name: 'Usuario',
          email: '',
          role: 'admin' as UserRole,
        };
        setUser(fallbackUser);
        lastUserRef.current = fallbackUser;
        setRequiresPasswordChange(false);
        setIsSystemAdmin(false);
        setIsLoading(false);
        return;
      }

      // Fetch user companies
      const { data: companiesData, error: companiesError } = await supabase
        .from('user_company_associations')
        .select(`
          *,
          company:companies(*)
        `)
        .eq('user_id', userId)
        .eq('is_active', true);

      if (companiesError) {
        console.error('Error fetching user companies:', companiesError);
      }

      // Fetch active company session
      const { data: sessionData, error: sessionError } = await supabase
        .from('user_sessions')
        .select(`
          *,
          company:companies(*)
        `)
        .eq('user_id', userId)
        .single();

      if (sessionError && sessionError.code !== 'PGRST116') {
        console.error('Error fetching user session:', sessionError);
      }

      const newUser: User = {
        id: userData.id,
        name: userData.name || 'Usuario',
        email: userData.email || '',
        role: (userData.role as UserRole) || 'admin',
      };

      setUser(newUser);
      lastUserRef.current = newUser;
      setRequiresPasswordChange(userData.requires_password_change || false);
      setIsSystemAdmin(userData.is_system_admin || false);
      
      // Transform companies data
      const transformedCompanies = companiesData?.map(transformUserCompanyAssociation) || [];
      setUserCompanies(transformedCompanies);
      
      if (sessionData?.company) {
        const transformedCompany = transformCompany(sessionData.company);
        setActiveCompany(transformedCompany);
        // Find the user's role in the active company
        const activeAssociation = transformedCompanies.find(
          (assoc) => assoc.companyId === transformedCompany.id
        );
        setActiveRole((activeAssociation?.role as UserRole) || null);
      } else if (transformedCompanies.length > 0) {
        // Set first company as active if no session exists
        const firstCompany = transformedCompanies[0];
        if (firstCompany.company) {
          setActiveCompany(firstCompany.company);
          setActiveRole(firstCompany.role as UserRole);
          
          // Create session for first company
          await supabase
            .from('user_sessions')
            .upsert({
              user_id: userId,
              active_company_id: firstCompany.company.id
            });
        }
      }

    } catch (err) {
      console.error('Error fetching user profile:', err);
      const fallbackUser: User = {
        id: userId,
        name: 'Usuario',
        email: '',
        role: 'admin' as UserRole,
      };
      setUser(fallbackUser);
      lastUserRef.current = fallbackUser;
      setRequiresPasswordChange(false);
      setIsSystemAdmin(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      console.log('Login successful');
    } catch (err: any) {
      setError(err.message || 'Error de autenticación');
      console.error('Login error:', err);
      setIsLoading(false);
    }
  };

  const switchCompany = async (companyId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Update user session
      const { error } = await supabase
        .from('user_sessions')
        .upsert({
          user_id: user.id,
          active_company_id: companyId,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      // Find the company and role
      const association = userCompanies.find(uc => uc.companyId === companyId);
      if (association?.company) {
        setActiveCompany(association.company);
        setActiveRole(association.role as UserRole);
      }

      console.log('✅ Company switched successfully to:', companyId);
    } catch (err) {
      console.error('💥 Error switching company:', err);
      throw err;
    }
  };

  const logout = async () => {
    try {
      console.log('🚪 Initiating logout...');
      setIsLoading(true);
      
      setUser(null);
      setRequiresPasswordChange(false);
      setIsSystemAdmin(false);
      setUserCompanies([]);
      setActiveCompany(null);
      setActiveRole(null);
      lastUserRef.current = null;
      setError(null);
      
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
        throw error;
      }
      
      console.log('✅ Logout successful');
    } catch (err) {
      console.error('💥 Logout error:', err);
      setUser(null);
      setRequiresPasswordChange(false);
      setIsSystemAdmin(false);
      setUserCompanies([]);
      setActiveCompany(null);
      setActiveRole(null);
      lastUserRef.current = null;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ 
        user, 
        isAuthenticated: !!user, 
        isLoading, 
        requiresPasswordChange,
        isSystemAdmin,
        userCompanies,
        activeCompany,
        activeRole,
        login, 
        logout,
        switchCompany,
        error 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
