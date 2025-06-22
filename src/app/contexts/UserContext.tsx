"use client"

import type React from "react"

import { createContext, useContext, useState, type ReactNode, useEffect } from "react"
import { authService, type User } from "../services/authService"

interface UserContextType {
  user: User | null
  setUser: React.Dispatch<React.SetStateAction<User | null>>
  isLoading: boolean
  logout: () => Promise<void>
  checkAndRedirectIfAuthenticated: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Verificar sesión existente al cargar la aplicación
  useEffect(() => {
    const checkExistingSession = async () => {
      try {
        if (authService.isAuthenticated()) {
          const currentUser = await authService.getCurrentUser()
          if (currentUser) {
            setUser(currentUser)
            // Si hay una sesión válida, redirigir automáticamente
            const role = authService.getStoredRole()
            if (role) {
              authService.redirectToRoleFrontend(role)
              return
            }
          }
        }
      } catch (error) {
        console.error("Error al verificar sesión existente:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkExistingSession()
  }, [])

  const logout = async () => {
    try {
      await authService.logout()
      setUser(null)
      // Recargar la página para limpiar cualquier estado residual
      window.location.href = "/"
    } catch (error) {
      console.error("Error durante logout:", error)
    }
  }

  const checkAndRedirectIfAuthenticated = () => {
    if (authService.isAuthenticated()) {
      const role = authService.getStoredRole()
      if (role) {
        authService.redirectToRoleFrontend(role)
      }
    }
  }

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        isLoading,
        logout,
        checkAndRedirectIfAuthenticated,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export const useUserContext = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error("useUserContext must be used within a UserContextProvider")
  }
  return context
}
