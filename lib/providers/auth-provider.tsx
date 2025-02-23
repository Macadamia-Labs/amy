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
    await supabase.auth.signOut()
    setUser(null)
    setSession(null)
    router.push('/login')
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
    verifyOtpCode
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
