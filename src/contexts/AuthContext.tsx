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
    
    // Check for stored admin user data
    const storedAdminUser = localStorage.getItem('admin_user')
    if (storedAdminUser) {
      setIsAdmin(true)
      if (mounted) {
        setLoading(false)
        setInitializing(false)
      }
      return
    }

    // Get initial session
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

    // Listen for auth changes with debounce
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
      // Check if user email matches any admin user
      // Since admin_users table doesn't have email column, we'll check against known admin emails
      const adminEmails = ['admin@learnx.uz', 'dev.dilshodjon@gmail.com']
      setIsAdmin(adminEmails.includes(user.email || ''))
    } catch (error) {
      console.log('Admin check error:', error)
      setIsAdmin(false)
    }
  }

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    return { data, error }
  }

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (!error && data.user) {
      // Force immediate state update
      setUser(data.user)
      setSession(data.session)
      await checkAdminStatus(data.user)
    }
    
    setLoading(false)
    return { data, error }
  }

  const signInWithGoogle = async () => {
    setLoading(true)
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'https://deft-gumdrop-6e6f8a.netlify.app/profile',
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        }
      }
    })
    
    if (error) setLoading(false)
    return { data, error }
  }

  const adminSignIn = async (username: string, password: string) => {
    try {
      // First verify admin credentials
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('username', username)
        .maybeSingle()

      if (error || !data) {
        return { data: null, error: { message: 'Noto\'g\'ri login yoki parol' } }
      }

      // Verify password
      const { data: passwordCheck, error: passwordError } = await supabase
        .rpc('verify_admin_password', {
          input_username: username,
          input_password: password
        })
      
      if (passwordError) {
        console.error('Password verification error:', passwordError)
        return { data: null, error: { message: 'Parol tekshirishda xatolik' } }
      }

      if (passwordCheck) {
        // Set admin state and store in localStorage
        setIsAdmin(true)
        localStorage.setItem('admin_user', JSON.stringify(data))
        return { data: { user: { email: `${username}@admin.local`, role: data.role } }, error: null }
      } else {
        return { data: null, error: { message: 'Noto\'g\'ri parol' } }
      }
    } catch (err) {
      console.error('Admin login error:', err)
      return { data: null, error: { message: 'Kirish jarayonida xatolik yuz berdi' } }
    }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    setUser(null)
    setSession(null)
    setIsAdmin(false)
    setLoading(false)
    localStorage.removeItem('admin_user')
    return { error }
  }

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