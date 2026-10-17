import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

interface AuthState {
  session: Session | null
  isAdmin: boolean
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [initialized, setInitialized] = useState(false)
  
  // Baca status admin dari cache lokal agar tidak ada kedipan (flicker) tombol saat refresh
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      return localStorage.getItem('hpon_is_admin') === 'true'
    } catch {
      return false
    }
  })
  
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setInitialized(true)
      setLoading(false)
      return
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setInitialized(true)
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s)
      if (!s) {
        setIsAdmin(false)
        try { localStorage.removeItem('hpon_is_admin') } catch {}
      }
    })

    return () => sub.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!initialized) return
    if (!session) {
      setIsAdmin(false)
      try { localStorage.removeItem('hpon_is_admin') } catch {}
      setLoading(false)
      return
    }

    supabase
      .from('admin_users')
      .select('user_id')
      .eq('user_id', session.user.id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!error && data) {
          setIsAdmin(true)
          try { localStorage.setItem('hpon_is_admin', 'true') } catch {}
        } else {
          setIsAdmin(false)
          try { localStorage.removeItem('hpon_is_admin') } catch {}
        }
        setLoading(false)
      })
      .catch(() => {
        setIsAdmin(false)
        try { localStorage.removeItem('hpon_is_admin') } catch {}
        setLoading(false)
      })
  }, [session, initialized])

  const signOut = async () => {
    try { localStorage.removeItem('hpon_is_admin') } catch {}
    if (isSupabaseConfigured) {
      await supabase.auth.signOut()
    }
    setSession(null)
    setIsAdmin(false)
  }

  return (
    <AuthContext.Provider value={{ session, isAdmin, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
