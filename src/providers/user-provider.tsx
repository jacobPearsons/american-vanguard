'use client'

import { createContext, useContext, ReactNode } from 'react'
import { useUser as useClerkUser } from '@clerk/nextjs'

interface UserContextType {
  user: any
  isLoading: boolean
  profile: any
  resume: any
}

const UserContext = createContext<UserContextType>({
  user: null,
  isLoading: true,
  profile: null,
  resume: null,
})

export const useUser = () => useContext(UserContext)

interface UserProviderProps {
  children: ReactNode
}

export function UserProvider({ children }: UserProviderProps) {
  const { user, isLoaded: isLoading } = useClerkUser()

  return (
    <UserContext.Provider 
      value={{ 
        user: user ? {
          id: user.id,
          email: user.emailAddresses[0]?.emailAddress,
          firstName: user.firstName,
          lastName: user.lastName,
          image: user.imageUrl,
        } : null, 
        isLoading, 
        profile: null, 
        resume: null 
      }}
    >
      {children}
    </UserContext.Provider>
  )
}
