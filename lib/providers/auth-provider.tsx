'use client'

import { createClient } from '@/lib/supabase/client'
import { getURL } from '@/lib/utils/helpers'
import { Session, User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import posthog from 'posthog-js'
import { createContext, useContext, useEffect, useState } from 'react'
import { toast } from 'sonner'

interface AuthContextProps {
  user: User | null | undefined
  session: Session | null | undefined
  emailLoading: boolean
  googleLoading: boolean
  verifyOtp: boolean
  isLoading: boolean
  signOut: () => Promise<void>
  signInWithGoogle: () => Promise<void>
  signInWithOtp: (email: string) => Promise<void>
  verifyOtpCode: (email: string, token: string) => Promise<void>
  signInWithPassword: (email: string, password: string) => Promise<void>
  signUpWithPassword: (email: string, password: string) => Promise<void>
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  session: null,
  emailLoading: false,
  googleLoading: false,
  verifyOtp: false,
  isLoading: false,
  signOut: async () => {},
  signInWithGoogle: async () => {},
  signInWithOtp: async (email: string) => {
    console.log('signInWithOtp', email)
  },
  verifyOtpCode: async (email: string, token: string) => {
    console.log('verifyOtpCode', email, token)
  },
  signInWithPassword: async (email: string, password: string) => {
    console.log('signInWithPassword', email)
  },
  signUpWithPassword: async (email: string, password: string) => {
    console.log('signUpWithPassword', email)
  }
})

export default function AuthProvider({
  children,
  serverSession
}: {
  children: React.ReactNode
  serverSession: Session | null | undefined
}) {
  const supabase = createClient()
  const router = useRouter()

  const [emailLoading, setEmailLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [verifyOtp, setVerifyOtp] = useState(false)
  const [session, setSession] = useState<Session | null | undefined>(
    serverSession
  )
  const [user, setUser] = useState<User | null | undefined>(serverSession?.user)

  // Sign Out
  const signOut = async () => {
    try {
      console.log('signing out...')
      const { error } = await supabase.auth.signOut()
      console.log('signed out')
      if (error) {
        console.error('Error signing out:', error)
        toast.error('Error signing out')
        return
      }

      // Clear local state
      setUser(null)
      setSession(null)

      // Force refresh to ensure all auth state is cleared
      window.location.href = '/login'
    } catch (error) {
      console.error('Error signing out:', error)
      toast.error('Error signing out')
    }
  }

  // Sign-In with Google
  const signInWithGoogle = async () => {
    posthog.capture('sign_in', { method: 'google' })
    setGoogleLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: getURL() + '/'
        }
      })
      if (error) {
        setGoogleLoading(false)
        toast.error('Error signing in with Google')
      } else {
        // Set up a listener for the auth state change
        const authListener = supabase.auth.onAuthStateChange(
          (event, session) => {
            if (event === 'SIGNED_IN' && session?.user?.email) {
              console.log('User signed in with email:', session.user.email)
              posthog.identify(session.user.id, {
                email: session.user.email
              })
              authListener.data.subscription.unsubscribe()
            }
          }
        )
      }
    } catch (error) {
      console.error('Error signing in with Google', error)
      toast.error('Failed to sign in with Google')
    } finally {
      setGoogleLoading(false)
    }
  }

  // Sign-In with OTP
  const signInWithOtp = async (email: string) => {
    posthog.capture('sign_in', { method: 'otp' })
    setEmailLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          shouldCreateUser: true
        }
      })

      if (error) throw error

      if (data) {
        setVerifyOtp(true)
        toast.success('OTP code sent to your email')
      }
    } catch (error) {
      console.error('Error sending OTP:', error)
      toast.error('Error sending OTP code')
    } finally {
      setEmailLoading(false)
    }
  }

  // Verify OTP Code
  const verifyOtpCode = async (email: string, token: string) => {
    setEmailLoading(true)
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'email'
      })

      if (error) throw error

      if (data.user) {
        setVerifyOtp(false)
        setUser(data.user)
        setSession(data.session)
        toast.success('Successfully signed in!')
        router.replace('/')
      }
    } catch (error) {
      console.error('Error verifying OTP:', error)
      toast.error('Invalid OTP code')
    } finally {
      setEmailLoading(false)
    }
  }

  // Sign in with password
  const signInWithPassword = async (email: string, password: string) => {
    posthog.capture('sign_in', { method: 'password' })
    setEmailLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      if (data.user) {
        setUser(data.user)
        setSession(data.session)
        toast.success('Successfully signed in!')
        router.replace('/')
      }
    } catch (error) {
      console.error('Error signing in with password:', error)
      toast.error('Invalid email or password')
    } finally {
      setEmailLoading(false)
    }
  }

  // Sign up with password
  const signUpWithPassword = async (email: string, password: string) => {
    posthog.capture('sign_up', { method: 'password' })
    setEmailLoading(true)
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: getURL() + '/'
        }
      })

      if (error) throw error

      if (data.user) {
        if (data.user.identities?.length === 0) {
          toast.error('Email already exists')
          return
        }

        if (data.session) {
          setUser(data.user)
          setSession(data.session)
          toast.success('Successfully signed up!')
          router.replace('/')
        } else {
          toast.success('Please check your email to confirm your account')
        }
      }
    } catch (error) {
      console.error('Error signing up with password:', error)
      toast.error('Error creating account')
    } finally {
      setEmailLoading(false)
    }
  }

  // Handle Auth State Changes and Initial Session
  useEffect(() => {
    // Get initial user state securely
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        console.log('Recovered session for user:', user.email)
        setUser(user)
        // Also get session data for completeness
        supabase.auth.getSession().then(({ data: { session } }) => {
          setSession(session)
        })

        // Identify user in PostHog if session is recovered
        posthog.identify(user.id, {
          email: user.email
        })
      } else {
        setSession(null)
        setUser(null)
      }
    })

    // Set up auth state change listener
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email)

      if (event === 'SIGNED_OUT') {
        setSession(null)
        setUser(null)
        router.push('/login')
      } else if (session) {
        // Verify user authenticity when session changes
        const {
          data: { user }
        } = await supabase.auth.getUser()
        if (user) {
          setSession(session)
          setUser(user)

          if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
            console.log('User session updated:', user.email)
            posthog.identify(user.id, {
              email: user.email
            })
          }
        }
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router, supabase])

  const exposed: AuthContextProps = {
    user,
    session,
    emailLoading,
    googleLoading,
    verifyOtp,
    isLoading: emailLoading || googleLoading,
    signOut,
    signInWithGoogle,
    signInWithOtp,
    verifyOtpCode,
    signInWithPassword,
    signUpWithPassword
  }

  return <AuthContext.Provider value={exposed}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used inside AuthProvider')
  } else {
    return context
  }
}
