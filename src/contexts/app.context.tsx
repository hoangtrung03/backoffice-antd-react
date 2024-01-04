import { createContext, useState } from 'react'
import { UserType } from 'src/types/user.type'
import { getAccessTokenFromCookie, getProfileFromLS } from 'src/utils/auth'

interface AppContextInterface {
  isAuthenticated: boolean
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
  profile: UserType | null
  setProfile: React.Dispatch<React.SetStateAction<UserType | null>>
  reset: () => void
}

const initialAppContext: AppContextInterface = {
  isAuthenticated: Boolean(getAccessTokenFromCookie()),
  setIsAuthenticated: () => null,
  profile: getProfileFromLS(),
  setProfile: () => null,
  reset: () => null
}

export const AppContext = createContext<AppContextInterface>(initialAppContext)

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(initialAppContext.isAuthenticated)
  const [profile, setProfile] = useState<UserType | null>(initialAppContext.profile)
  const reset = () => {
    setIsAuthenticated(false)
    setProfile(null)
  }

  return (
    <AppContext.Provider value={{ isAuthenticated, setIsAuthenticated, profile, setProfile, reset }}>
      {children}
    </AppContext.Provider>
  )
}
