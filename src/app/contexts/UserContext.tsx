'use client'

import { createContext, useContext, useState, ReactNode, useEffect } from 'react'

// Define el tipo de datos del usuario
interface User {
  username: string
  email: string
  role: string
}

const UserContext = createContext<
  | {
      user: User | null
      setUser: React.Dispatch<React.SetStateAction<User | null>>
    }
  | undefined
>(undefined)

export const UserContextProvider = ({ children }: { children: ReactNode }) => {
  // Estado del usuario
  const [user, setUser] = useState<User | null>(null)

  // Accede a sessionStorage solo en el cliente
  useEffect(() => {
    const storedUser = sessionStorage.getItem('user')
    // Solo establecer usuario si está presente en sessionStorage
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, []) // Solo se ejecuta una vez, después del montaje en el cliente

  // Guardar el usuario en sessionStorage cuando se actualiza el estado
  useEffect(() => {
    if (user) {
      // Cuando el usuario cambia, lo guardamos en sessionStorage
      sessionStorage.setItem('user', JSON.stringify(user))
    } else {
      // Si no hay usuario, eliminamos del sessionStorage
      sessionStorage.removeItem('user')
    }
  }, [user])

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>
}

export const useUserContext = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUserContext must be used within a UserContextProvider')
  }
  return context
}
