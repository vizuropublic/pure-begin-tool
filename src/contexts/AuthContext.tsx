import React, { createContext, useState } from 'react'

export interface UserProfile {
  id: string
  email: string
  name: string
  role: string
  created_at?: string
  updated_at?: string
}

interface AuthContextType {
  user: any | null
  session: any | null
  userProfile: UserProfile | null
  signOut: () => Promise<void>
  isLoading: boolean
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  userProfile: null,
  signOut: async () => {},
  isLoading: false,
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user] = useState({ id: 'demo-user', email: 'demo@example.com' })
  const [session] = useState({ user: { id: 'demo-user', email: 'demo@example.com' } })
  const [userProfile] = useState<UserProfile>({
    id: 'demo-user',
    email: 'demo@example.com',
    name: 'Demo User',
    role: 'admin',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  })
  const [isLoading] = useState(false)

  const signOut = async () => {
    console.log('Mock sign out')
  }

  const value = {
    user,
    session,
    userProfile,
    signOut,
    isLoading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
