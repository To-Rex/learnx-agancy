import React, { createContext, useContext, useState, useEffect } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  isAdmin: boolean
  signUp: (email: string, password: string) => Promise<any>
  signIn: (email: string, password: string) => Promise<any>
  signInWithGoogle: () => Promise<any>
  adminSignIn: (username: string, password: string) => Promise<any>
  signOut: () => Promise<any>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [initializing, setInitializing] = useState(true)

  useEffect(() => {
    let mounted = true
    const storedAdminUser = localStorage.getItem('admin_user')
    if (storedAdminUser) {
      setIsAdmin(true)
      if (mounted) {
        setLoading(false)
        setInitializing(false)
      }
      return
    }
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()

        if (error) {
          console.error('Session error:', error)
        }

        console.log('Initial session:', session)

        if (mounted) {
          setSession(session)
          setUser(session?.user ?? null)
          await checkAdminStatus(session?.user)
          setLoading(false)
          setInitializing(false)
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        if (mounted) {
          setLoading(false)
          setInitializing(false)
        }
      }
    }
    initializeAuth()
    let timeoutId: NodeJS.Timeout

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event, session)

      // Clear previous timeout
      if (timeoutId) {
        clearTimeout(timeoutId)
      }

      // Debounce auth state changes
      timeoutId = setTimeout(async () => {
        if (mounted) {
          setSession(session)
          setUser(session?.user ?? null)
          await checkAdminStatus(session?.user)
          setLoading(false)
          setInitializing(false)
        }
      }, 100)
    })

    return () => {
      mounted = false
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      subscription.unsubscribe()
    }
  }, [])

  const checkAdminStatus = async (user: User | null) => {
    if (!user) {
      setIsAdmin(false)
      return
    }

    try {
      const adminEmails = ['admin@learnx.uz', 'dev.dilshodjon@gmail.com']
      setIsAdmin(adminEmails.includes(user.email || ''))
    } catch (error) {
      console.log('Admin check error:', error)
      setIsAdmin(false)
    }
  }

  // AuthContext.tsx ichida bo'lishi kerak:
  const signUp = async (email: string, password: string) => {
    // 1. Avval Supabase orqali ro‘yxatdan o‘tkazamiz
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return { data: null, error };

    const accessToken = data?.session?.access_token;
    if (!accessToken) {
      return { data: null, error: new Error('Supabase token olinmadi') };
    }

    // Tokenni vaqtincha saqlab qo'yish (agar kerak bo'lsa)
    localStorage.setItem('supabase_token', accessToken);

    try {
      // 2. Supabase tokenni API ga yuboramiz
      const res = await fetch('https://learnx-crm-production.up.railway.app/api/v1/auth/login-with-supabase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`, // header orqali
        },
        body: JSON.stringify({ access_token: accessToken }), // body orqali ham yuborish
      });

      if (!res.ok) {
        throw new Error(`API xatolik: ${res.status}`);
      }

      const apiData = await res.json();

      // 3. API tokenni saqlaymiz
      if (apiData?.token) {
        localStorage.setItem('api_access_token', apiData.token);
      } else {
        throw new Error('API token olinmadi');
      }

      return { data: apiData, error: null };
    } catch (apiError) {
      console.error('API bilan ishlashda xato:', apiError);
      return { data: null, error: apiError };
    }
  };



  const signIn = async (email: string, password: string) => {
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    const accessToken = data?.session?.access_token || null;
    if (accessToken) {
      localStorage.setItem('token', accessToken);
      // API ga Supabase tokenni yuborish
      try {
        const apiResponse = await fetch('https://learnx-crm-production.up.railway.app/api/v1/auth/login-with-supabase', {
          method: 'POST',  // API talab qilsa POST
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,  // Supabase tokenni yuboramiz
          },
          body: JSON.stringify({ access_token: accessToken }),
        });

        if (!apiResponse.ok) {
          throw new Error(`API xatolik: ${apiResponse.status}`);
        }

        const apiData = await apiResponse.json();
        console.log('API dan access token:', apiData);
          console.log('client_id', apiData?.client?.id);
        

        // API dan kelgan tokenni localStorage ga saqlash (agar API token qaytarsa)
        if (apiData.token) {
          localStorage.setItem('api_access_token', apiData?.token);
        }
        if (apiData.client.id) {
          console.log('client_id', apiData?.client?.id);
          localStorage.setItem('client_id', apiData?.client?.id);
        }

      } catch (apiError) {
        console.error('API bilan ishlashda xato:', apiError);
      }
    }

    if (!error && data?.user) {
      setUser(data.user);
      setSession(data.session);
      await checkAdminStatus(data.user);
    }

    setLoading(false);
    return { data, error };
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    const baseUrl = window.location.origin; // localhost yoki domain
    const redirectUrl = `${baseUrl}/auth/callback`;

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });


    if (error) setLoading(false);
    return { data, error };
  };


  const adminSignIn = async (username: string, password: string) => {
    try {
      setLoading(true);
      const response = await fetch("https://learnx-crm-production.up.railway.app/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifor: username, password })
      });
      const data = await response.json();
      console.log('LearnX CRM javobi:', data);

      if (!response.ok || !data?.token) {
        return { data: null, error: { message: "Noto‘g‘ri login yoki parol" } };
      }

      const adminUsers = ['bron', 'admin', 'dev.dilshodjon'];
      if (!adminUsers.includes(username)) {
        return { data: null, error: { message: "Bu foydalanuvchi admin emas" } };
      }

      setIsAdmin(true);
      localStorage.setItem('admin_user', JSON.stringify({ username, role: 'admin' }));
      localStorage.setItem('admin_access_token', data?.token);
      return { data: { success: true }, error: null };
    } catch (err) {
      console.error('Admin login xatosi:', err);
      return { data: null, error: { message: 'Kirish jarayonida xatolik yuz berdi' } };
    } finally {
      setLoading(false);
    }
  };




 const signOut = async () => {
  setLoading(true);

  try {
    // Supabase sessiyasini tozalash
    const { error } = await supabase.auth.signOut();
    if (error) console.error("Supabase signOut xato:", error);

    // React state-larni tozalash
    setUser(null);
    setSession(null);
    setIsAdmin(false);

    // localStorage va sessionStorage ni tozalash
    localStorage.removeItem('admin_user');
    localStorage.removeItem('supabase_token');
    localStorage.removeItem('api_access_token');
    localStorage.clear(); // Agar butun localStorage ni tozalash kerak bo‘lsa
    sessionStorage.clear();

    // Foydalanuvchini login sahifasiga yo'naltirish
    window.location.href = "/login";

  } catch (err) {
    console.error("Logout xato:", err);
  } finally {
    setLoading(false);
  }
};


  const value = {
    user,
    session,
    loading,
    isAdmin,
    signUp,
    signIn,
    signInWithGoogle,
    adminSignIn,
    signOut,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}